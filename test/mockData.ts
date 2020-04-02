let userA = {
    user: {
        username: "smonroe",
        email: "smonroe@gmail.fake",
        password: "arealpassword",
        firstName: "Steven",
        middleName: "Christopher",
        lastName: "Monroe",
        maidenName: "Rose",
        phone: 9417261303,
        rut: "1234567891",
        cabildos: [],
        files: [],
        followers: [],
        following: [],
        activityFeed: [],
        activityVotes: [],
        commentVotes: [],
        citizenPoints: 100
    }
};
let userB = {
    user: {
        username: "bekim",
        email: "bekim@gmail.fake",
        password: "anotherrealpassword",
        firstName: "Benjamin",
        middleName: "Y",
        lastName: "Kim",
        maidenName: "Boris",
        phone: 9412346543,
        rut: "1234567892",
        cabildos: [],
        files: [],
        followers: [],
        following: [],
        activityFeed: [],
        activityVotes: [],
        commentVotes: [],
        citizenPoints: 101
    }
};
let userC = {
    user: {
        username: "mschmidt",
        email: "mschmidt@gmail.fake",
        password: "agreatpassword",
        firstName: "Mikey",
        middleName: "The",
        lastName: "Schmidt",
        maidenName: "Snowflake",
        phone: 9412346765,
        rut: "1234567893",
        cabildos: [],
        files: [],
        followers: [],
        following: [],
        activityFeed: [],
        activityVotes: [],
        commentVotes: [],
        citizenPoints: 9001
    }
};
let cabA = {
    cabildo: {
        name: "ft_cabildo",
        members: [],
        moderators: [],
        admin: null, // fill
        location: "42 SiliconValley",
        issues: [],
        meetings: [],
        files: [],
        activities: []
    }
};
let actA = {
    activity: {
        idUser: null,
        idCabildo: null,
        activityType: "discussion",
        score: 5,
        pingNumber: 662,
        commentNumber: 95,
        title: "POR FAVOR, no vayan a Urgencias por puras webadas",
        text: "Estudio medicina, ya estoy acostumbrado a la horda diaria de pacientes que consultan la urgencia de un HOSPITAL por webadas insignificantes de CERO urgencia médica. En un día normal, te prometo que no me importa que consultes porque te duele el pelo, la uña o el zapato. Te atenderé feliz y con las mejores ganas del planeta. Pero ahora no es un día normal. Estamos en una pandemia. Te duele un poco la guata? Te cayó mal la comida? Toma harta agua y quédate en la casa. Te duele la espalda? Te duele el tobillo?Tomate un paracetamol y quédate en la casa. Si te duele hace harto tiempo toma una hora al POLICLINICO (cuando se calmen las cosas) Tienes un poco de tos? Quédate en la casa y no salgas hasta que se te pase. No te van a hacer el test si no presentas contactos y solo es un cuadro leve. La Urgencia está reservada para paciente URGENTES. Dificultad respiratoria considerable, pacientes crónicos descompensados, accidentes de alto daño. Su tu condición no es grave, lo peor que puedes hacer es ir a urgencias. La sala de espera está lleno de pacientes enfermos y si no tenías el coronavirus antes probablemente ahí te lo pegues, aweonado. Eso, besitos.",
        comments: []
    }
};
let comA0 = {
    comment: {
        idUser: null,
        content:"Igual tiene que agregar un dato importante que es la cobertura.",
        score:47,
    },
    activity_id: null,
};
let comA1 = {
    comment: {
        idUser: null,
        content:"En la pag del Jumbo y del Lider dice que el despacho se puede demorar días por alta demanda.",
        score:13
    },
    activity_id: null,
};
let comA2 = {
    comment: {
        idUser: null,
        content:"Agregada la cobertura.",
        score:1
    },
    activity_id: null,
};


let actB = {
    activity: {
        idUser: null,
        idCabildo: null,
        activityType: "discussion",
        score: 14,
        pingNumber: 77,
        commentNumber: 3,
        title: "Datos empresas de delivery (Stgo principalmente)",
        text: "hice una planillita con datos para pedir productos a domicilio, para el que no pueda salir a abastecerse. Hay que chequear la disponibilidad de entrega en las comunas. Se agradece su aporte con datos para agregarlos o correcciones en alguna info: https://docs.google.com/spreadsheets/d/1HCgcxJXbxsc7zTGW8UM5TaAC9CtvnjO5aPmXcqAoxaE/",
        comments: []
    }
}
let comB0 = {
    comment: {
        idUser: null,
        content:"Igual tiene que agregar un dato importante que es la cobertura.",
        score:47
    },
    activity_id: null,
};
let comB1 = {
    comment: {
        idUser: null,
        content:"En la pag del Jumbo y del Lider dice que el despacho se puede demorar días por alta demanda.",
        score:13
    },
    activity_id: null,
};
let comB2 = {
    comment: {
        idUser: null,
        content:"Agregada la cobertura.",
        score:1
    },
    activity_id: null,
};

let actC = {
    activity: {
        idUser: null,
        idCabildo: null,
        activityType: "discussion",
        score: 5,
        pingNumber: 662,
        commentNumber: 95,
        title: "datos Teletrabajos en Chile por covid19",
        text: "abro este post para ayudar a gente desempleada con datos de trabajos free lance, teletrabajos, homework en Chile, para poder prevenir el contagio de covid19 y hacer cuarentena trabajando. desde nombres de empresas que hagan homework, entrevistas que se estén realizando, sitios webs de empleos homework, hasta nombre de los trabajos que se ofrecen como freelance o homework. Muchas Gracias",
        comments: []
    }
}

let comC0 = {
    comment: {
        idUser: null,
        content:"chaturbate, cam4, samsoda.",
        score:22
    },
    activity_id: null,
}
let comC1 = {
    comment: {
        idUser: null,
        content:"No es de Chile, pero encontré este hilo en twitter para desarrolladores dónde estan compartiendo datos y perfiles para trabajos remotos...",
        score:6
    },
    activity_id: null,
}
let comC2 = {
    comment: {
        idUser: null,
        content:"Me mandan una peguita xfa",
        score:3
    },
    activity_id: null,
}
let actD = {
    activity: {
        idUser: null,
        idCabildo: null,
        activityType: "discussion",
        score: 5,
        pingNumber: 662,
        commentNumber: 95,
        title: "datos Teletrabajos en Chile por covid19",
        text: "abro este post para ayudar a gente desempleada con datos de trabajos free lance, teletrabajos, homework en Chile, para poder prevenir el contagio de covid19 y hacer cuarentena trabajando. desde nombres de empresas que hagan homework, entrevistas que se estén realizando, sitios webs de empleos homework, hasta nombre de los trabajos que se ofrecen como freelance o homework. Muchas Gracias",
        comments: []
    }
}

let comD0 = {
    comment: {
        idUser: null,
        content:"chaturbate, cam4, samsoda.",
        score:22
    },
    activity_id: null,
}
let comD1 = {
    comment: {
        idUser: null,
        content:"No es de Chile, pero encontré este hilo en twitter para desarrolladores dónde estan compartiendo datos y perfiles para trabajos remotos...",
        score:6
    },
    activity_id: null,
}
let comD2 = {
    comment: {
        idUser: null,
        content:"Me mandan una peguita xfa",
        score:3
    },
    activity_id: null,
}
let actE = {
    activity: {
        idUser: null,
        idCabildo: null,
        activityType: "discussion",
        score: 204,
        pingNumber: 415,
        commentNumber: 44,
        title: "Post by Alejandro Guzman",
        text: "Hola. Primero perdonen mis faltas de ortografía. Siempre fui nula en eso en clases. Acabo de crear mi cuenta presisamente para preguntar esto aqui. Quisiera saber lo que pasaron para conseguir la cirugía aqui en chile El lugar en el que la consiguieron. Si les pusieron muchas trabas etc. Pregunto para saber cuanto prepararme. Yo no quiero hijos. Nunca quise y planeo operarme para no tener jamas hijos biológicos. 'Pero y si cambias de opinion?' Pues si cambio de opinión tratare de adoptar. Pero dudo cambiar de opinión. Muchas gracias de ante mano. Por favor comentenme sus historias",
        comments: []
    }
}

let comE0 = {
    comment: {
        idUser: null,
        content:"Mi mamá se lo hizo, después nací yo (?)",
        score:15
    },
    activity_id: null,
}
let comE1 = {
    comment: {
        idUser: null,
        content:"De repente preguntando en la discusión random vas a obtener más respuestas.",
        score:7
    },
    activity_id: null,
}
let comE2 = {
    comment: {
        idUser: null,
        content:"Creo que nunca he visto una ooforectomia sin alegar la “paridad cumplida” y este año por primera vez vi una histerectomia por temas de genero. Está difícil que te resulte sin esas condiciones xq los médicos asumen que tienes algún drama sicológico por pedirlo. No, no es chiste, lo he escuchado.",
        score:2
    },
    activity_id: null,
}

let reply = {
    reply: {
        idUser: null,
        content: "REPLYTIME",
        score: 0
    },
    comment: null
};

export {
    userA,userB,userC,
    cabA,
    actA,comA0,comA1,comA2,
    actB,comB0,comB1,comB2,
    actC,comC0,comC1,comC2,
    actD,comD0,comD1,comD2,
    actE,comE0,comE1,comE2,
    reply
};
