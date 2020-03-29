
IFS=$'\n' read -d '' -r -a users < ~/idUser.txt
IFS=$'\n' read -d '' -r -a cabildos < ~/idCabildo.txt


echo ${users[1]}
echo ${cabildos[0]}

curl -v -H "Content-Type: application/json" -d'{"activity": {
	"idUser": "'${users[1]}'",
	"idCabildo": "'${cabildos[0]}'",
	"activityType": "discussion",
	"score": 0,
	"commentNumber": 0,
	"publishDate": 0,
	"title": "asdf",
	"text": "asdf",
	"comments": [],
	"reactions": [],
	"votes": []
    }}' http://localhost:3000/activity
