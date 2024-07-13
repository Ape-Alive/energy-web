#!/bin/bash

./prebuild.sh
umi build
./postbuild.sh $1
