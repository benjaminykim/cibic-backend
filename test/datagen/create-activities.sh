#!/bin/sh
IFS=$'\n' read -d '' -r -a users < ~/idUser.txt
IFS=$'\n' read -d '' -r -a cabildos < ~/idCabildo.txt

temp=~/curlResponse.log
output=~/idActivity.txt

rm -f $temp
rm -f $output
touch $temp
touch $output

for u_index in ${!users[@]}; do
    for c_index in ${!cabildos[@]}; do
	curl -H "Content-Type: application/json" -d'{"activity": {
		"idUser": "'${users[u_index]}'",
		"idCabildo": "'${cabildos[c_index]}'",
		"activityType": "discussion",
		"score": 0,
		"commentNumber": 0,
		"publishDate": 0,
		"title": "asdf",
		"text": "asdf",
		"comments": [],
		"reactions": [],
		"votes": []
	    }}' http://localhost:3000/activity >> $temp 2>&1
    done
done
grep -o ':".*"' $temp | sed 's/[:"]//g' >> $output
rm -f $temp
cat $output
