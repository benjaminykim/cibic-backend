
const userPopulate = {
    path:'idUser',
    select:'_id username citizenPoints'
};

export const feedPopulate = [
    userPopulate,
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
];
