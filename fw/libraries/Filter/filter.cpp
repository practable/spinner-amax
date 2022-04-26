#include "filter.h"

Filter::Filter(float coeffA, float coeffB) {
  a = coeffA;
  b = coeffB;
  y_last = 0;
  y_current = 0;
}

long Filter::update(long x) {

  float xf = (float) x;

  y_last = y_current;
  
  y_current = (xf * b) - (a * y_last);

  return (float) y_current;	

}

long Filter::getValue(void) {
  return (long) y_current;
}

float Filter::getCoeffA(void) {
  return a;
}

float Filter::getCoeffB(void) {
  return b;
}

void Filter::setCoeffs(float coeffA, float coeffB) {
  a = coeffA;
  b = coeffB;
}

