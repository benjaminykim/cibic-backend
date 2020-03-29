#!/bin/sh
IFS=$'\n' read -d '' -r -a users < ~/idUser.txt
IFS=$'\n' read -d '' -r -a cabildos < ~/idCabildo.txt

temp=~/curlResponse.log
output=~/idActivity.txt

for i in ${!users[@]}; do
    curl -H "Content-Type: application/json" -d'{
	"idUser": "'${users[$i]}'",
	"idCabildo": "'${cabildos[0]}'",
	"activityType": "discussion",
	"score": 5,
	"pingNumber": 662,
	"commentNumber": 95,
	"title": "POR FAVOR, no vayan a Urgencias por puras webadas",
	"text": "Estudio medicina, ya estoy acostumbrado a la horda diaria de pacientes que consultan la urgencia de un HOSPITAL por webadas insignificantes de CERO urgencia médica. En un día normal, te prometo que no me importa que consultes porque te duele el pelo, la uña o el zapato. Te atenderé feliz y con las mejores ganas del planeta. Pero ahora no es un día normal. Estamos en una pandemia. Te duele un poco la guata? Te cayó mal la comida? Toma harta agua y quédate en la casa. Te duele la espalda? Te duele el tobillo?Tomate un paracetamol y quédate en la casa. Si te duele hace harto tiempo toma una hora al POLICLINICO (cuando se calmen las cosas) Tienes un poco de tos? Quédate en la casa y no salgas hasta que se te pase. No te van a hacer el test si no presentas contactos y solo es un cuadro leve. La Urgencia está reservada para paciente URGENTES. Dificultad respiratoria considerable, pacientes crónicos descompensados, accidentes de alto daño. Su tu condición no es grave, lo peor que puedes hacer es ir a urgencias. La sala de espera está lleno de pacientes enfermos y si no tenías el coronavirus antes probablemente ahí te lo pegues, aweonado. Eso, besitos.",
	"comments": [
    {   "idUser":"ffuentes",
        "content":"Igual tiene que agregar un dato importante que es la cobertura.",
        "score":47,
        "reply" : [
        {
			"idUser": "joey",
            "content": "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
            "score": 23
		},
        {
            "idUser": "joey",
            "content": "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
            "score": 23
        },
        {
            "idUser": "joey",
            "content": "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
            "score": 23
        },
        {
            "idUser": "joey",
            "content": "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
            "score": 23
        },
        {
            "idUser": "joey",
            "content": "asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf",
            "score": 23
        }]
    },
        {"idUser":"NombreGenerico89", "content":"En la pag del Jumbo y del Lider dice que el despacho se puede demorar días por alta demanda.", "score":13},
        {"idUser":"poli_lla", "content":"Agregada la cobertura.", "score":1}]
    }' http://localhost:3000/activity >> $temp 2>&1
done

grep -o ':".*"' $temp | sed 's/[:"]//g' >> $output
rm -f $temp
cat $output
