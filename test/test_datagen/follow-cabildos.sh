#!/bin/sh
IFS=$'\n' read -d '' -r -a cabildos < idCabildo.txt
IFS=$'\n' read -d '' -r -a users < idUser.txt

for c_index in ${!cabildos[@]}; do
    for u_index in ${!users[@]}; do
        idOne=${users[$u_index]}
        idTwo=${cabildos[$c_index]}
        if [ $idOne != $idTwo ]; then
            data='{"data":{"follower":"'$idOne'","followed":"'$idTwo'"}}'
            echo $data
            curl -H 'Content-Type: application/json' -d$data http://localhost:3000/users/followcabildo
            echo
        fi
    done
done
