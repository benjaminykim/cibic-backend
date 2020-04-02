#!/bin/sh
IFS=$'\n' read -d '' -r -a lines < ~/idUser.txt

temp=~/curlResponse.log
output=~/idCabildo.txt
rm -f $temp
rm -f $output
touch $temp
touch $output

cabildos=("cabildo-uno" "cabildo-dos" "cabildo-tres")
for i in ${!lines[@]}; do
    idUser=${lines[$i]}
    curl -H "Content-Type: application/json" -d'{"cabildo": {
        "name": "'${cabildos[$i]}'",
        "members": [],
        "moderators": [],
        "admin": "'${idUser}'",
        "location": "42sv",
        "issues": [],
        "meetings": [],
        "files": []
    }}' http://localhost:3000/cabildos >> $temp 2>&1
    if [ "$i" == 2 ]; then
        break
    fi
done
grep -o ':".*"' $temp | sed 's/[:"]//g' >> $output
rm -f $temp
cat $output
