typedef enum {
  sWAIT_FOR_INPUT = 1,
  sWAIT_FOR_ACK = 2,
} state;

typedef enum {
  GRAYSCALE_FILTER = 1,
  SEPIA_FILTER = 2,
  BLUR_FILTER = 3,
  INVERT_FILTER = 4,
  NO_FILTER = 5,
} filter;

void toggleFilter();
void catISR();
void updateLEDs();
void photoLedOn();
void photoLedOff();
state updateFSM(state curState, long mils);