#include "arduino_code.h"
#include <Adafruit_SleepyDog.h>

const int toggleFilterButtonPin = 0;         // Button connected to digital pin 0
const int takePhotoButtonPin = 1;            // Another button connected to digital pin 1
const int brightnessPotentiometerPin = A1;   // Potentiometer 1 connected to analog pin A1
const int saturationPotentiometerPin = A2;   // Potentiometer 2 connected to analog pin A2
const int brightnessLedPin = 6;              // LED connected to digital pin 6
const int saturationLedPin = 7;              // LED connected to digital pin 7
const int takingPhotoLedPin = 8;             // LED connected to digital pin 8
unsigned long lastStateChangeTime = 0;
const int stateTimeout = 60000;   

bool takePhoto = false;
bool renderDone = false;
bool firstPhoto = true;
bool cat = false;
filter currFilterSetting = NO_FILTER;
static state CURRENT_STATE = sWAIT_FOR_INPUT;

void setup() {
  Serial.begin(9600);
  pinMode(toggleFilterButtonPin, INPUT);
  pinMode(takePhotoButtonPin, INPUT);
  pinMode(brightnessLedPin, OUTPUT);
  pinMode(saturationLedPin, OUTPUT);
  pinMode(takingPhotoLedPin, OUTPUT);
  Watchdog.enable(8000); 
}

void loop() {
  // runAllTests();
  Watchdog.reset();
  if (digitalRead(takePhotoButtonPin) == HIGH && CURRENT_STATE == sWAIT_FOR_INPUT) {
    takePhoto = true;
  }
  if (digitalRead(toggleFilterButtonPin) == HIGH) {
    toggleFilter(currFilterSetting);
  }
  updateLEDs();
  CURRENT_STATE = updateFSM(CURRENT_STATE);
  delay(10);
  if (millis() - lastStateChangeTime >= stateTimeout) {
    // Call your ISR here
    catISR();
    // Reset the time to avoid triggering the ISR continuously
    lastStateChangeTime = millis();
  }
}

// toggle filter helper method used to cycle through the different filters
filter toggleFilter(filter currFilterSetting) {
  switch(currFilterSetting){
    case GRAYSCALE_FILTER:
      currFilterSetting = SEPIA_FILTER;
      return SEPIA_FILTER;
    case SEPIA_FILTER:
      currFilterSetting = BLUR_FILTER;
      return BLUR_FILTER;
    case BLUR_FILTER:
      currFilterSetting = INVERT_FILTER;
      return INVERT_FILTER;
    case INVERT_FILTER:
      currFilterSetting = NO_FILTER;
      return NO_FILTER;
    case NO_FILTER:
      currFilterSetting = GRAYSCALE_FILTER;
      return GRAYSCALE_FILTER;
    default:
      currFilterSetting = NO_FILTER;
      return NO_FILTER;
  }
}

// ISR to send a message to server to display a cat picture
void catISR(){
  Serial.print(currFilterSetting);
  Serial.print(" ");
  Serial.print(analogRead(brightnessPotentiometerPin));
  Serial.print(" ");
  Serial.print(analogRead(saturationPotentiometerPin));
  Serial.print(" ");
  Serial.print(0);
  Serial.print(" ");
  Serial.println(1);
  cat = true;
}

// update the LEDs to reflect the current brightness and saturation settings
void updateLEDs() {
  int brightnessLedBrightness = map(analogRead(brightnessPotentiometerPin), 0, 1023, 0, 255);
  analogWrite(brightnessLedPin, brightnessLedBrightness);
  int saturationLedBrightness = map(analogRead(saturationPotentiometerPin), 0, 1023, 0, 255);
  analogWrite(saturationLedPin, saturationLedBrightness);
}

// turn on the LED to indicate that a photo is being taken
void photoLedOn() {
  digitalWrite(takingPhotoLedPin, HIGH);
}

// turn off the LED to indicate that a photo is no longer being taken
void photoLedOff() {
  digitalWrite(takingPhotoLedPin, LOW);
}

// update the FSM based on the current state
state updateFSM(state curState) {
  state nextState = curState;
  switch(curState) {
    case sWAIT_FOR_INPUT:
      if (takePhoto) { // 1-2 Transition
        // flash LED to indicate picture taken
        photoLedOn();
        // send data to 
        Serial.print(currFilterSetting);
        Serial.print(" ");
        Serial.print(analogRead(brightnessPotentiometerPin));
        Serial.print(" ");
        Serial.print(analogRead(saturationPotentiometerPin));
        Serial.print(" ");
        Serial.print(1);
        Serial.print(" ");
        Serial.println(0);
        takePhoto = false;
        firstPhoto = false;
        lastStateChangeTime = millis();
        nextState = sWAIT_FOR_ACK;
        cat = false;
      } else { // 1-1 Transition
        if (!firstPhoto) {
          if (cat) {
            Serial.print(currFilterSetting);
            Serial.print(" ");
            Serial.print(analogRead(brightnessPotentiometerPin));
            Serial.print(" ");
            Serial.print(analogRead(saturationPotentiometerPin));
            Serial.print(" ");
            Serial.print(0);
            Serial.print(" ");
            Serial.println(1);
          } else {
            Serial.print(currFilterSetting);
            Serial.print(" ");
            Serial.print(analogRead(brightnessPotentiometerPin));
            Serial.print(" ");
            Serial.print(analogRead(saturationPotentiometerPin));
            Serial.print(" ");
            Serial.print(0);
            Serial.print(" ");
            Serial.println(0);
          }
          
        }
        nextState = sWAIT_FOR_INPUT;
      }
      break;
    case sWAIT_FOR_ACK:
      if (renderDone) { // 2-1 Transition
        photoLedOff();
        nextState = sWAIT_FOR_INPUT;
        renderDone = false; 
      } else { // 2-2 Transition
        nextState = sWAIT_FOR_ACK;
        if (Serial.available() > 0){
          String receivedData = Serial.readStringUntil('\n');
          if (receivedData.equals("ack")) {
            renderDone = true;
          }
        }
      }
      break;
    default:
      Serial.println("State Unrecognized");
      break;
  }
  return nextState;
}

