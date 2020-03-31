#!/bin/sh
rm -f ~/idUser.txt
rm -f ~/idCabildo.txt

sh ./create-users.sh
sh ./create-cabildos.sh
sh ./follow-users.sh
sh ./follow-cabildos.sh
sh ./create-activities.sh

#rm -f ~/idUser.txt
#rm -f ~/idCabildo.txt
