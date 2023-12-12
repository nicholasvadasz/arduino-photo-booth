#include "arduino_code.h"

// test transition 1-1
bool testTransiton1_1() {

}

// test transition 1-2
bool testTransiton1_2() {

}

// test transition 2-1
bool testTransiton2_1() {

}

// test transition 2-2
bool testTransiton2_2() {

}

// test toggleFilter
bool testToggleFilter() {

}

// test catISR
bool testCatISR() {

}

// test WDT
bool testWDT() {

}

// runAllTests
bool runAllTests() {
  if (!testTransition1_1()) {
    Serial.println("Test Transition 1-1 Failed.");
    return false;
  } else if (!testTransition1_2()) {
    Serial.println("Test Transition 1-2 Failed.");
    return false;
  } else if (!testTransition2_1()) {
    Serial.println("Test Transition 2-1 Failed.");
    return false;
  } else if (!testTransition2_2()) {
    Serial.println("Test Transition 2-2 Failed.");
    return false;
  } else if (!testToggleFilter()) {
    Serial.println("Test Toggle Filter Failed.");
    return false;
  } else if (!testCatISR()) {
    Serial.println("Test Cat ISR Failed.");
    return false;
  } else if (!testWDT()) {
    Serial.println("Test WDT Failed.");
    return false;
  } else {
    return true
  }
}
