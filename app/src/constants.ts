
export const userPopulate = {// use for idUser field subpopulation
    path:'idUser',
    model: 'User',
    select:'_id username citizenPoints'
};

export const votePopulate = idUser => ({ // to get a user's vote
    path: 'votes',
    model: 'Vote',
    match: {
        idUser: idUser,
    },
});

export const replyPop = (
    idUser: string,
) => ([
        userPopulate,
        votePopulate(idUser),
]);

export const replyPopulate = (
    idUser: string,
    replyNum: number = 10,
) => ({
    path: 'reply',
    model: 'Reply',
    options: {
        limit: replyNum,
        sort: 'field -score',
    },
    populate: replyPop(idUser),
});

export const commentPop = (
    idUser: string,
    replyNum: number,
) => ([
        userPopulate,
        votePopulate(idUser),
        replyPopulate(idUser, replyNum),
]);
export const commentPopulate = (
    idUser: string,
    comNum: number,
    replyNum: number,
) => ({
    path: 'comments',
    model: 'Comment',
    options: {
        limit: comNum,
        sort: 'field -score'
    },
    populate: commentPop(idUser, replyNum),
});

export const activityPopulate = (
    idUser: string,
    comNum: number = 100,
    replyNum: number = 10,
) => ([//use on any list of activity ids
    userPopulate,
    votePopulate(idUser),
    { // info about cabildo posted to
        path: 'idCabildo',
        model: 'Cabildo',
        select: 'name _id',
    },
    { // the reaction of the user
        path: 'reactions',
        model: 'Reaction',
        match: { idUser: idUser },
    },
    commentPopulate(idUser, comNum, replyNum),
]);

export const feedPopulate = (
    idUser: string,
    lim: number,
    off: number,
    sort: string = '-ping',
) => ({
    path: 'activityFeed',
    model: 'Activity',
    options: {
        limit: lim,
        offset: off,
        sort: sort,
    },
    populate: activityPopulate(idUser),
});

export const followPopulate = (
    idUser: string,
    lim: number,
    off: number,
) => ([
    {
        path: 'following',
        model: 'User',
        select: 'activityFeed -_id',
        populate: feedPopulate(idUser, lim, off),
    },
    {
        path: 'cabildos',
        model: 'Cabildo',
        select: 'activityFeed -_id',
        populate: feedPopulate(idUser, lim, off),
    },
]);

export const cabildoProfilePopulate = [
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

export const userProfilePopulate = [
    {
        path: 'cabildos',
        select: 'name _id',
    },
    {
        path: 'following',
        select: 'name _id',
    },
]
