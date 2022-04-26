#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Apr 26 18:53:21 2022

@author: tim
"""
from ctypes import *
import os
os.system('./compile.sh')
so_file = './filter.so'
filter_functions = CDLL(so_file)

print(type(filter_functions))