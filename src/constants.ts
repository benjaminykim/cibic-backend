//import { jwtConstants } from './auth/constants';
//import { JwtService } from '@nestjs/jwt';

const userPopulate = {// use for idUser field subpopulation
    path:'idUser',
    select:'_id username citizenPoints'
};

const votePopulate = idUser => ({ // to get a user's vote
    path: 'votes',
    match: {
        idUser: idUser,
    },
});

export const activityPopulate = (idUser: string) => ([//use on any list of activity ids
    userPopulate,
    { // info about cabildo posted to
        path: 'idCabildo',
        select: 'name _id',
    },
    { // the reaction of the user
        path: 'reactions',
        match: { idUser: idUser },
    },
    votePopulate(idUser),
    { // first 100 comments
        path: 'comments',
        options: {
            limit: 100,
            sort: 'field -score'
        },
        populate: [
            userPopulate,
            votePopulate(idUser),
            { // top ten replies
                path: 'reply',
                options: {
                    limit: 10,
                    sort: 'field -score',
                },
                populate: [
                    userPopulate,
                    votePopulate(idUser),
                ],
            },
        ],
    },
]);

export const feedPopulate = (path: string, idUser: string, lim: number, off: number) => ({
    path: path,
    options: {
        limit: lim,
        offset: off,
    },
    populate: activityPopulate(idUser),
});

export const cabildoProfilePopulate = [// user for cabildo profile
    {
        path: 'members',
        populate: userPopulate,
    },
    {
        path: 'moderators',
        populate: userPopulate,
    },
    {
        path: 'admin',
        populate: userPopulate,
    },
    {
        path: 'members',
        select: 'name _id',
    },
];

export const userProfilePopulate = [// use for userprofile
    {
        path: 'cabildos',
        select: 'name _id',
    },
    {
        path: 'following',
        select: 'name _id',
    },
]
