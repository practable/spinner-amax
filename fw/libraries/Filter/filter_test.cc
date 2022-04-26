//filter_test.cc

#include <gtest/gtest.h>
#include "filter/filter.h"

TEST(Filter, NilFilter) {

  Filter f = Filter(1,0);
  
  long y;

  y = f.value();

  EXPECT_TRUE(y == 0) << y;
 
}

TEST(Filter, FourNinesMillis) {

  unsigned long i = 	9999;  
  float t0 = (float) i;
  float t1 = (float) i+1;
  EXPECT_TRUE(t1 > t0);
  
}






