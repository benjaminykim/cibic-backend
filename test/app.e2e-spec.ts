import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

import {
    userA,userB,userC,cabA,
    actA,comA0,comA1,comA2,
    actB,comB0,comB1,comB2,
    actC,comC0,comC1,comC2,
    actD,comD0,comD1,comD2,
    actE,comE0,comE1,comE2,
    reply
} from './mockData';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('End To End Test', async (done) => {
        let oldTest = false;
        // promise callback on document creation
        const idCheck = res => {
            expect(res.body.id).toHaveLength(24);
            return res.body.id;
        };
        // less typing on request() calls
        const srv = app.getHttpServer();

        if (oldTest) {
            const idA = await request(srv).post('/user').send(userA).expect(201).then(idCheck);
            console.error(`idA: ${idA}`);

            // make a user
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck);
            console.error(`idB: ${idB}`);

            const authARes = await request(srv).post('/auth/login').send({
                password: userA.user.password,
                email: userA.user.email
            });
            const authA = {'Authorization': `Bearer ${authARes.body.access_token}`};
            const authBRes = await request(srv).post('/auth/login').send({
                password: userB.user.password,
                email: userB.user.email
            });
            const authB = {'Authorization': `Bearer ${authBRes.body.access_token}`};

            // git an empty cabildo list
            const emptyCabildos = await request(srv).get('/cabildo').set(authA).expect(200)
            expect(emptyCabildos.body).toHaveLength(0);

            // make a cabildo
            cabA.cabildo.admin = idA;
            const idCab = await request(srv).post('/cabildo').set(authA).send(cabA).expect(201).then(idCheck);
            console.error(`idCab: ${idCab}`);

            // get a cabildo back
            const oneCabildo = await request(srv).get('/cabildo').set(authA).expect(200)
            expect(oneCabildo.body).toHaveLength(1);

            // first user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({idUser: idB}).expect(/now follows user/)
            console.error(`AfollowB`);

            // first user follows a cabildo
            const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
                .send({idCabildo: idCab}).expect(/now follows cabildo/)
            console.error(`AfollowC`);

            // second user follows a cabildo
            const BfollowC = await request(srv).post('/user/followcabildo').set(authB)
                .send({idCabildo: idCab}).expect(/now follows cabildo/)
            console.error(`BfollowC`);

            // prepare activities with user and cabildo ids
            actA.activity.idUser = idA;
            actB.activity.idUser = idB;
            actC.activity.idUser = idA;
            actD.activity.idUser = idB;
            actE.activity.idUser = idA;
            //actA.activity.idCabildo =
            actB.activity.idCabildo =
                actC.activity.idCabildo =
                actD.activity.idCabildo =
                actE.activity.idCabildo =
                idCab;
            console.error("prepared activities");

            // post activites
            const idActA = await request(srv).post('/activity').set(authB).send(actA)
                .expect(201).then(idCheck).catch(err => done(err));
            const idActB = await request(srv).post('/activity').set(authB).send(actB)
                .expect(201).then(idCheck).catch(err => done(err));
            const idActC = await request(srv).post('/activity').set(authB).send(actC)
                .expect(201).then(idCheck).catch(err => done(err));
            const idActD = await request(srv).post('/activity').set(authB).send(actD)
                .expect(201).then(idCheck).catch(err => done(err));
            const idActE = await request(srv).post('/activity').set(authB).send(actE)
                .expect(201).then(idCheck).catch(err => done(err));
            console.error("posted activities");

            // prapare comments with user and activity ids
            comA0.comment.idUser = idA;
            comA1.comment.idUser = idA;
            comA2.comment.idUser = idA;
            comB0.comment.idUser = idA;
            comB1.comment.idUser = idA;
            comB2.comment.idUser = idA;
            comC0.comment.idUser = idA;
            comC1.comment.idUser = idA;
            comC2.comment.idUser = idA;
            comD0.comment.idUser = idA;
            comD1.comment.idUser = idA;
            comD2.comment.idUser = idA;
            comE0.comment.idUser = idA;
            comE1.comment.idUser = idA;
            comE2.comment.idUser = idA;
            comA0.idActivity = comA1.idActivity = comA2.idActivity = idActA;
            comB0.idActivity = comB1.idActivity = comB2.idActivity = idActB;
            comC0.idActivity = comC1.idActivity = comC2.idActivity = idActC;
            comD0.idActivity = comD1.idActivity = comD2.idActivity = idActD;
            comE0.idActivity = comE1.idActivity = comE2.idActivity = idActE;
            console.error("prepared comments");

            // post comments
            console.error(comA0);
            const idComA0 = await request(srv).post('/activity/comment').set(authB).send(comA0)
                .expect(201).then(idCheck).catch(err => done(err));
            console.error(idComA0);
            const idComA1 = await request(srv).post('/activity/comment').set(authB).send(comA1)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComA2 = await request(srv).post('/activity/comment').set(authB).send(comA2)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComB0 = await request(srv).post('/activity/comment').set(authB).send(comB0)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComB1 = await request(srv).post('/activity/comment').set(authB).send(comB1)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComB2 = await request(srv).post('/activity/comment').set(authB).send(comB2)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComC0 = await request(srv).post('/activity/comment').set(authB).send(comC0)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComC1 = await request(srv).post('/activity/comment').set(authB).send(comC1)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComC2 = await request(srv).post('/activity/comment').set(authB).send(comC2)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComD0 = await request(srv).post('/activity/comment').set(authB).send(comD0)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComD1 = await request(srv).post('/activity/comment').set(authB).send(comD1)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComD2 = await request(srv).post('/activity/comment').set(authB).send(comD2)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComE0 = await request(srv).post('/activity/comment').set(authB).send(comE0)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComE1 = await request(srv).post('/activity/comment').set(authB).send(comE1)
                .expect(201).then(idCheck).catch(err => done(err));
            const idComE2 = await request(srv).post('/activity/comment').set(authB).send(comE2)
                .expect(201).then(idCheck).catch(err => done(err));
            console.error("posted comments");

            // post 100 replies
            for (let i = 0; i < 100; i++) {
                await request(srv).post('/activity/reply').set(authA).send(
                    {
                        reply: {
                            idUser: idB,
                            content: `This is reply ${i}`,
                            score: i,
                        },
                        idComment: idComE2,
                        idActivity: idActE,

                    }
                ).expect(201).then(idCheck).catch(err => done(err));
            }
            const reactDos = {
                idActivity: idActD,
                reaction: {
                    idUser: idB,
                    value: 2,
                }
            };

            console.error("idreact");
            const React = await request(srv).post('/activity/react').set(authB).send(reactDos).expect(201);
            const idReact = React.body.id
            console.error(idReact);

            // get activity feed for first user
            console.error('feeda');
            const feedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
            //        console.error(feedA.body);

            console.error("idreactagain");
            const idReactAgain = await request(srv).put(`/activity/react`).set(authB).send(
                {
                    idReaction: idReact,
                    idActivity: idActD,
                    value: -2,
                }).expect(200);
            //        console.error(idReactAgain.body);

            console.error("voting on things");
            const upVote = {
                idActivity: idActA,
                vote: {
                    idUser: idA,
                    value: 1,
                }
            };
            const res1 = await request(srv).post('/activity/vote').set(authA)
                .send(upVote).expect(201)
            // Getting async timeout error here, console.error in activity controller/spec, need to fix.
            //const publicFeed = await request(srv).get(`/activity/public`).set(authA).expect(200);
            //console.error("publicFeed:");
            //console.error(publicFeed.body[0]);

            const upd1 = await request(srv).put('/activity/vote').set(authA)
                .send({idVote:res1.body.id,idActivity:idActA,value:-1}).expect(200)
            //const publicFeed2 = await request(srv).get(`/activity/public`).set(authA).expect(200);
            //console.error("publicFeed2:");
            //console.error(publicFeed2.body[0]);
            //console.error('votecomment');
            const voteComment = await request(srv).post('/activity/comment/vote').set(authB)
                .send({idActivity: idActA,idComment: idComA0,vote:{idUser:idB,value:1}})
                .expect(201)
            //console.error('del1');
            //const del1 = await request(srv).delete('/activity/vote').set(authA)
            //    .send({idVote:res1.body.id,idActivity:idActA}).expect(200)
            //console.error('p3');
            // Getting async timeout error here, console.error in activity controller/spec, need to fix.
            //const publicFeed3 = await request(srv).get(`/activity/public`).set(authA).expect(200);
            //console.error("publicFeed3:");
            //console.error(publicFeed3.body[0]);

            // get activity feed for second user
            //console.error('feedb');
            //const feedB = await request(srv).get(`/user/feed/${idB}`).set(authA).expect(200);
            //console.error(feedB.body);

            // should have differing reactions and scores
            //fails bc null??        expect(feedA.body.activityFeed).toMatchObject(feedB.body.activityFeed)
            // make a new user
            //const idC = await request(srv).post('/user').send(userC).expect(201).then(idCheck);
            //console.error(`idC: ${idC}`);

            // get a blank activity feed
            // ASYNC TIMEOUT
            //const feedC = await request(srv).get(`/user/feed/${idC}`).set(authA).expect(200)
            // expect(feedC.body.activityFeed).toStrictEqual([]);

            // third user follows a cabildo
            //const CfollowC = await request(srv).post('/user/followcabildo').set(authA)
            //    .send({idCabildo: idCab}).expect(/now follows cabildo/)
            //console.error(`CfollowC`);

            // get a populated activity feed
            //const feedC2 = await request(srv).get(`/user/feed/${idC}`).set(authA).expect(200)
            //console.error("feedC");
            //        console.error(feedC.body);

            // Need to add activityFeed update when a user follows a cabildo or another user
            // to include the activities from that entity
            //expect(feedC2.body.activityFeed).toStrictEqual(feedB.body.activityFeed)
            // const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
            // console.error("userFeedA:");
            // console.error(userFeedA.body);
            // const userFeedB = await request(srv).get(`/user/feed/${idB}`).set(authA).expect(200);
            // console.error("userFeedB:");
            // console.error(userFeedB.body);
            // const userHomeA = await request(srv).get(`/user/home`).set(authA).expect(200);
            // console.error("userHomeA:");
            // console.error(userHomeA.body);
            // const userHomeB = await request(srv).get(`/user/home`).set(authB).expect(200);
            // console.error("userHomeB:");
            // console.error(userHomeB.body);
            // const cabildoFeed = await request(srv).get(`/cabildo/feed/${idCab}`).set(authA).expect(200);
            // console.error("cabildoFeed:");
            // console.error(cabildoFeed.body);


            ////// Positive Tests Needed:
            // add replies to comments
            // react to all things
            // vote on poll

            // test for full population of nested object refs
            // update an activity and ensure difference on everyones feed


            ////// Negative Tests Needed:

            /// TBD: should all negative tests go in unit test?
            /// If they only deal with a single module, yes.
            /// If we have multi-module negative tests, they happen here.

            // move -- model level tests to unit testing
            // add a conflicting user.email -- model level
            // add a conflicting cabildo.name -- model level
            // add an activity with bad fields -- model level
            // add a comment with bad fields -- model level
            // add a reply with bad fields -- model level
            // new user follows cabildo check if feed updates
            // add things with id's that reference the wrong kind of object
            console.error("finished")
            done();
        } else {

            // First user
            const idA = await request(srv).post('/user').send(userA).expect(201).then(idCheck);
            const authARes = await request(srv).post('/auth/login').send({
                password: userA.user.password,
                email: userA.user.email
            });
            const authA = {'Authorization': `Bearer ${authARes.body.access_token}`};

            // Second user
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck);
            const authBRes = await request(srv).post('/auth/login').send({
                password: userB.user.password,
                email: userB.user.email
            });
            const authB = {'Authorization': `Bearer ${authBRes.body.access_token}`};

            // A Cabildo
            const idCab = await request(srv).post('/cabildo').set(authA)
                .send(cabA).expect(201).then(idCheck);
            // First user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({idUser: idB}).expect(/now follows user/)
            // Second user follows cabildo
            const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
                .send({idCabildo: idCab}).expect(/now follows cabildo/)

            // An activity
            actA.activity.idUser = idA;
            actA.activity.idCabildo = idCab;
            const idActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(err => done(err));
//second activity
//            actB.activity.idUser = idA;
//            actB.activity.idCabildo = idCab;
//            const idActB = await request(srv).post('/activity').set(authA).send(actB)
//                .expect(201).then(idCheck).catch(err => done(err));

            // A comment
            comA0.comment.idUser = idA;
            comA0.idActivity = idActA;
            const idComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(err => done(err));

            // A Reply
            const idReply = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        idUser: idA,
                        content: 'This is a reply',
                        score: 0,
                    },
                    idComment: idComA0,
                    idActivity: idActA,
                }
            ).expect(201).then(idCheck).catch(err => done(err));

            // A Reaction
            const react = {
                idActivity: idActA,
                reaction: {
                    idUser: idA,
                    value: 2,
                }
            };
            const idReact = await request(srv).post('/activity/react').set(authA)
                .send(react).expect(201).then(idCheck);

            // An activity vote
            const voteAct = await request(srv).post('/activity/vote').set(authA)
                .send({idActivity: idActA, vote: {idUser: idA, value: 1}}).expect(201).then(idCheck);

            // A comment vote
            const voteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({idActivity: idActA,idComment: idComA0,vote:{idUser:idA,value:1}}).expect(201).then(idCheck);

            // A Reply Vote
            const voteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({idActivity: idActA,idReply: idReply, vote:{idUser:idA,value:1}}).expect(201).then(idCheck);

            {
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                let com = act.comments[0];
                expect(com.score).toBe(1);
                expect(com.reply).toHaveLength(1);
                expect(com.content).toBe('Comment');
                let rep = com.reply[0];
                expect(rep.score).toBe(1);
                expect(rep.content).toBe('This is a reply');
            }

            const upAct = await request(srv).put('/activity').set(authA)
                .send({idActivity:idActA,content:'Update'}).expect(200);
            const upCom = await request(srv).put('/activity/comment').set(authA)
                .send({idComment:idComA0,content:'Update'}).expect(200);
            const upRep = await request(srv).put('/activity/reply').set(authA)
                .send({idReply:idReply,content:'Update'}).expect(200);
            const upRea = await request(srv).put('/activity/react').set(authA)
                .send({idReaction:idReact,idActivity:idActA,value:-2}).expect(200);
            const upVotAct = await request(srv).put('/activity/vote').set(authA)
                .send({idVote:voteAct,idActivity:idActA,value:-1}).expect(200);
            const upVotCom = await request(srv).put('/activity/comment/vote').set(authA)
                .send({idVote:voteComment,idComment:idComA0,value:-1}).expect(200);
            const upVotRep = await request(srv).put('/activity/reply/vote').set(authA)
                .send({idVote:voteReply,idReply:idReply,value:-1}).expect(200);

            {
//                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                const userFeedA = await request(srv).get(`/user/home`).set(authA).expect(200);
//                console.log(userFeedA.body);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(-3);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                let com = act.comments[0];
                expect(com.score).toBe(-1);
                expect(com.reply).toHaveLength(1);
                expect(com.content).toBe('Update');
                let rep = com.reply[0];
                expect(rep.score).toBe(-1);
                expect(rep.content).toBe('Update');
            }
            const delReact = await request(srv).delete('/activity/react').set(authA)
                .send({idActivity:idActA,idReaction:idReact}).expect(200);
            const delActVote = await request(srv).delete('/activity/vote').set(authA)
                .send({idActivity:idActA,idVote:voteAct}).expect(200);
            const delComVote = await request(srv).delete('/activity/comment/vote').set(authA)
                .send({idActivity:idActA,idComment:idComA0,idVote:voteComment}).expect(200);
            const delRepVote = await request(srv).delete('/activity/reply/vote').set(authA)
                .send({idActivity:idActA,idReply:idReply,idVote:voteReply}).expect(200);

            {
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(2);
                expect(act.score).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                let com = act.comments[0];
                expect(com.score).toBe(0);
                expect(com.reply).toHaveLength(1);
                expect(com.content).toBe('Update');
                let rep = com.reply[0];
                expect(rep.score).toBe(0);
                expect(rep.content).toBe('Update');
            }

            const delRep = await request(srv).delete('/activity/reply').set(authA)
                .send({idActivity: idActA,idReply:idReply}).expect(200);
            {
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(1);
                expect(act.score).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                let com = act.comments[0];
                expect(com.score).toBe(0);
                expect(com.reply).toHaveLength(0);
                expect(com.content).toBe('Update');
            }
            const delCom = await request(srv).delete('/activity/comment').set(authA)
                .send({idActivity: idActA,idComment:idComA0}).expect(200);
            {
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(0);
                expect(act.score).toBe(0);
                expect(act.commentNumber).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(0);
            }
            const delAct = await request(srv).delete('/activity').set(authA).send({idActivity: idActA}).expect(200);
            {
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                expect(userFeedA.body).toHaveLength(0);

            }
            const checkRep = await request(srv).get(`/activity/reply/${idReply}`).set(authA).expect(404);
            const checkCom = await request(srv).get(`/activity/comment/${idComA0}`).set(authA).expect(404);
            const checkAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(404);
            const checkVot = await request(srv).get(`/activity/vote/${voteReply}`).set(authA).expect(404);


            // Recreating everything then doing a delte in the oppoiste direction
                        // An activity
            actA.activity.idUser = idA;
            actA.activity.idCabildo = idCab;
            const RidActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(err => done(err));

            // A comment
            comA0.comment.idUser = idA;
            comA0.idActivity = RidActA;
            const RidComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(err => done(err));

            // A Reply
            const RidReply = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        idUser: idA,
                        content: 'This is a reply',
                        score: 0,
                    },
                    idComment: RidComA0,
                    idActivity: RidActA,
                }
            ).expect(201).then(idCheck).catch(err => done(err));

            // A Reaction
            const Rreact = {
                idActivity: RidActA,
                reaction: {
                    idUser: idA,
                    value: 2,
                }
            };
            const RidReact = await request(srv).post('/activity/react').set(authA)
                .send(Rreact).expect(201).then(idCheck);

            // An activity vote
            const RvoteAct = await request(srv).post('/activity/vote').set(authA)
                .send({idActivity: RidActA, vote: {idUser: idA, value: 1}}).expect(201).then(idCheck);

            // A comment vote
            const RvoteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({idActivity: RidActA,idComment: RidComA0,vote:{idUser:idA,value:1}}).expect(201).then(idCheck);

            // A Reply Vote
            const RvoteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({idActivity: RidActA,idReply: RidReply, vote:{idUser:idA,value:1}}).expect(201).then(idCheck);

            {
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                let com = act.comments[0];
                expect(com.score).toBe(1);
                expect(com.reply).toHaveLength(1);
                expect(com.content).toBe('Comment');
                let rep = com.reply[0];
                expect(rep.score).toBe(1);
                expect(rep.content).toBe('This is a reply');
            }

            // Goodbye!
            done();
        }

    });
});
