const int buttonPin1 = 0;             // Button connected to digital pin 0
const int buttonPin2 = 1;             // Another button connected to digital pin 1
const int potentiometer1Pin = A1;    // Potentiometer 1 connected to analog pin A1
const int potentiometer2Pin = A2;    // Potentiometer 2 connected to analog pin A2
const int ledPin = 6;                // LED connected to digital pin 6

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin1, INPUT);
  pinMode(buttonPin2, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Check if either button connected to pin 0 or pin 1 is pressed
  int pot1Value = analogRead(potentiometer1Pin);
  int pot2Value = analogRead(potentiometer2Pin);
  if (digitalRead(buttonPin1) == HIGH) {

    // Print button values and potentiometer values on the same line
    Serial.print(digitalRead(buttonPin2));
    Serial.print(" ");
    Serial.print(pot1Value);
    Serial.print(" ");
    Serial.println(pot2Value);
  }
    // Use the potentiometer value to control the LED brightness
    // Read values from potentiometers
    
    int ledBrightness = map(pot1Value, 0, 1023, 0, 255);
    analogWrite(ledPin, ledBrightness);

    // Delay to avoid sending data too frequently (adjust as needed)
    delay(100);
   
}
