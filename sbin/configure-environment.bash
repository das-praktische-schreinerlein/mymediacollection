#!/bin/bash
MYSCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

CONFIG_BASEDIR=config/
MYCMS=${MYSCRIPTPATH}/../
W_CONFIG_BASEDIR="config\\"
W_MYCMS="..\\"

START_ADMINSERVER=true
AUTOSTARTIMPORT=false
AUTOSTARTEXPORT=true
