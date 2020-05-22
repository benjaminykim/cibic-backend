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
Error.stackTraceLimit=100;
jest.setTimeout(60000)
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
            return res.body.id;
        };
        // less typing on request() calls
        const srv = app.getHttpServer();

        if (oldTest) {
            const idA = await request(srv).post('/user').send(userA).expect(201).then(idCheck);

            // make a user
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck);

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

            // make a cabildo
            cabA.cabildo.admin = idA;
            const idCab = await request(srv).post('/cabildo').set(authA).send(cabA).expect(201).then(idCheck);
            //console.error(`idCab: ${idCab}`);

            // first user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({userId: idB}).expect(/now follows user/)
            //console.error(`AfollowB`);

            // first user follows a cabildo
            const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
                .send({cabildoId: idCab}).expect(/now follows cabildo/)
            //console.error(`AfollowC`);

            // second user follows a cabildo
            const BfollowC = await request(srv).post('/user/followcabildo').set(authB)
                .send({cabildoId: idCab}).expect(/now follows cabildo/)
            //console.error(`BfollowC`);

            // prepare activities with user and cabildo ids
            actA.activity.userId = idA;
            actB.activity.userId = idB;
            actC.activity.userId = idA;
            actD.activity.userId = idB;
            actE.activity.userId = idA;
            //actA.activity.cabildoId =
            actB.activity.cabildoId =
                actC.activity.cabildoId =
                actD.activity.cabildoId =
                actE.activity.cabildoId =
                idCab;
            //console.error("prepared activities");

            // post activites
            const idActA = await request(srv).post('/activity').set(authB).send(actA)
                .expect(201).then(idCheck).catch(done);
            const idActB = await request(srv).post('/activity').set(authB).send(actB)
                .expect(201).then(idCheck).catch(done);
            const idActC = await request(srv).post('/activity').set(authB).send(actC)
                .expect(201).then(idCheck).catch(done);
            const idActD = await request(srv).post('/activity').set(authB).send(actD)
                .expect(201).then(idCheck).catch(done);
            const idActE = await request(srv).post('/activity').set(authB).send(actE)
                .expect(201).then(idCheck).catch(done);
            //console.error("posted activities");

            // prapare comments with user and activity ids
            comA0.comment.userId = idA;
            comA1.comment.userId = idA;
            comA2.comment.userId = idA;
            comB0.comment.userId = idA;
            comB1.comment.userId = idA;
            comB2.comment.userId = idA;
            comC0.comment.userId = idA;
            comC1.comment.userId = idA;
            comC2.comment.userId = idA;
            comD0.comment.userId = idA;
            comD1.comment.userId = idA;
            comD2.comment.userId = idA;
            comE0.comment.userId = idA;
            comE1.comment.userId = idA;
            comE2.comment.userId = idA;
            comA0.activityId = comA1.activityId = comA2.activityId = idActA;
            comB0.activityId = comB1.activityId = comB2.activityId = idActB;
            comC0.activityId = comC1.activityId = comC2.activityId = idActC;
            comD0.activityId = comD1.activityId = comD2.activityId = idActD;
            comE0.activityId = comE1.activityId = comE2.activityId = idActE;
            //console.error("prepared comments");

            // post comments
            //console.error(comA0);
            const idComA0 = await request(srv).post('/activity/comment').set(authB).send(comA0)
                .expect(201).then(idCheck).catch(done);
            //console.error(idComA0);
            const idComA1 = await request(srv).post('/activity/comment').set(authB).send(comA1)
                .expect(201).then(idCheck).catch(done);
            const idComA2 = await request(srv).post('/activity/comment').set(authB).send(comA2)
                .expect(201).then(idCheck).catch(done);
            const idComB0 = await request(srv).post('/activity/comment').set(authB).send(comB0)
                .expect(201).then(idCheck).catch(done);
            const idComB1 = await request(srv).post('/activity/comment').set(authB).send(comB1)
                .expect(201).then(idCheck).catch(done);
            const idComB2 = await request(srv).post('/activity/comment').set(authB).send(comB2)
                .expect(201).then(idCheck).catch(done);
            const idComC0 = await request(srv).post('/activity/comment').set(authB).send(comC0)
                .expect(201).then(idCheck).catch(done);
            const idComC1 = await request(srv).post('/activity/comment').set(authB).send(comC1)
                .expect(201).then(idCheck).catch(done);
            const idComC2 = await request(srv).post('/activity/comment').set(authB).send(comC2)
                .expect(201).then(idCheck).catch(done);
            const idComD0 = await request(srv).post('/activity/comment').set(authB).send(comD0)
                .expect(201).then(idCheck).catch(done);
            const idComD1 = await request(srv).post('/activity/comment').set(authB).send(comD1)
                .expect(201).then(idCheck).catch(done);
            const idComD2 = await request(srv).post('/activity/comment').set(authB).send(comD2)
                .expect(201).then(idCheck).catch(done);
            const idComE0 = await request(srv).post('/activity/comment').set(authB).send(comE0)
                .expect(201).then(idCheck).catch(done);
            const idComE1 = await request(srv).post('/activity/comment').set(authB).send(comE1)
                .expect(201).then(idCheck).catch(done);
            const idComE2 = await request(srv).post('/activity/comment').set(authB).send(comE2)
                .expect(201).then(idCheck).catch(done);
            //console.error("posted comments");

            // post 100 replies
            for (let i = 0; i < 100; i++) {
                await request(srv).post('/activity/reply').set(authA).send(
                    {
                        reply: {
                            userId: idB,
                            content: `This is reply ${i}`,
                            score: i,
                        },
                        commentId: idComE2,
                        activityId: idActE,

                    }
                ).expect(201).then(idCheck).catch(done);
            }
            const reactDos = {
                activityId: idActD,
                reaction: {
                    userId: idB,
                    value: 2,
                }
            };

            const React = await request(srv).post('/activity/react').set(authB).send(reactDos).expect(201);
            const idReact = React.body.id

            const idReactAgain = await request(srv).put(`/activity/react`).set(authB).send(
                {
                    idReaction: idReact,
                    activityId: idActD,
                    value: -2,
                }).expect(200);

            const upVote = {
                activityId: idActA,
                vote: {
                    userId: idA,
                    value: 1,
                }
            };
            const res1 = await request(srv).post('/activity/vote').set(authA)
                .send(upVote).expect(201)
            const upd1 = await request(srv).put('/activity/vote').set(authA)
                .send({voteId:res1.body.id,activityId:idActA,value:-1}).expect(200)
            const voteComment = await request(srv).post('/activity/comment/vote').set(authB)
                .send({activityId: idActA,commentId: idComA0,vote:{userId:idB,value:1}})
                .expect(201)

            done();
        } else {
            // To turn messsages on and off
            const debug = (s: string) => {
//                console.error(s);
            }

            // First user
            const idA = await request(srv).post('/user').send(userA).expect(201).then(idCheck);
            const authARes = await request(srv).post('/auth/login').send({
                password: userA.user.password,
                email: userA.user.email
            }).expect(201);
            debug("got userA");
            const authA = {'Authorization': `Bearer ${authARes.body.access_token}`};

            // Second user
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck);
            const authBRes = await request(srv).post('/auth/login').send({
                password: userB.user.password,
                email: userB.user.email
            }).expect(201);
            debug("got userB");
            const authB = {'Authorization': `Bearer ${authBRes.body.access_token}`};

            // get users
            const getUserA  = await request(srv).get('/user/' + idA).set(authA).expect(200); // found user A
            const getUserFake = await request(srv).get('/user/99999999').set(authA).expect(404); // not found
            debug("tested user gets");
            // A Cabildo
            const idCab = await request(srv).post('/cabildo').set(authA)
                .send(cabA).expect(201).then(idCheck);
            debug("made cabildo");
            // First user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({userId: idB}).expect(/now follows user/)
            debug("followed user");
            // Second user follows cabildo
            const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
                .send({cabildoId: idCab}).expect(/now follows cabildo/);
            debug("followed cabildo");
            // An activity
            actA.activity.userId = idA;
            actA.activity.cabildoId = idCab;
            const idActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(done);
            debug("made activity");
            // A comment
            comA0.comment.userId = idA;
            comA0.activityId = idActA;
            const idComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(done);
            debug("made comment");
            // A Reply
            const replyId = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply',
                        score: 0,
                    },
                    commentId: idComA0,
                    activityId: idActA,
                }
            ).expect(201).then(idCheck).catch(done);
            debug("made reply");

            // Post reply with valid Id tag
            const replyTagValid = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply with a valid ID',
                        score: 0,
                        taggedUserId: idB,
                    },
                    commentId: idComA0,
                    activityId: idActA,
                }
            ).expect(201).then(idCheck).catch(done);
            debug("made reply with valid tag");
            // Post reply with invalid Id tag
            const replyTagInvalid = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply with an invalid ID',
                        score: 0,
                        taggedUserId: 12345,
                    },
                    commentId: idComA0,
                    activityId: idActA,
                }
            ).expect(404).then(idCheck).catch(done);
            debug("made reply with invalid tag");    
            // Get reply with valid Id tag
            const gCheckRepTagId = await request(srv).get(`/activity/reply/${replyTagValid}`).set(authA).expect(200);
            // console.error(gCheckRepTagId.body)
            // console.error(gCheckRepTagId.body)
            // console.error(gCheckRepTagId.body)
            // done()
            const gRepTagId = gCheckRepTagId.body.taggedUserId;
            expect(gRepTagId).toBe(idB);
            debug("getting tagged user id");
            
            // A Reaction
            const react = {
                activityId: idActA,
                reaction: {
                    userId: idA,
                    value: 2,
                }
            };
            const idReact = await request(srv).post('/activity/react').set(authA)
                .send(react).expect(201).then(idCheck);
            debug("made reaction");
            // An activity vote
            const voteAct = await request(srv).post('/activity/vote').set(authA)
                .send({vote: {activityId: idActA, userId: idA, value: 1}}).expect(201).then(idCheck);
            debug("voted on activity");
            // A comment vote
            const voteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({activityId: idActA,vote:{commentId: idComA0, userId:idA, value:1}}).expect(201).then(idCheck);
            debug("voted on comment");
            // A Reply Vote
            const voteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({activityId: idActA,vote:{replyId: replyId, userId: idA, value: 1}}).expect(201).then(idCheck);
            debug("voted on reply");
            {
                debug("checking user feed");
                // Check that everything was added properly
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                debug(userFeedA.body);
                let act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                let com = act.comments[0];
                expect(com.score).toBe(1);
                expect(com.replies).toHaveLength(1);
                expect(com.content).toBe('Comment');
                let rep = com.replies[0];
                expect(rep.score).toBe(1);
                expect(rep.content).toBe('This is a reply');
                debug("user feed is good");
            }
            // Update everything
            const upAct = await request(srv).put('/activity').set(authA)
                .send({activityId:idActA,content:'Update'}).expect(200);
            debug("update a activity");
            const upCom = await request(srv).put('/activity/comment').set(authA)
                .send({commentId:idComA0,content:'Update'}).expect(200);
            debug("update a comment");
            const upRep = await request(srv).put('/activity/reply').set(authA)
                .send({replyId:replyId,content:'Update'}).expect(200);
            debug("update a reply");
            const upRea = await request(srv).put('/activity/react').set(authA)
                .send({idReaction:idReact,activityId:idActA,value:-2}).expect(200);
            debug("update a reaction");
            const upVotAct = await request(srv).put('/activity/vote').set(authA)
                .send({voteId:voteAct,activityId:idActA,value:-1}).expect(200);
            debug("update an activity vote ");
            const upVotCom = await request(srv).put('/activity/comment/vote').set(authA)
                .send({voteId:voteComment,commentId:idComA0,value:-1}).expect(200);
            debug("update a comment vote");
            const upVotRep = await request(srv).put('/activity/reply/vote').set(authA)
                .send({voteId:voteReply,replyId:replyId,value:-1}).expect(200);
            debug("update a reply vote");

            {
                debug("getting home");
                // Make sure everything was updated
                const userFeedA = await request(srv).get(`/user/home`).set(authA)//.expect(200);
                debug("got home");
                debug(userFeedA.body);
                //expect(userFeedA.body).toStrictEqual([]);
                const act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(-3);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.score).toBe(-1);
                expect(com.replies).toHaveLength(1);
                expect(com.content).toBe('Update');
                const rep = com.replies[0];
                expect(rep.score).toBe(-1);
                expect(rep.content).toBe('Update');
                // Ensure everything is available by get
                debug("getting reply")
                const gCheckRep = await request(srv).get(`/activity/reply/${replyId}`).set(authA).expect(200);
                const gRep = gCheckRep.body;
                expect(gRep).toStrictEqual(rep);
                debug("getting comment")
                const gCheckCom = await request(srv).get(`/activity/comment/${idComA0}`).set(authA).expect(200);
                const gCom = gCheckCom.body;
                expect(gCom).toStrictEqual(com);
                debug("getting activity")
                const gCheckAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200);
                const gAct = gCheckAct.body;
                expect(gAct).toStrictEqual(act);
            }
            debug("made it through /user/home")
            // Delete votes and reactions
            const delReact = await request(srv).delete('/activity/react').set(authA)
                .send({activityId: idActA, idReaction: idReact}).expect(200);
            debug("deleted reaction")
            const delActVote = await request(srv).delete('/activity/vote').set(authA)
                .send({activityId: idActA, voteId: voteAct}).expect(200);
            debug("deleted activity vote")
            const delComVote = await request(srv).delete('/activity/comment/vote').set(authA)
                .send({activityId: idActA, commentId: idComA0, voteId: voteComment}).expect(200);
            debug("deleted comment vote")
            const delRepVote = await request(srv).delete('/activity/reply/vote').set(authA)
                .send({activityId: idActA, replyId: replyId, voteId: voteReply}).expect(200);
            debug("deleted reply vote")
            debug("made it through deletes")

            {
                // did ping and score drop?
                debug("checking post delete feed")
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                debug("got feed back in test")
                const act = userFeedA.body[0];
                expect(act.ping).toBe(2);
                expect(act.score).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.score).toBe(0);
                expect(com.replies).toHaveLength(1);
                expect(com.content).toBe('Update');
                const rep = com.replies[0];
                expect(rep.score).toBe(0);
                expect(rep.content).toBe('Update');
                debug("made it through post-delete feed")
            }

            // Delete reply
            debug("delete a reply")
            const delRep = await request(srv).delete('/activity/reply').set(authA)
                .send({activityId: idActA, commentId: idComA0, replyId: replyId})//.expect(200);
            {
                    // Did it disappear?
                    debug("checking feed for no replies")
                    const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA)//.expect(200);
                    const act = userFeedA.body[0];
                    expect(act.ping).toBe(1);
                    expect(act.score).toBe(0);
                    expect(act.text).toBe('Update');
                    expect(act.comments).toHaveLength(1);
                    const com = act.comments[0];
                    expect(com.score).toBe(0);
                    expect(com.replies).toHaveLength(0);
                    expect(com.content).toBe('Update');
            }

            // Delete comment
            debug("delete a comment")
            const delCom = await request(srv).delete('/activity/comment').set(authA)
                .send({activityId: idActA, commentId: idComA0})//.expect(200);
            {
                    // Did it disappear?
                    debug("checking feed for no comments")
                    const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                    const act = userFeedA.body[0];
                    expect(act.ping).toBe(0);
                    expect(act.score).toBe(0);
                    expect(act.commentNumber).toBe(0);
                    expect(act.text).toBe('Update');
                    expect(act.comments).toHaveLength(0);
            }

            // Delete activity
            debug("dlete an activity")
            const delAct = await request(srv).delete('/activity').set(authA).send({activityId: idActA}).expect(200);
            {
                // Is the feed empty?
                debug("check for empty feed")
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                expect(userFeedA.body).toHaveLength(0);

            }

            debug("check for empty responses")
            // Ensure nothing is available
            const checkRep = await request(srv).get(`/activity/reply/${replyId}`).set(authA).expect(404);
            const checkCom = await request(srv).get(`/activity/comment/${idComA0}`).set(authA).expect(404);
            const checkAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(404);
            const checkVot = await request(srv).get(`/activity/vote/${voteReply}`).set(authA).expect(404);

            debug("take it back now yall")
            // Recreating everything then doing a delte in the oppoiste direction
            // An activity
            actA.activity.userId = idA;
            actA.activity.cabildoId = idCab;
            const RidActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(done);

            // A comment
            comA0.comment.userId = idA;
            comA0.activityId = RidActA;
            const RidComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(done);

            // A Reply
            const RreplyId = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply',
                        score: 0,
                    },
                    commentId: RidComA0,
                    activityId: RidActA,
                },
            ).expect(201).then(idCheck).catch(done);
            debug("added reply, back to test")
            // A Reaction
            const Rreact = {
                activityId: RidActA,
                reaction: {
                    userId: idA,
                    value: 2,
                },
            };
            debug("reaction time")
            const RidReact = await request(srv).post('/activity/react').set(authA)
                .send(Rreact).expect(201).then(idCheck);
            debug("reaction made, time for votes")
            // An activity vote
            const RvoteAct = await request(srv).post('/activity/vote').set(authA)
                .send({vote: {activityId: RidActA, userId: idA, value: 1}}).expect(201).then(idCheck);

            // A comment vote
            const RvoteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({activityId: RidActA, vote: {commentId: RidComA0, userId: idA, value: 1}}).expect(201).then(idCheck);

            // A Reply Vote
            const RvoteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({activityId: RidActA, vote: {replyId: RreplyId, userId: idA, value: 1}}).expect(201).then(idCheck);

            debug("voted on stuff, does it get fed?")
            {
                // Is everything back?
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                const act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.score).toBe(1);
                expect(com.replies).toHaveLength(1);
                expect(com.content).toBe('Comment');
                const rep = com.replies[0];
                expect(rep.score).toBe(1);
                expect(rep.content).toBe('This is a reply');
                debug("got fed")
            }

            // Delete a comment
            const RdelCom = await request(srv).delete('/activity/comment').set(authA)
                .send({commentId: RidComA0, activityId: RidActA}).expect(200).catch(console.error);
            debug("del com")
            {
                // Are the votes and reply gone?
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                const act = userFeedA.body[0];
                expect(act.ping).toBe(2);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(0);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(0);
                debug("del com good")
            }

            // Re-comment
            comA0.comment.userId = idA;
            comA0.activityId = RidActA;
            const RRidComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(done);
            debug("recom")

            // Re-reply
            const RRreplyId = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply',
                        score: 0,
                    },
                    commentId: RRidComA0,
                    activityId: RidActA,
                },
            ).expect(201).then(idCheck).catch(done);
            debug("rereply")
            // A comment vote
            const RRvoteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({
                    activityId: RidActA,
                    vote: {
                    commentId: RRidComA0,
                        userId: idA,
                        value: 1,
                    },
                }).expect(201).then(idCheck);

            // A reply Vote
            const RRvoteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({
                    activityId: RidActA,
                    vote: {
                    replyId: RRreplyId,
                        userId: idA,
                        value: 1,
                    },
                }).expect(201).then(idCheck);
            debug("revoted")

            {
                // Is at all back?
                const userFeedA = await request(srv).get(`/user/feed/${idA}`).set(authA).expect(200);
                const act = userFeedA.body[0];
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.commentNumber).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.score).toBe(1);
                expect(com.replies).toHaveLength(1);
                expect(com.content).toBe('Comment');
                const rep = com.replies[0];
                expect(rep.score).toBe(1);
                expect(rep.content).toBe('This is a reply');

                debug("feed still good")
                // This is what the second user will see
                const actualBView = Object.assign(
                    {}, // Don't mutate original
                    userFeedA.body[0], // userB won't see any vote/react activity,
                    { // cause they didnt react or vote to anything
                        cabildo: Object.assign(
                            {}, // Don't mutate original
                            userFeedA.body[0].cabildo,
                            {
                                membersIds: [1, 2], // add second user's id
                            },
                        ),
                        comments: [
                            Object.assign(
                                {}, // dont mutate original
                                userFeedA.body[0].comments[0],
                                {
                                    replies: [
                                        Object.assign(
                                            {},
                                            userFeedA.body[0].comments[0].replies[0],
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
                    .send({cabildoId: idCab}).expect(/now follows cabildo/);
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body).toStrictEqual([actualBView]);

                // Lets make sure cabildo feed works while we're here
                const cabName = cabA.cabildo.name;
                const cabList = await request(srv).get('/cabildo').set(authB).expect(200);
                expect(cabList.body).toHaveLength(1);
                const cabProfile = await request(srv).get(`/cabildo/profile/${idCab}`).set(authB).expect(200);
                expect(cabProfile.body.name).toStrictEqual(cabName);
                const cabFeed = await request(srv).get(`/cabildo/feed/${idCab}`).set(authB).expect(200);
                expect(cabFeed.body[0]).toStrictEqual(actualBView);
                const cabCheck = await request(srv).get(`/cabildo/check/${cabName}`).set(authB)
                    .expect(200).expect(cabName);
                const badCabCheck = await request(srv).get(`/cabildo/check/ICANNOTEXISTASDKJASLKFJGA`).set(authB)
                    .expect(200).expect(/Could not find/);

                // Second user unfollows cabildo and sees nothin
                const BunFollowC = await request(srv).post('/user/unfollowcabildo').set(authB)
                    .send({cabildoId: idCab}).expect(/no longer follows cabildo/);
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body).toStrictEqual([]);
                const unfollowedview = Object.assign(
                    {},
                    actualBView,
                    {
                        cabildo: Object.assign(
                            {}, // Don't mutate original
                            userFeedA.body[0].cabildo,
                            {
                                membersIds: [1], // remove second user's id
                            },
                        ),
                    }
                );
                // Second user follows first user and sees home feed
                const BfollowA = await request(srv).post('/user/followuser').set(authB)
                    .send({userId: idA}).expect(/now follows user/);
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body[0]).toStrictEqual(unfollowedview);
                // Second user unfollows first user and sees nothing
                const BunFollowA = await request(srv).post('/user/unfollowuser').set(authB)
                    .send({userId: idA}).expect(/no longer follows user/);
                userBView = await request(srv).get(`/user/home`).set(authB).expect(200);
                expect(userBView.body).toStrictEqual([]);
            }

            // get activity public
            const activityPublic = request(srv).get('activity/public').set(authA).expect(200);

            // Cabildo to be deleted
            cabB.cabildo.admin = idA;
            const idCabB = await request(srv).post('/cabildo').set(authA).send(cabB).expect(201).then(idCheck);

            const deleteCabildoWrongUser = request(srv).delete('cabildo/' + idCabB).set(authB).expect(401); // return unauthorized
            const deleteCabildoA = request(srv).delete('cabildo/' + idCabB).set(authA).expect(200); // return ok, cabildo deleted
            const deleteCabildoB = request(srv).delete('cabildo/fakeIdCabildo').set(authA).expect(404); // return 404 cabildo not found

            // Goodbye!
            done();
        }

    }, 20000);
});

/*
  All endpoints to test:

  x  Auth:
  x    Post   /auth/login
  x  User:
  x    Post   /user
  x    Get    /user/feed/:userId
  x    Get    /user/home
  x    Get    /user/:userId
  x    Post   /user/followcabildo
  x    Post   /user/followuser
  x    Post   /user/unfollowcabildo
  x    Post   /user/unfollowuser
  x  Cabildo:
  x    Post   /cabildo
  x    Get    /cabildo
  x    Get    /cabildo/check/:cabildoName
  x    Get    /cabildo/feed/:cabildoId
  x    Get    /cabildo/profile/:cabildoId
  x    Delete /cabildo                      // Needs relational data check
  x  Activity:
  x    Post   /activity
  x    Get    /activity/public
  x    Get    /activity/:activityId
  x    Put    /activity
  x    Delete /activity
  x    Post   /activity/vote
  x    Put    /activity/vote
  x    Delete /activity/vote
  x  Comment:
  x    Post   /activity/comment
  x    Get    /activity/comment/:commentId
  x    Put    /activity/comment
  x    Delete /activity/comment
  x    Post   /activity/comment/vote
  x    Put    /activity/comment/vote
  x    Delete /activity/comment/vote
  x  Reply:
  x    Post   /activity/reply
  x    Get    /activity/reply/:replyId
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
