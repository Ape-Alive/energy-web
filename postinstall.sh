#!/bin/bash

#替换node_modules/@ant-design/pro-layout/es/getPageTitle.js
system=`uname`
if [ "$system" == "Darwin" ]; then
  #mac
  sed -i ".js" 's/title: "".concat(pageName, " - ").concat(title)/title:"".concat(pageName,"-").concat(window.title)/i' node_modules/@ant-design/pro-layout/es/getPageTitle.js
else
  #linux
  sed -i 's/title: "".concat(pageName, " - ").concat(title)/title:"".concat(pageName,"-").concat(window.title)/i' node_modules/@ant-design/pro-layout/es/getPageTitle.js
fi
