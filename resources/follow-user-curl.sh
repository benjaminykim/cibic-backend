#!/bin/sh
idOne=$(curl -H "Content-Type: application/json" -d'{"user":{
    "username": "first", 
    "email": "first@gmail.fake", 
    "password": "password", 
    "firstName": "uno", 
    "middleName": "persona", 
    "lastName": "aqui", 
    "maidenName": "ahora", 
    "phone": 3211231234, 
    "rut": "1234567891", 
    "cabildos": [],
    "files": "none",
    "followers": [],
    "following": [],
    "activityFeed": []
    }}' http://localhost:3000/users | cut -d\" -f4)
idTwo=$(curl -H "Content-Type: application/json" -d'{"user":{
    "username": "second", 
    "email": "second@gmail.fake", 
    "password": "password", 
    "firstName": "dos", 
    "middleName": "persona", 
    "lastName": "aqui", 
    "maidenName": "ahora", 
    "phone": 3211231235, 
    "rut": "1234567892", 
    "cabildos": [],
    "files": "none",
    "followers": [],
    "following": [],
    "activityFeed": []
    }}' http://localhost:3000/users | cut -d\" -f4)

data='{"data":{"follower":"'$idOne'","followed":"'$idTwo'"}}'
echo $data
curl -H 'Content-Type: application/json' -d$data http://localhost:3000/users/followcabildo