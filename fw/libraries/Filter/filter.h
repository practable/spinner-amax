#ifndef FILTER_FILTER_H_
#define FILTER_FILTER_H_
#endif

// Implements a single pole low pass filter
// y[n] = (b * x[n]) - (a * y[n-1])
// See https://ccrma.stanford.edu/~jos/fp/One_Pole.html#20714
// We are expecting to use this on integer values
// in long format, that represent position according 
// to a rotary encoder. We'll use floats internally,
// same as RotaryPlant class does.

class Filter{

  float a, b; //filter coefficients
  float y_current; // current output value
  float y_last; // last output value
    

public:
  Filter(float coeffA, float coeffB);
  long update(long x);
  long getValue(void);
  float getCoeffA(void);
  float getCoeffB(void);
  void setCoeffs(float coeffA, float coeffB);
};

