//filter_test.cc

#include <gtest/gtest.h>
#include <filter.h>

TEST(Filter, NilFilter) {

  Filter f = Filter(0,1);
  
  long y;

  y = f.value();

  EXPECT_EQ(y, 0) << "y = " << y;

  y = f.update(1);

  EXPECT_EQ(y, 1) << "y = " << y;

  y = f.update(0);

  EXPECT_EQ(y, 0) << "y = " << y;

  y = f.update(1);
  
  EXPECT_EQ(y, 1) << "y = " << y;
 
}



TEST(Filter, LowPassFilter) {

  Filter f = Filter(0.5,1);
  
  long y;

  y = f.value();

  EXPECT_EQ(y, 0) << "y = " << y;

  y = f.update(1);

  EXPECT_EQ(y, 1) << "y = " << y;

  y = f.update(0);

  EXPECT_EQ(y, 0) << "y = " << y;

  y = f.update(1);
  
  EXPECT_EQ(y, 1) << "y = " << y;
 
}





