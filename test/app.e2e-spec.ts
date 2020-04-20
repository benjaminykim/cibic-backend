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
    reply,cabB,
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
            //console.error(`idA: ${idA}`);

            // make a user
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck);
            //console.error(`idB: ${idB}`);

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

            // Get user by id
            const getUserA = await request(srv).get('/user/' + idA).set(authA).expect(200); // found user A
            const getUserFake = await request(srv).get('/user/fakeUserId').set(authA).expect(404); // not found

            // git an empty cabildo list
            const emptyCabildos = await request(srv).get('/cabildo').set(authA).expect(200)
            expect(emptyCabildos.body).toHaveLength(0);

            // make a cabildo
            cabA.cabildo.admin = idA;
            const idCab = await request(srv).post('/cabildo').set(authA).send(cabA).expect(201).then(idCheck);
            //console.error(`idCab: ${idCab}`);

            // get a cabildo back
            const oneCabildo = await request(srv).get('/cabildo').set(authA).expect(200)
            expect(oneCabildo.body).toHaveLength(1);

            // first user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({idUser: idB}).expect(/now follows user/)
            //console.error(`AfollowB`);

            // first user follows a cabildo
            const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
                .send({idCabildo: idCab}).expect(/now follows cabildo/)
            //console.error(`AfollowC`);

            // second user follows a cabildo
            const BfollowC = await request(srv).post('/user/followcabildo').set(authB)
                .send({idCabildo: idCab}).expect(/now follows cabildo/)
            //console.error(`BfollowC`);

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
            //console.error("prepared activities");

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
            //console.error("posted activities");

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
            //console.error("prepared comments");

            // post comments
            //console.error(comA0);
            const idComA0 = await request(srv).post('/activity/comment').set(authB).send(comA0)
                .expect(201).then(idCheck).catch(err => done(err));
            //console.error(idComA0);
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
            //console.error("posted comments");

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

            //console.error("idreact");
            const React = await request(srv).post('/activity/react').set(authB).send(reactDos).expect(201);
            const idReact = React.body.id
            //console.error(idReact);

            // get activity feed for first user
            //console.error('feeda');
            //const feedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
            //        console.error(feedA.body);

            //console.error("idreactagain");
            const idReactAgain = await request(srv).put(`/activity/react`).set(authB).send(
                {
                    idReaction: idReact,
                    idActivity: idActD,
                    value: -2,
                }).expect(200);
            //        console.error(idReactAgain.body);

            //console.error("voting on things");
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

            //console.error("updating");
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
            //console.log("getting homeA");
            const userHomeA = await request(srv).get(`/user/home`).set(authA).expect(200);
            //console.error("userHomeA:");
//            console.error(userHomeA.body);
            //console.log("getting homeB");
            const userHomeB = await request(srv).get(`/user/home`).set(authB).expect(200);
            //console.error("userHomeB:");
//            console.error(userHomeB.body);
//            expect(userHomeA.body).toStrictEqual([]);
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
            //console.error("finished")

            // get activity public
            const activityPublic = request(srv).get('activity/public').set(authA).expect(200);

            // Cabildo to be deleted
            cabB.cabildo.admin = idA;
            const idCabB = await request(srv).post('/cabildo').set(authA).send(cabB).expect(201).then(idCheck);
            // delete Cabildo
            const deleteCabildoA = request(srv).delete('cabildo/' + idCabB).set(authA).expect(200); // return ok, cabildo deleted
            const deleteCabildoB = request(srv).delete('cabildo/fakeIdCabildo').set(authA).expect(404); // return 404 cabildo not found

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

            // get users
            const getUserA  = await request(srv).get('/user/' + idA).set(authA).expect(200); // found user A
            const getUserFake = await request(srv).get('/user/fakeUserId').set(authA).expect(404); // not found

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
                // Check that everything was added properly
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
            // Update everything
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
                // Make sure everything was updated
                const userFeedA = await request(srv).get(`/user/home`).set(authA).expect(200);
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
                // Ensure everything is available by get
                const checkRep = await request(srv).get(`/activity/reply/${idReply}`).set(authA).expect(200);
                let gRep = checkRep.body;
                expect(gRep).toStrictEqual(rep);
                const checkCom = await request(srv).get(`/activity/comment/${idComA0}`).set(authA).expect(200);
                let gCom = checkCom.body;
                expect(gCom).toStrictEqual(com);
                const checkAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200);
                let gAct = checkAct.body;
                expect(gAct).toStrictEqual(act);
            }
            // Delete votes and reactions
            const delReact = await request(srv).delete('/activity/react').set(authA)
                .send({idActivity:idActA,idReaction:idReact}).expect(200);
            const delActVote = await request(srv).delete('/activity/vote').set(authA)
                .send({idActivity:idActA,idVote:voteAct}).expect(200);
            const delComVote = await request(srv).delete('/activity/comment/vote').set(authA)
                .send({idActivity:idActA,idComment:idComA0,idVote:voteComment}).expect(200);
            const delRepVote = await request(srv).delete('/activity/reply/vote').set(authA)
                .send({idActivity:idActA,idReply:idReply,idVote:voteReply}).expect(200);

            {
                // did ping and score drop?
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

            // Delete reply
            const delRep = await request(srv).delete('/activity/reply').set(authA)
                .send({idActivity: idActA,idComment: idComA0, idReply:idReply}).expect(200);
            {
                // Did it disappear?
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

            // Delete comment
            const delCom = await request(srv).delete('/activity/comment').set(authA)
                .send({idActivity: idActA,idComment:idComA0}).expect(200);
            {
                // Did it disappear?
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(0);
                expect(act.score).toBe(0);
                expect(act.commentNumber).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(0);
            }

            // Delete activity
            const delAct = await request(srv).delete('/activity').set(authA).send({idActivity: idActA}).expect(200);
            {
                // Is the feed empty?
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                expect(userFeedA.body).toHaveLength(0);

            }

            // Ensure nothing is available
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
                // Is everything back?
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

            // Delete a comment
            const RdelCom = await request(srv).delete('/activity/comment').set(authA)
                .send({idComment: RidComA0, idActivity: RidActA}).expect(200);
            {
                // Are the votes and reply gone?
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(2);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(0);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(0);
            }

            // Re-comment
            comA0.comment.idUser = idA;
            comA0.idActivity = RidActA;
            const RRidComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(err => done(err));

            // Re-reply
            const RRidReply = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        idUser: idA,
                        content: 'This is a reply',
                        score: 0,
                    },
                    idComment: RRidComA0,
                    idActivity: RidActA,
                }
            ).expect(201).then(idCheck).catch(err => done(err));
            // A comment vote
            const RRvoteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({idActivity: RidActA,idComment: RRidComA0,vote:{idUser:idA,value:1}}).expect(201).then(idCheck);

            // A reply Vote
            const RRvoteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({idActivity: RidActA,idReply: RRidReply, vote:{idUser:idA,value:1}}).expect(201).then(idCheck);
            {
                // Is at all back?
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

                // This is what the second user will see
                const actualBView = Object.assign(
                    {}, // Don't mutate original
                    userFeedA.body[0], // userB won't see any vote/react activity,
                    { // cause they didnt react or vote to anything
                        comments: [
                            Object.assign(
                                {}, // dont mutate original
                                userFeedA.body[0].comments[0],
                                {
                                    reply: [
                                        Object.assign(
                                            {},
                                            userFeedA.body[0].comments[0].reply[0],
                                            {
                                                votes: [],
                                            },
                                        ),
                                        ],
                                    votes: [],
                                },
                            ),
                        ],
                        reactions: [],
                        votes: [],
                    },
                );
                // First, second user follows nothing and sees nothing
                let userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body).toStrictEqual([]);
                // Second user follows cabildo and sees a populated home feed
                const BfollowC = await request(srv).post('/user/followcabildo').set(authB)
                    .send({idCabildo: idCab}).expect(/now follows cabildo/)
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body[0]).toStrictEqual(actualBView);

                // Lets make sure cabildo feed works while we're here
                const cabName = cabA.cabildo.name;
                const cabList = await request(srv).get('/cabildo').set(authB).expect(200);
                expect(cabList.body).toHaveLength(1)
                const cabProfile = await request(srv).get(`/cabildo/profile/${idCab}`).set(authB).expect(200);
                expect(cabProfile.body.name).toStrictEqual(cabName);
                const cabFeed = await request(srv).get(`/cabildo/feed/${idCab}`).set(authB).expect(200);
                expect(cabFeed.body[0]).toStrictEqual(actualBView);
                const cabCheck = await request(srv).get(`/cabildo/check/${cabName}`).set(authB)
                    .expect(200).expect(cabName)
                const badCabCheck = await request(srv).get(`/cabildo/check/ICANNOTEXISTASDKJASLKFJGA`).set(authB)
                    .expect(200).expect(/Could not find/);

                // Second user unfollows cabildo and sees nothin
                const BunFollowC = await request(srv).post('/user/unfollowcabildo').set(authB)
                    .send({idCabildo: idCab}).expect(/no longer follows cabildo/)
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body).toStrictEqual([]);
                // Second user follows first user and sees home feed
                const BfollowA = await request(srv).post('/user/followuser').set(authB)
                    .send({idUser: idA}).expect(/now follows user/)
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body[0]).toStrictEqual(actualBView);
                // Second user unfollows first user and sees nothing
                const BunFollowA = await request(srv).post('/user/unfollowuser').set(authB)
                    .send({idUser: idA}).expect(/no longer follows user/)
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body).toStrictEqual([]);
            }

            // Cabildo to be deleted
            cabB.cabildo.admin = idA;
            const idCabB = await request(srv).post('/cabildo').set(authA).send(cabB).expect(201).then(idCheck);

            const deleteCabildoA = request(srv).delete('cabildo/' + idCabB).set(authA).expect(200); // return ok, cabildo deleted
            const deleteCabildoB = request(srv).delete('cabildo/fakeIdCabildo').set(authA).expect(404); // return 404 cabildo not found

            // Now we have an activity, a comment, a reply, and a reaction/vote on each.

            // UserA made everything.

            // if userA -> cabA and userA -> userB, then:
            // userA makes these
            // userA sees this in personal, follow, cabildo, public
            // userB sees this in public, but not follow or personal, and can't see cabildo.

            // then userB follows userA, and sees it in follow, but can't see cabildo
            // then userB unfollows userA and can't see it
            // then userB follows cabildoA and can see it
            // then userB unfollows cabildoA and can't see it
            // then userB tries to delete activityA and fails
            // it still appears for userA
            // then userA deletes activityA and succeeds
            // then feeds are empty

            // Goodbye!
            done();
        }

    }, 20000);
});

/*
  All endpoints to test:

x  Auth:
x    Post   /auth/login
  User:
x    Post   /user
x    Get    /user/feed/:idUser
x    Get    /user/home
    Get    /user/:idUser
x    Post   /user/followcabildo
x    Post   /user/followuser
x    Post   /user/unfollowcabildo
x    Post   /user/unfollowuser
  Cabildo:
x    Post   /cabildo
x    Get    /cabildo
x    Get    /cabildo/check/:cabildoName
x    Get    /cabildo/feed/:idCabildo
x    Get    /cabildo/profile/:idCabildo
    Delete /cabildo
  Activity:
x    Post   /activity
    Get    /activity/public
x    Get    /activity/:idActivity
x    Put    /activity
x    Delete /activity
x    Post   /activity/vote
x    Put    /activity/vote
x    Delete /activity/vote
x  Comment:
x    Post   /activity/comment
x    Get    /activity/comment/:idComment
x    Put    /activity/comment
x    Delete /activity/comment
x    Post   /activity/comment/vote
x    Put    /activity/comment/vote
x    Delete /activity/comment/vote
x  Reply:
x    Post   /activity/reply
x    Get    /activity/reply/:idReply
x    Put    /activity/reply
x    Delete /activity/reply
x    Post   /activity/reply/vote
x    Put    /activity/reply/vote
x    Delete /activity/reply/vote
x  React:
x    Post   /activity/react
x    Put    /activity/react
x    Delete /activity/react

 */
