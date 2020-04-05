#!/bin/sh
rm -f ~/idUser.txt
rm -f ~/idCabildo.txt
<<<<<<< HEAD
=======
rm -f ~/curlResponse.log
touch ~/curlResponse.log
>>>>>>> devel-bkim-feed

sh ./create-users.sh
sh ./create-cabildos.sh
sh ./follow-users.sh
sh ./follow-cabildos.sh
<<<<<<< HEAD

rm -f ~/idUser.txt
rm -f ~/idCabildo.txt
=======
sh ./create-activities.sh

#rm -f ~/idUser.txt
#rm -f ~/idCabildo.txt
>>>>>>> devel-bkim-feed
