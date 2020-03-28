#!/bin/sh
IFS=$'\n' read -d '' -r -a users < ~/idUser.txt
IFS=$'\n' read -d '' -r -a follow < ~/idUser.txt

for i in ${!users[@]}; do
    for j in ${!follow[@]}; do
        idOne=${users[$j]}
        idTwo=${follow[$i]}
        if [ $idOne != $idTwo ]; then
            data='{"data":{"follower":"'$idOne'","followed":"'$idTwo'"}}'
            echo $data
            curl -H 'Content-Type: application/json' -d$data http://localhost:3000/users/followuser
            echo
        fi
    done
done
