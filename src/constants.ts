
const userPop = {
    path:'idUser',
    select:'_id username citizenPoints'
};

export const feedPopulate = [
    userPop,
    { // info about cabildo posted to
        path: 'idCabildo',
        select: 'name _id',
    },
    { // first 100 comments
        path: 'comments',
        options: {
            limit: 100,
            sort: 'field -score'
        },
        populate: [
            userPop,
            { // top ten replies
                path: 'reply',
                options: {
                    limit: 10,
                    sort: 'field -score',
                },
                populate: userPop,
            },
        ],
    },
];
