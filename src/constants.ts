import { jwtConstants } from './auth/constants';
import { JwtService } from '@nestjs/jwt';

export function idFromToken(token: string) {
    const body = new Buffer(token.split(' ')[1].split('.')[1], 'base64');
    const json = JSON.parse(body.toString('ascii'));
    return json.id as string;
}

const userPopulate = {// use for idUser field subpopulation
    path:'idUser',
    select:'_id username citizenPoints'
};

export const activityPopulate = (idUser: string) => ([//use on any list of activity ids
    userPopulate,
    { // info about cabildo posted to
        path: 'idCabildo',
        select: 'name _id',
    },
    {
        path: 'reactions',
        idUser: { $eq: { idUser, },},
    },
    { // first 100 comments
        path: 'comments',
        options: {
            limit: 100,
            sort: 'field -score'
        },
        populate: [
            userPopulate,
            { // top ten replies
                path: 'reply',
                options: {
                    limit: 10,
                    sort: 'field -score',
                },
                populate: userPopulate,
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
