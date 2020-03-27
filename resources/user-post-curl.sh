#!/bin/sh
curl -H "Content-Type: application/json" -d'{"user":{
    "username": "tmonroe", 
    "email": "tmonroe@gmail.fake", 
    "password": "arealpassword", 
    "firstName": "teven", 
    "middleName": "ristopher", 
    "lastName": "roe", 
    "maidenName": "en", 
    "phone": 9417261303, 
    "rut": "1234567891", 
    "cabildos": ["5e7c062509b1330159c36a9b"],
    "files": "none",
    "followers": ["5e7c068309b1230159c36a9d"],
    "following": ["5e7c068909b12301593c6af9"],
    "activityFeed": ["5e7c068909b12301593c6af9"]
    }}' http://localhost:3000/users