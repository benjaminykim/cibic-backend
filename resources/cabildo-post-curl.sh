#!/bin/sh
curl -H "Content-Type: application/json" -d'{
    "name": "cabildo-uno",
    "members": ["5e7c4d8b461b3a02cc4ff1fc"],
    "moderators": ["5e7c068909b1230159c36a9f", "5e7c068609b1230159c36a9e"],
    "admin": "5e7c083514e55601a45df5c4",
    "location": "42sv",
    "issues": ["muchos", "problemas"],
    "meetings": ["5e7c4d8b461b3a02cc4ff1fc"],
    "files": ["nada"]
}' http://localhost:3000/cabildos