#!/bin/sh
IFS=$'\n' read -d '' -r -a lines < idUser.txt
for i in ${!lines[@]}; do
    for j in ${!lines[@]}; do
        idOne=${lines[$j]}
        idTwo=${lines[$i]}
        if [ $idOne != $idTwo ]; then
            data='{"data":{"follower":"'$idOne'","followed":"'$idTwo'"}}'
            echo $data
            curl -H 'Content-Type: application/json' -d$data http://localhost:3000/users/followuser
            echo
        fi
    done
done
