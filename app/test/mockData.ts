const userA = {
    user: {
        email: 'smonroe@gmail.fake',
        password: 'arealpassword',
        firstName: 'Steven',
        lastName: 'Monroe',
        phone: 9417261303,
    },
};
const userB = {
    user: {
        email: 'bekim@gmail.fake',
        password: 'anotherrealpassword',
        firstName: 'Benjamin',
        lastName: 'Kim',
        phone: 9412346543,
    },
};
const cabA = {
    cabildo: {
        name: 'ft_cabildo',
        location: '42 SiliconValley',
        desc: 'the cabildo',
    },
};
const cabB = {
    cabildo: {
        name: 'cabildo to be deleted',
        location: 'to be deleted',
        desc: 'the cabildo b',
    },
};
const actA = {
    activity: {
        activityType: 0,//'discussion', this means frontend changes to int from string
        title: 'Actvidad Uno',
        text: 'Content',
    },
};
const comA0 = {
    comment: {
        content: 'Comment',
    },
    activityId: null,
};
const comA1 = {
    comment: {
        content: 'En la pag del Jumbo y del Lider dice que el despacho se puede demorar días por alta demanda.',
    },
    activityId: null,
};
const comA2 = {
    comment: {
        content: 'Agregada la cobertura.',
    },
    activityId: null,
};

const actB = {
    activity: {
        activityType: 0,
        title: 'Datos empresas de delivery (Stgo principalmente)',
        text: 'hice una planillita con datos para pedir productos a domicilio, para el que no pueda salir a abastecerse. Hay que chequear la disponibilidad de entrega en las comunas. Se agradece su aporte con datos para agregarlos o correcciones en alguna info: https://docs.google.com/spreadsheets/d/1HCgcxJXbxsc7zTGW8UM5TaAC9CtvnjO5aPmXcqAoxaE/',
    },
};
const comB0 = {
    comment: {
        content: 'Igual tiene que agregar un dato importante que es la cobertura.',
        score: 0,
    },
    activityId: null,
};
const comB1 = {
    comment: {
        content: 'En la pag del Jumbo y del Lider dice que el despacho se puede demorar días por alta demanda.',
        score: 0,
    },
    activityId: null,
};
const comB2 = {
    comment: {
        content: 'Agregada la cobertura.',
        score: 0,
    },
    activityId: null,
};

const actC = {
    activity: {
        activityType: 0,
        title: 'datos Teletrabajos en Chile por covid19',
        text: 'abro este post para ayudar a gente desempleada con datos de trabajos free lance, teletrabajos, homework en Chile, para poder prevenir el contagio de covid19 y hacer cuarentena trabajando. desde nombres de empresas que hagan homework, entrevistas que se estén realizando, sitios webs de empleos homework, hasta nombre de los trabajos que se ofrecen como freelance o homework. Muchas Gracias',
    },
};

const comC0 = {
    comment: {
        content: 'Viva la revolucion',
        score: 0,
    },
    activityId: null,
};
const comC1 = {
    comment: {
        content: 'No es de Chile, pero encontré este hilo en twitter para desarrolladores dónde estan compartiendo datos y perfiles para trabajos remotos...',
        score: 0,
    },
    activityId: null,
};
const comC2 = {
    comment: {
        content: 'Me mandan una peguita xfa',
        score: 0,
    },
    activityId: null,
};
const actD = {
    activity: {
        activityType: 0,
        title: 'datos Teletrabajos en Chile por covid19',
        text: 'abro este post para ayudar a gente desempleada con datos de trabajos free lance, teletrabajos, homework en Chile, para poder prevenir el contagio de covid19 y hacer cuarentena trabajando. desde nombres de empresas que hagan homework, entrevistas que se estén realizando, sitios webs de empleos homework, hasta nombre de los trabajos que se ofrecen como freelance o homework. Muchas Gracias',
    },
};

const comD0 = {
    comment: {
        content: 'Si, esto es muy importante.',
        score: 0,
    },
    activityId: null,
};
const comD1 = {
    comment: {
        content: 'No es de Chile, pero encontré este hilo en twitter para desarrolladores dónde estan compartiendo datos y perfiles para trabajos remotos...',
        score: 0,
    },
    activityId: null,
};
const comD2 = {
    comment: {
        content: 'Me mandan una peguita xfa',
        score: 0,
    },
    activityId: null,
};
const actE = {
    activity: {
        activityType: 0,
        title: 'Post by Alejandro Guzman',
        text: 'Hola. Primero perdonen mis faltas de ortografía. Siempre fui nula en eso en clases. Acabo de crear mi cuenta presisamente para preguntar esto aqui. Quisiera saber lo que pasaron para conseguir la cirugía aqui en chile El lugar en el que la consiguieron. Si les pusieron muchas trabas etc. Pregunto para saber cuanto prepararme. Yo no quiero hijos. Nunca quise y planeo operarme para no tener jamas hijos biológicos. "Pero y si cambias de opinion?" Pues si cambio de opinión tratare de adoptar. Pero dudo cambiar de opinión. Muchas gracias de ante mano. Por favor comentenme sus historias',
    },
};

const comE0 = {
    comment: {
        content: 'Mi mamá se lo hizo, después nací yo (?)',
        score: 0,
    },
    activityId: null,
};
const comE1 = {
    comment: {
        content: 'De repente preguntando en la discusión random vas a obtener más respuestas.',
        score: 0,
    },
    activityId: null,
};
const comE2 = {
    comment: {
        content: 'Creo que nunca he visto una ooforectomia sin alegar la “paridad cumplida” y este año por primera vez vi una histerectomia por temas de genero. Está difícil que te resulte sin esas condiciones xq los médicos asumen que tienes algún drama sicológico por pedirlo. No, no es chiste, lo he escuchado.',
        score: 0,
    },
    activityId: null,
};

const reply = {
    reply: {
        content: 'REPLYTIME',
        score: 0,
    },
    commentId: null,
};

export {
    userA, userB, cabA, cabB,
    actA, comA0, comA1, comA2,
    actB, comB0, comB1, comB2,
    actC, comC0, comC1, comC2,
    actD, comD0, comD1, comD2,
    actE, comE0, comE1, comE2,
    reply,
};
