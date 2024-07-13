#!/bin/bash

#替换版本号
cd dist
system=`uname`
version=$1
if [ "$system" == "Darwin" ]; then
  #mac
  sed -i ".js" 's/_VERSION_/'$version'/i' *.js
else
  #linux
  sed -i 's/_VERSION_/'$version'/i'  *.js
fi
cd ..
zip -r admin-$version.zip dist
