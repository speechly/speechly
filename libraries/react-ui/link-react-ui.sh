#!/bin/bash
source .env

if [ -z "$SPEECHLY_REACT_UI_PATH" ]
  then
    echo "ERROR: Environment variable SPEECHLY_REACT_UI_PATH needs to be set either in the shell or in .env file"
    exit 1
fi

HARDLINK_SOURCE=$SPEECHLY_REACT_UI_PATH/src
# /Users/arzga/Documents/Speechly/git/react-ui/components/src/components
HARDLINK_DEST=src/@speechly/react-ui/

if [ ! -d "$HARDLINK_SOURCE" ]; then
    echo "ERROR: Source folder '$HARDLINK_SOURCE' does not exist"
    exit 1
fi

pushd $HARDLINK_SOURCE
ABS_HARDLINK_SOURCE=`pwd`
popd

if [ -e "$HARDLINK_DEST" ]; then
    echo
    echo ============ LOCAL CHANGES IN ============

    rsync -au --out-format="%n" --dry-run $HARDLINK_DEST $ABS_HARDLINK_SOURCE

    echo ==========================================
    echo LOCAL: $HARDLINK_DEST
    echo
    read -p "Do you wish to backport? [y/n] " yn
    if echo "$yn" | grep -iq "^y" ;then
        rsync -au -vv $HARDLINK_DEST $ABS_HARDLINK_SOURCE | grep "is newer"
    fi

    echo
    echo "WARNING: Replacing previous content:"
    ls $HARDLINK_DEST

    read -p "Do you wish to proceed? [y/n] " yn
    if ! echo "$yn" | grep -iq "^y" ;then
        echo "Cancelled"
        exit 1
    fi
    rm -rf $HARDLINK_DEST
fi

mkdir -p $HARDLINK_DEST

pushd $HARDLINK_DEST
ABS_HARDLINK_DEST=`pwd`
popd

echo
echo Linking content from:
echo $ABS_HARDLINK_SOURCE
echo
echo To:
echo $HARDLINK_DEST
echo

pushd $ABS_HARDLINK_SOURCE
pax -rwl . $ABS_HARDLINK_DEST
popd

echo
echo "OK"
