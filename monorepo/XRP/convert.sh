#!/bin/bash

while read line
do
  cp ./json/$line ./conv/$line
done < con.txt