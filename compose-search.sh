#!/bin/bash

USAGE="./compose-search [users/activities/cabildos] [query]"
TYPE=$1
QUERY=$2
SERVER=www.cibic.app/api
#SERVER=192.168.8.204:4242
TOK=$(curl -H 'Content-Type: application/json' -d '{"user":{"email":"smonroe@gmail.fake","password":"arealpassword"}}' $SERVER/auth/login | perl -pe 's/"access_token"://; s/^"//; s/",$//' | sed 's/"//g' | sed 's/{//g' | sed 's/}//g')
printf -v auth "Authorization: Bearer %s" $TOK
printf -v search "{\"search\":{\"query\":\"$QUERY\"}}"

if [ -z $QUERY ]
then
	echo -e $USAGE
elif [ $TYPE = "users" ] || [ $TYPE = "activities" ] || [ $TYPE = "cabildos" ]
then
	curl -H 'Content-Type: application/json' -H "$auth" --data $search $SERVER/search/$TYPE
else
	curl -H 'Content-Type: application/json' -H "$auth" --data $QUERY $SERVER/$TYPE
fi
