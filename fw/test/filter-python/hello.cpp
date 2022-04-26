//https://www.boost.org/doc/libs/1_68_0/libs/python/doc/html/tutorial/index.html

char const* greet()
{
   return "hello, world";
}

#include <boost/python.hpp>

BOOST_PYTHON_MODULE(hello)
{
    using namespace boost::python;
    def("greet", greet);
}
