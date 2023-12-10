#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

# check parameters
if [ "$#" -ne 1 ]; then
    dofail "USAGE: dataimport-01-prepare-files-for-import-database.sh \nFATAL: requires CONFIGPROFILE parameter " 1
    exit 1
fi

CONFIGPROFILE=${1}

echo "start - prepare file import"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

# check parameters
cd ${MYMM}
CONFGFILE="${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json"
if [ ! -f "${CONFGFILE}" ]; then
    dofail "USAGE: dataimport-01-prepare-files-for-import-database.sh CONFIGPROFILE  \nFATAL: CONFGFILE not exists '${CONFGFILE}' " 1
fi
CLICONFGFILE="${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json"
if [ ! -f "${CLICONFGFILE}" ]; then
    dofail "USAGE: dataimport-01-prepare-files-for-import-database.sh CONFIGPROFILE \nFATAL: CLICONFGFILE not exists '${CLICONFGFILE}' " 1
fi

if [ "${AUTOSTARTIMPORT}" != "true" ]; then
  echo "OPEN: Do you want to start audio import from '${AUDIO_BASEDIR}'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

SKIPIMPORT=false
cd ${MYMM}
if [ -f "${AUDIO_BASEDIR}mediadb_import-import-files.json" ]; then
  echo "WARNING: importfile already exists '${AUDIO_BASEDIR}mediadb_import-import-files.json'?"
  echo "OPEN: do you want to skip generating import-file from '${AUDIO_BASEDIR}'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes )
            SKIPIMPORT=true
            break;;
          No )
            break;;
      esac
  done
fi

if [ "${SKIPIMPORT}" != "true" ]; then
  echo "now: generate import-files"
  cd ${MYMM}
  rm -f "${AUDIO_BASEDIR}mediadb_import-import-files.log"
  rm -f "${AUDIO_BASEDIR}mediadb_import-import-files.json"
  node dist/backend/serverAdmin.js\
      --adminclibackend "${CLICONFGFILE}"\
      --backend "${CONFGFILE}"\
      --command mediaManager\
      --action generateMediaDocsFromMediaDir\
      --importDir ${W_AUDIO_BASEDIR}\
      --importMappingFile ${CONFIG_BASEDIR}import-mapping.json\
      --debug true\
      --outputFile ${AUDIO_BASEDIR}mediadb_import-import-files.json > ${AUDIO_BASEDIR}mediadb_import-import-files.log
  if [ "${AUTOSTARTIMPORT}" != "true" ]; then
    echo "OPTIONAL YOUR TODO: fix import-files (band-names...)"
    echo "OPEN: Did fix this files in editor '${AUDIO_BASEDIR}mediadb_import-import-files.json'?"
    select yn in "Yes"; do
        case $yn in
            Yes ) break;;
        esac
    done
  fi
fi

echo "now: importing import-file"
cd ${MYMM}
node dist/backend/serverAdmin.js\
    --debug\
    --command loadMediaDoc\
    --action loadDocs\
    --adminclibackend "${CLICONFGFILE}"\
    --backend "${CONFGFILE}"\
    --file ${W_AUDIO_BASEDIR}mediadb_import-import-files.json

echo "done - file import: '${AUDIO_BASEDIR}'"
