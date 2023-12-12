typedef enum {
  sWAIT_FOR_INPUT = 1,
  sCOMMUNICATING = 2,
  sWAIT_FOR_ACK = 3,
} state;

typedef enum {
  NO_FILTER = 1,
  SWIRL_FILTER = 2,
  GRAYSCALE_FILTER = 3,
  MIRROR_FILTER = 4,
  INVERT_FILTER = 5,
} filter;

void toggleFilter();
void updateLEDs();
void photoLedOn();
void photoLedOff();
state updateFSM(state curState, long mils, action lastActionTaken);