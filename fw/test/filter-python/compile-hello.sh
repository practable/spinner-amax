#!/bin/bash
# https://stackoverflow.com/questions/5539557/boost-and-python-3-x

#The following directory should be added to compiler include paths:
#
#    /usr/local/boost_1_76_0
#
#The following directory should be added to linker library paths:
#
#    /usr/local/boost_1_76_0/stage/lib

g++ -fPIC -shared -o hello.so hello.cpp -I /usr/include/python3.8 -I /usr/local/boost_1_76_0/stage/lib  -L /usr/local/boost_1_76_0 -lboost_python38 -lpython3.8



