
export const userPopulate = {// use for userId field subpopulation
    path:'userId',
    model: 'User',
    select:'_id username citizenPoints'
};

export const votePopulate = userId => ({ // to get a user's vote
    path: 'votes',
    model: 'Vote',
    match: {
        userId: userId,
    },
});

export const replyPop = (
    userId: string,
) => ([
        userPopulate,
        votePopulate(userId),
]);

export const replyPopulate = (
    userId: string,
    replyNum: number = 10,
) => ({
    path: 'reply',
    model: 'Reply',
    options: {
        limit: replyNum,
        sort: 'field -score',
    },
    populate: replyPop(userId),
});

export const commentPop = (
    userId: string,
    replyNum: number,
) => ([
        userPopulate,
        votePopulate(userId),
        replyPopulate(userId, replyNum),
]);
export const commentPopulate = (
    userId: string,
    comNum: number,
    replyNum: number,
) => ({
    path: 'comments',
    model: 'Comment',
    options: {
        limit: comNum,
        sort: 'field -score'
    },
    populate: commentPop(userId, replyNum),
});

export const activityPopulate = (
    userId: string,
    comNum: number = 100,
    replyNum: number = 10,
) => ([//use on any list of activity ids
    userPopulate,
    votePopulate(userId),
    { // info about cabildo posted to
        path: 'cabildoId',
        model: 'Cabildo',
        select: 'name _id',
    },
    { // the reaction of the user
        path: 'reactions',
        model: 'Reaction',
        match: { userId: userId },
    },
    commentPopulate(userId, comNum, replyNum),
]);

export const feedPopulate = (
    userId: string,
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
    populate: activityPopulate(userId),
});

export const followPopulate = (
    userId: string,
    lim: number,
    off: number,
) => ([
    {
        path: 'following',
        model: 'User',
        select: 'activityFeed -_id',
        populate: feedPopulate(userId, lim, off),
    },
    {
        path: 'cabildos',
        model: 'Cabildo',
        select: 'activityFeed -_id',
        populate: feedPopulate(userId, lim, off),
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
