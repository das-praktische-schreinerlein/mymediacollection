#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Favorites" "favorites" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Metal-Favorites" "metal" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Punk Favorites" "punk" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Hardcore Favorites" "hardcore" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Psychobilly-Favorites" "psychobilly" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Country-Favorites" "country" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Hardrock-Favorites" "hardrock" "all" "" "" "" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-favorites" "Favorites,Metal-Favorites,Punk Favorites,Hardcore Favorites,Psychobilly-Favorites,Country-Favorites,Hardrock-Favorites" "all-favorites" "all" "" "" "" "showall" "" createhtml


${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Favorites" "favorites-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Metal-Favorites" "metal-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Punk Favorites" "punk-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Hardcore Favorites" "hardcore-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Psychobilly-Favorites" "psychobilly-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Country-Favorites" "country-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Hardrock-Favorites" "hardrock-top" "all" "flat" "flat" "8" "showall"
${SCRIPTPATH}/mediaexport.sh "dev" "${W_AUDIO_EXPORT_BASEDIR}Musike-top-flat" "Favorites,Metal-Favorites,Punk Favorites,Hardcore Favorites,Psychobilly-Favorites,Country-Favorites,Hardrock-Favorites" "all-favorites-top" "all" "flat" "flat" "8" "showall" "" createhtml
