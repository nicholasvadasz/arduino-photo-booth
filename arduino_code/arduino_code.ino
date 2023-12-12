#include <avr/wdt.h>
#include "arduino_code.h"

const int toggleFilterButtonPin = 0;         // Button connected to digital pin 0
const int takePhotoButtonPin = 1;            // Another button connected to digital pin 1
const int brightnessPotentiometerPin = A1;   // Potentiometer 1 connected to analog pin A1
const int saturationPotentiometer2Pin = A2;  // Potentiometer 2 connected to analog pin A2
const int brightnessLedPin = 6;              // LED connected to digital pin 6
const int saturationLedPin = 5;              // LED connected to digital pin 5
const int takingPhotoLedPin = 4;             // LED connected to digital pin 4

bool takePhoto = false;
bool renderDone = false;
bool firstPhoto = true;
filter currFilterSetting = NO_FILTER;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin1, INPUT);
  pinMode(buttonPin2, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  static state CURRENT_STATE = sWAIT_FOR_INPUT;
  if (digitalRead(takePhotoButtonPin) == HIGH && CURRENT_STATE == sWAIT_FOR_INPUT) {
    takePhoto = true;
  }
  if (digitalRead(toggleFilterButtonPin) == HIGH) {
    toggleFilter();
  }
  updateLEDs();
  CURRENT_STATE = updateFSM(CURRENT_STATE, millis(), s_last_action);
  delay(10);
}

void toggleFilter() {
  switch(currFilterSetting){
    case NO_FILTER:
      currFilterSetting = SWIRL_FILTER;
      break;
    case SWIRL_FILTER:
      currFilterSetting = GRAYSCALE_FILTER;
      break;
    case GRAYSCALE_FILTER:
      currFilterSetting = MIRROR_FILTER;
      break;
    case MIRROR_FILTER:
      currFilterSetting = INVERT_FILTER;
      break;
    case INVERT_FILTER:
      currFilterSetting = NO_FILTER;
      break;
    default:
      currFilterSetting = NO_FILTER;
      break;
  }
}

void updateLEDs() {
  int brightnessLedBrightness = map(analogRead(brightnessPotentiometerPin), 0, 1023, 0, 255);
  analogWrite(brightnessLedPin, brightnessLedBrightness);
  int saturationLedBrightness = map(analogRead(saturationPotentiometerPin), 0, 1023, 0, 255);
  analogWrite(saturationLedPin, saturationLedBrightness);
}

void photoLedOn() {
  digitalWrite(takingPhotoLedPin, HIGH);
}

void photoLedOff() {
  digitalWrite(takingPhotoLedPin, LOW);
}

state updateFSM(state curState, unsigned long mils, action lastActionTaken) {
  state nextState = curState;
  switch(curState) {
    case sWAIT_FOR_INPUT:
      if (takePhoto) { // 1-2 Transition
        // flash LED to indicate picture taken
        photoLedOn();
        // send data to 
        Serial.print(currFilterSetting));
        Serial.print(" ");
        Serial.print(analogRead(brightnessPotentiometerPin));
        Serial.print(" ");
        Serial.println(analogRead(saturationPotentiometerPin));
        Serial.print(" ");
        Serial.print(1);
        takePhoto = false;
        firstPhoto = false;
        nextState = sCOMMUNICATING;
      } else {
        if (!firstPhoto) {
          // chris' stuff to update photo already taken
        }
        nextState = sWAIT_FOR_INPUT;
      }
      break;
    case sWAIT_FOR_ACK:
      if (renderDone) {
        photoLedOff();
        nextState = sWAIT_FOR_INPUT;
        renderDone = false; 
      } else {
        nextState = sWAIT_FOR_ACK;
      }
      break;
    default:
      Serial.println("State Unrecognized");
      break;
  }
  return nextState;
}

