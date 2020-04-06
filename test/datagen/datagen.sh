#!/bin/sh
rm -f ~/idUser.txt
rm -f ~/idCabildo.txt
rm -f ~/curlResponse.log
touch ~/curlResponse.log

sh ./create-users.sh
sh ./create-cabildos.sh
sh ./follow-users.sh
sh ./follow-cabildos.sh
sh ./create-activities.sh
