import { jwtConstants } from './auth/constants';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';

export function idFromToken(token: string) {
    if (!token)
        throw new ForbiddenException();
    const body = Buffer.from(token.split(' ')[1].split('.')[1], 'base64');
    const idUser = JSON.parse(body.toString('ascii')).id;
    if (idUser.length != 24)
        throw new ForbiddenException();
    return idUser as string;
}

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
