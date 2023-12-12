bool testTransition1_1() {
  state expectedState = sWAIT_FOR_INPUT;
  state actualState = updateFSM(sWAIT_FOR_INPUT);
  if (expectedState != actualState) {
    Serial.print("Expected sWAIT_FOR_INPUT but got ");
    Serial.println(actualState);
    return false;
  }
  return true;
}

bool testTransition1_2() {
  takePhoto = true;
  state expectedState = sWAIT_FOR_ACK;
  state actualState = updateFSM(sWAIT_FOR_INPUT);
  if (expectedState != actualState) {
    Serial.print("Expected sWAIT_FOR_ACK but got ");
    Serial.println(actualState);
    return false;
  }
  return true;
}

bool testTransition2_1() {
  renderDone = true;
  state expectedState = sWAIT_FOR_INPUT;
  state actualState = updateFSM(sWAIT_FOR_ACK);
  if (expectedState != actualState) {
    Serial.print("Expected sWAIT_FOR_INPUT but got ");
    Serial.println(actualState);
    return false;
  }
  return true;
}

bool testTransition2_2() {
  state expectedState = sWAIT_FOR_ACK;
  state actualState = updateFSM(sWAIT_FOR_ACK);
  if (expectedState != actualState) {
    Serial.print("Expected sWAIT_FOR_ACK but got ");
    Serial.println(actualState);
    return false;
  }
  return true;
}

bool testToggleFilter() {
  filter testFilter = GRAYSCALE_FILTER;
  testFilter = toggleFilter(testFilter);
  if (testFilter != SEPIA_FILTER) {
    Serial.print("Expected SEPIA_FILTER but got ");
    Serial.println(testFilter);
    return false;
  }

  testFilter = INVERT_FILTER;
  testFilter = toggleFilter(testFilter);
  if (testFilter != NO_FILTER) {
    Serial.print("Expected NO_FILTER but got ");
    Serial.println(testFilter);
    return false;
  }

  return true;
}

bool testCatISR() {
  catISR();
  if (!cat) {
    Serial.println("cat is false");
  }
  return cat;
}

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
  } else {
    Serial.println("All tests passed!");
    return true;
  }
}
