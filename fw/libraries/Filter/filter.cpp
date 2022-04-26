#include "filter.h"

Filter::Filter(float coeff_a, float coeff_b) {
  a = coeff_a;
  b = coeff_b;
  y_last = 0;
  y_current = 0;
}

long Filter::update(long x) {

  float xf = (float) x;

  y_last = y_current;
  
  y_current = (xf * b) - (a * y_last);

  return (float) y_current;	

}

long Filter::value(void) {
  return (long) y_current;
}
