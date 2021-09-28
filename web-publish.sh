#!/bin/bash

if [ -z "$1" ]
  then
    echo "ERROR: Need a name of a version to copy dev folder to: e.g. 'v5'"
    exit 1
fi


VER=$1

echo
echo "Copying 'docs/dev/*' to 'docs/dev/$VER'"
rsync --delete docs/dev/ docs/$VER

echo "- Text substitutions '/dev/' --> '/$VER/'"

sed -i.bak -e "s/\/dev\//\/$VER\//g" docs/$VER/index.html
rm docs/$VER/index.html.bak

sed -i.bak -e "s/\/dev\//\/$VER\//g" docs/$VER/extras.html
rm docs/$VER/extras.html.bak

echo "Copying 'docs/dev/*' to 'docs/latest'"
rsync --delete docs/dev/ docs/latest

echo "- Text substitutions '/dev/' --> '/latest/'"

sed -i.bak -e "s/\/dev\//\/latest\//g" docs/latest/index.html
rm docs/latest/index.html.bak

sed -i.bak -e "s/\/dev\//\/latest\//g" docs/latest/extras.html
rm docs/latest/extras.html.bak

echo OK
echo
