import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

import {
    userA,userB,cabA,cabB,
    actA,comA0,comA1,comA2,
    actB,comB0,comB1,comB2,
    actC,comC0,comC1,comC2,
    actD,comD0,comD1,comD2,
    actE,comE0,comE1,comE2,
    searchA, searchB, searchC,
    badSearchA, badSearchB,
    badSearchC, badSearchD,
    tagSearchA, tagSearchB,
    reply,
    comLong, actLong,
} from './mockData';

Error.stackTraceLimit=100;
jest.setTimeout(parseInt(process.env.JEST_TIMEOUT) || 20000)
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
        // To turn messsages on and off
        const debug = (s: any) => {
            console.error(s);
        }
        // promise callback on document creation
        const idCheck = res => {
            return res.body.id;
        };
        // less typing on request() calls
        const srv = await app.getHttpServer();

        if (oldTest) {
            const idA = await request(srv).post('/user').send(userA).expect(201).then(idCheck).catch(done);

            // make a user
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck).catch(done);

            const authARes = await request(srv).post('/auth/login').send({
                password: userA.user.password,
                email: userA.user.email
            }).expect(201).catch(done);
            const authA = {'Authorization': `Bearer ${authARes.body.access_token}`};
            const authBRes = await request(srv).post('/auth/login').send({
                password: userB.user.password,
                email: userB.user.email
            }).expect(201).catch(done);
            const authB = {'Authorization': `Bearer ${authBRes.body.access_token}`};

            // make a cabildo
            const idCab = await request(srv).post('/cabildo').set(authA).send(cabA).expect(201).then(idCheck).catch(done);
            debug(`idCab: ${idCab}`);

            // first user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({userId: idB}).expect(201).catch(done);
            debug(`AfollowB`);

            // first user follows a cabildo
            const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
                .send({cabildoId: idCab}).expect(201).catch(done);
            debug(`AfollowC`);

            // second user follows a cabildo
            const BfollowC = await request(srv).post('/user/followcabildo').set(authB)
                .send({cabildoId: idCab}).expect(201).catch(done);
            debug(`BfollowC`);

            // prepare activities with user and cabildo ids
            actA.activity['cabildoId'] =
                actB.activity['cabildoId'] =
                actC.activity['cabildoId'] =
                actD.activity['cabildoId'] =
                actE.activity['cabildoId'] =
                idCab;
            debug("prepared activities");

            // post activites
            const idActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(done);
            const idActB = await request(srv).post('/activity').set(authB).send(actB)
                .expect(201).then(idCheck).catch(done);
            const idActC = await request(srv).post('/activity').set(authA).send(actC)
                .expect(201).then(idCheck).catch(done);
            const idActD = await request(srv).post('/activity').set(authB).send(actD)
                .expect(201).then(idCheck).catch(done);
            const idActE = await request(srv).post('/activity').set(authA).send(actE)
                .expect(201).then(idCheck).catch(done);
            debug("posted activities");

            // prapare comments with user and activity ids
            comA0.activityId = comA1.activityId = comA2.activityId = idActA;
            comB0.activityId = comB1.activityId = comB2.activityId = idActB;
            comC0.activityId = comC1.activityId = comC2.activityId = idActC;
            comD0.activityId = comD1.activityId = comD2.activityId = idActD;
            comE0.activityId = comE1.activityId = comE2.activityId = idActE;
            debug("prepared comments");

            // post comments
            debug(comA0);
            const idComA0 = await request(srv).post('/activity/comment').set(authB).send(comA0)
                .expect(201).then(idCheck).catch(done);
            debug(idComA0);
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
            debug("posted comments");

            // post 100 replies
            for (let i = 0; i < 100; i++) {
                await request(srv).post('/activity/reply').set(authA).send(
                    {
                        reply: {
                            content: `This is reply ${i}`,
                            commentId: idComE2,
                            activityId: idActE,
                        },

                    }
                ).expect(201).then(idCheck).catch(done);
            }
            debug("posted replies")
            const reactDos = {
                reaction: {
                    activityId: idActD,
                    value: 2,
                }
            };

            const React = await request(srv).post('/activity/react').set(authB).send(reactDos).expect(201).catch(done);
            debug("reacted")
            const idReact = React.body.id

            const idReactAgain = await request(srv).put(`/activity/react`).set(authB).send(
                {
                    reactionId: idReact,
                    activityId: idActD,
                    value: -2,
                }).expect(200).catch(done);
            debug("reacted again")
            const upVote = {
                vote: {
                    activityId: idActA,
                    value: 1,
                }
            };
            const res1 = await request(srv).post('/activity/vote').set(authA)
                .send(upVote).expect(201).catch(done);
            debug("activity voted")
            const upd1 = await request(srv).put('/activity/vote').set(authA)
                .send({voteId:res1.body.id,value:-1}).expect(200).catch(done);
            debug("updated")
            const voteComment = await request(srv).post('/activity/comment/vote').set(authB)
                .send({vote:{activityId: idActA,commentId: idComA0,userId:idB,value:1}})
                .expect(201).catch(done);
            debug("comment voted")
            done()
        } else {

            // First user
            debug("first user")
            const idA = await request(srv).post('/user').send(userA).expect(201).then(idCheck).catch(done);
            debug("userA registered")
            const authARes = await request(srv).post('/auth/login').send({
                password: userA.user.password,
                email: userA.user.email
            }).expect(201).catch(done);
            debug("userA logged-in");
            const authA = {'Authorization': `Bearer ${authARes.body.access_token}`};

            // Second user
            debug("second user")
            const idB = await request(srv).post('/user').send(userB).expect(201).then(idCheck).catch(done);
            debug("userB registered")
            const authBRes = await request(srv).post('/auth/login').send({
                password: userB.user.password,
                email: userB.user.email
            }).expect(201).catch(done);
            debug("userB logged-in");
            const authB = {'Authorization': `Bearer ${authBRes.body.access_token}`};

            // get users
            let getUserA  = await request(srv).get('/user/' + idA).set(authA).expect(200).catch(done); // found user A
            const getUserFake = await request(srv).get('/user/99999999').set(authA).expect(404).catch(done); // not found
            debug("tested user gets");

            {
                // Check the default user description
                const defaultUserDesc = "Ciudadano Nuevo";
                getUserA =  await request(srv).get('/user/' + idA).set(authA).expect(200).catch(done);
                expect(getUserA.body.desc).toBe(defaultUserDesc);

                // Update user A description with a new string; check if user description is updated
                const userDescNew = "this is the new description";
                await request(srv).put(`/user/description`).set(authA).send({newDesc: userDescNew}).expect(200).catch(done);
                getUserA = await request(srv).get('/user/' + idA).set(authA).expect(200).catch(done);
                expect(getUserA.body.desc).toBe(userDescNew);
                debug("user description properly updated");

                // Update user A description with an empty string; check if user description is ""
                const userDescEmpty = "";
                await request(srv).put(`/user/description`).set(authA).send({newDesc: userDescEmpty}).expect(200).catch(done);
                getUserA = await request(srv).get('/user/' + idA).set(authA).expect(200).catch(done);
                expect(getUserA.body.desc).toBe(userDescEmpty);
                debug("user description accept empty strings as inputs")

                // Invalid user tries to update user description
                await request(srv).put(`/user/description`).set({'Authorization': `9999`}).send({newDesc: userDescNew}).expect(401).catch(done);

                // Update user A description back to default; check if user description is back to "Ciudadano Nuevo"
                await request(srv).put(`/user/description`).set(authA).send({newDesc: defaultUserDesc}).expect(200).catch(done);
                getUserA =  await request(srv).get('/user/' + idA).set(authA).expect(200).catch(done);
                expect(getUserA.body.desc).toBe(defaultUserDesc);
                debug("user description updated back to default")
            }

            // A cabildo
            const idCab = await request(srv).post('/cabildo').set(authA)
                .send(cabA).expect(201).then(idCheck).catch(done);
            debug("made cabildo");
            // First user follows second user
            const AfollowB = await request(srv).post('/user/followuser').set(authA)
                .send({userId: idB}).expect(201).catch(done);
            debug("followed user");
            // First user follows cabildo
            //const AfollowC = await request(srv).post('/user/followcabildo').set(authA)
            //    .send({cabildoId: idCab}).expect(201).catch(done);
            debug("followed cabildo");
            // An activity
            actA.activity['cabildoId'] = idCab;
            const idActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(done);

            // Long activity
            actLong.activity['cabildoId'] = idCab;
            const longActRes = await request(srv).post('/activity').set(authA).send(actLong).expect(413).catch(done);

            debug("made activity");
            // A comment
            comLong.activityId = comA0.activityId = idActA;
            const idComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(done);
            debug("made comment");

            //long comment
            const resLongCom = await request(srv).post('/activity/comment').set(authA).send(comLong).expect(413).catch(done);
            debug("verified response of too-long comment");

            // A Reply
            const replyId = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply',
                        commentId: idComA0,
                        activityId: idActA,
                    },
                }
            ).expect(201).then(idCheck).catch(done);
            debug("made reply");

            // long reply
            const resLongReply = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'this is a really long reply, far too long for any person to reasonably put in our app. its so long that if i were reading it i would just stop reading, like tl;dr right? like its actually hard to fill up even just this space with text. ffffffffffffffff see that took a whole second like wow gosh darn diggity holy god dang. still typing. hoping that this is long enough to trigger the Payload Too Large (413) error that im hoping to see after this test. if you see this you owe alex a pizza. this is a legally binding contract and youve signed already see look? -yourname look there it is right there its your name fufufufu~ aaaaaaaaa why am i still typing is this 500 characters yet? probably. this is done.',
                        commentId: idComA0,
                        activityId: idActA,
                    },
                }
            ).expect(413).catch(done);

            // Post reply with valid Id tag
            const replyTagValid = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply with a valid ID',
                        taggedUserId: idB,
                        commentId: idComA0,
                        activityId: idActA,
                    },
                }
            ).expect(201).then(idCheck).catch(done);
            debug("made reply with valid tag");
            // Post reply with invalid Id tag
            const replyTagInvalid = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        userId: idA,
                        content: 'This is a reply with an invalid ID',
                        taggedUserId: 12345,
                        commentId: idComA0,
                        activityId: idActA,
                    },
                }
            ).expect(404).then(idCheck).catch(done);
            debug("made reply with invalid tag");
            // Get reply with valid Id tag
            const gCheckRepTagId = await request(srv).get(`/activity/reply/${replyTagValid}`).set(authA).expect(200);
            const gRepTagId = gCheckRepTagId.body.taggedUserId;
            expect(gRepTagId).toBe(idB);
            debug("getting tagged user id");

            const tagcleanup = await request(srv).delete('/activity/reply').set(authA)
                .send({replyId: replyTagValid}).expect(200).catch(done);
            debug("removed tagged user reply")
            // A Reaction
            const react = {
                reaction: {
                    activityId: idActA,
                    value: 2,
                }
            };
            const idReact = await request(srv).post('/activity/react').set(authA)
                .send(react).expect(201).then(idCheck).catch(done);
            debug("made reaction");
            // An activity vote
            const voteAct = await request(srv).post('/activity/vote').set(authA)
                .send({vote: {activityId: idActA, value: 1}}).expect(201).then(idCheck).catch(done);
            debug("voted on activity");
            // A comment vote
            const voteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({vote:{activityId: idActA,commentId: idComA0, value:1}}).expect(201).then(idCheck).catch(done);
            debug("voted on comment");
            // A Reply Vote
            const voteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({vote:{activityId: idActA,replyId: replyId, value: 1}}).expect(201).then(idCheck).catch(done);
            debug("voted on reply");

            // Check that everything was added properly
            {
                debug("checking user feed");
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);
                debug(userFeedA.body);

                // get the full data of the first feed activity
                const dummy = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                debug(dummy.body);

                let act = dummy.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.comment_number).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                expect(act.saversIds).toHaveLength(0);
                let com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(1);
                expect(com.content).toBe('Comment');
                debug("user feed is good");
            }

            // User A save activity
            await request(srv).post('/activity/save').set(authA).send({activityId: idActA}).expect(201).catch(done);
            debug("user A saved activity");

            // Check if activity was saved by user A
            const gUserA  = await request(srv).get('/user/' + idA).set(authA).expect(200).catch(done);
            const bodyUserA = gUserA.body;
            expect(bodyUserA.activitySavedIds).toHaveLength(1);
            debug("activity is properly related to user");

            // Check if properties of the activity were saved too
            {
                debug("getting activity-saved feed");
                const userASavFeed = await request(srv).get('/activity/save/feed/0').set(authA).expect(200).catch(done);
                debug("got activity saved feed");
                debug(userASavFeed.body);

                const dummy2 = await request(srv).get(`/activity/${userASavFeed.body[0].id}`).set(authA).expect(200).catch(done);
                debug("retrieved full activity");
                debug(dummy2.body);

                const act = dummy2.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.comment_number).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                expect(act.saversIds).toHaveLength(1);
                const com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(1);
                expect(com.content).toBe('Comment');
                debug("activity-saved feed is good");
            }

            // User A try to re-save activity
            await request(srv).post('/activity/save').set(authA).send({activityId: idActA}).expect(500).catch(done);
            debug("user A couldn´t re-save activity");

            // User A try to save a fake activity
            const idActX = 99999;
            await request(srv).post('/activity/save').set(authA).send({activityId: idActX}).expect(404).catch(done);
            debug("user A couldn´t save fake activity");

            // Fake user try to save activity
            const authX = {'Authorization': `9999`};
            await request(srv).post('/activity/save').set(authX).send({activityId: idActA}).expect(401).catch(done);
            debug("fake user couldn´t save activity");

            // Fake user try to request an activity-saved feed
            let userXSavFeed = await request(srv).get('/activity/save/feed/0').set(authX).expect(401).catch(done);
            debug("fake user couldn´t get activity-saved feed");

            // First check of how many savers have the activity
            let gSavAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200).catch(done);
            let savAct = gSavAct.body;
            expect(savAct.saversIds).toHaveLength(1);
            debug("activity properly have one saver");

            // User B save activity
            await request(srv).post('/activity/save').set(authB).send({activityId: idActA}).expect(201).catch(done);
            debug("user B saved activity");

            // Second check of how many savers have the activity
            gSavAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200).catch(done);
            savAct = gSavAct.body;
            expect(savAct.saversIds).toHaveLength(2);
            debug("activity properly have two savers");

            // User A try to unsave fake activity
            await request(srv).post('/activity/unsave').set(authA).send({activityId: idActX}).expect(404).catch(done);
            debug("user A can't unsaved fake activity");

            // Fake user try to unsave activity
            await request(srv).post('/activity/unsave').set(authX).send({activityId: idActA}).expect(401).catch(done);
            debug("fake user couldn´t unsave activity");

            // User A unsave activity
            await request(srv).post('/activity/unsave').set(authA).send({activityId: idActA}).expect(201).catch(done);
            debug("user A unsaved activity");

            // Check if user A activity-saved feed is empty
            const userASavFeed = await request(srv).get(`/activity/save/feed/0`).set(authA).expect(200).catch(done);
            expect(userASavFeed.body).toStrictEqual([]);
            debug("user A activity-saved feed is correctly empty");

            // Third check of how many savers have the activity
            gSavAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200).catch(done);
            savAct = gSavAct.body;
            expect(savAct.saversIds).toHaveLength(1);
            debug("activity properly have one saver");

            // User A try to re-unsave activity
            await request(srv).post('/activity/unsave').set(authA).send({activityId: idActA}).expect(201).catch(done);
            debug("user A re-unsave activity");

            // Fourth check of how many savers have the activity
            gSavAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200).catch(done);
            savAct = gSavAct.body;
            expect(savAct.saversIds).toHaveLength(1);
            debug("activity properly have one saver");

            // Check if user B save activity
            const gUserB  = await request(srv).get('/user/' + idB).set(authB).expect(200).catch(done);
            const bodyUserB = gUserB.body;
            expect(bodyUserB.activitySavedIds).toHaveLength(1);
            debug("user B save activity");

            // User B unsave activity
            await request(srv).post('/activity/unsave').set(authB).send({activityId: idActA}).expect(201).catch(done);
            debug("user B unsaved activity");

            // Fifth check of how many savers have the activity
            gSavAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(200).catch(done);
            savAct = gSavAct.body;
            expect(savAct.saversIds).toHaveLength(0);
            debug("activity properly have zero savers");

            // Update everything
            const upAct = await request(srv).put('/activity').set(authA)
                .send({activityId:idActA,content:'Update'}).expect(200).catch(done);
            debug("update a activity");
            const upCom = await request(srv).put('/activity/comment').set(authA)
                .send({commentId:idComA0,content:'Update'}).expect(200).catch(done);
            debug("update a comment");
            const upRep = await request(srv).put('/activity/reply').set(authA)
                .send({replyId:replyId,content:'Update'}).expect(200).catch(done);
            debug("update a reply");
            const upRea = await request(srv).put('/activity/react').set(authA)
                .send({reactionId:idReact,value:-2}).expect(200).catch(done);
            debug("update a reaction");
            const upVotAct = await request(srv).put('/activity/vote').set(authA)
                .send({voteId:voteAct,value:-1}).expect(200).catch(done);
            debug("update an activity vote ");
            const upVotCom = await request(srv).put('/activity/comment/vote').set(authA)
                .send({voteId:voteComment,value:-1}).expect(200).catch(done);
            debug("update a comment vote");
            const upVotRep = await request(srv).put('/activity/reply/vote').set(authA)
                .send({voteId:voteReply,value:-1}).expect(200).catch(done);
            debug("update a reply vote");

            {
                debug("getting home");
                // Make sure everything was updated
                const userFeedA = await request(srv).get(`/user/home/0`).set(authA).expect(200).catch(done);
                debug("got home");
                debug(userFeedA.body);

                // get full activity data
                const dummy3 = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const act = dummy3.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(6);
                expect(act.score).toBe(-3);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                expect(act.saversIds).toHaveLength(0);
                const com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(-1);
                expect(com.content).toBe('Update');

                const fullAct = await request(srv).get(`/activity/${act.id}`).set(authA).expect(200).catch(done)
                    const rep = fullAct.body.comments[0].replies[0];
                expect(rep.user.firstName).toBe(userA.user.firstName)
                expect(rep.score).toBe(-1);
                expect(rep.content).toBe('Update');
                // Ensure everything is available by get
                debug("getting reply")
                const gCheckRep = await request(srv).get(`/activity/reply/${replyId}`).set(authA).expect(200).catch(done);
                const gRep = gCheckRep.body;
                expect(gRep).toStrictEqual(rep);
                debug("getting comment")
                const gCheckCom = await request(srv).get(`/activity/comment/${idComA0}`).set(authA).expect(200).catch(done);
                const gCom = gCheckCom.body;
                expect(gCom).toStrictEqual(fullAct.body.comments[0]);
            }
            debug("made it through /user/home")
            // Delete votes and reactions
            const delReact = await request(srv).delete('/activity/react').set(authA)
                .send({reactionId: idReact}).expect(200).catch(done);
            debug("deleted reaction")
            const delActVote = await request(srv).delete('/activity/vote').set(authA)
                .send({voteId: voteAct}).expect(200).catch(done);
            debug("deleted activity vote")
            const delComVote = await request(srv).delete('/activity/comment/vote').set(authA)
                .send({voteId: voteComment}).expect(200).catch(done);
            debug("deleted comment vote")
            const delRepVote = await request(srv).delete('/activity/reply/vote').set(authA)
                .send({voteId: voteReply}).expect(200).catch(done);
            debug("deleted reply vote")
            debug("made it through deletes")

            {
                // did ping and score drop?
                debug("checking post delete feed")
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);
                debug("got feed back in test")

                // get full activity data
                const dummy4 = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const act = dummy4.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(2);
                expect(act.score).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(0);
                expect(com.content).toBe('Update');
                debug("made it through post-delete feed")
            }

            // Delete reply
            debug("delete a reply")
            const delRep = await request(srv).delete('/activity/reply').set(authA)
                .send({replyId: replyId}).expect(200).catch(done);
            {
                // Did it disappear?
                debug("checking feed for no replies")
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);

                // get full activity data
                const dummy5 = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const act = dummy5.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(1);
                expect(act.score).toBe(0);
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(0);
                expect(com.content).toBe('Update');
            }

            // Delete comment
            debug("delete a comment")
            const delCom = await request(srv).delete('/activity/comment').set(authA)
                .send({commentId: idComA0}).expect(200).catch(done);
            {
                // Did it disappear?
                debug("checking feed for no comments")
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);

                // get full activity data
                const dummy6 = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const act = dummy6.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.text).toBe('Update');
                expect(act.comments).toHaveLength(0);
                expect(act.comment_number).toBe(0);
                expect(act.ping).toBe(0);
                expect(act.score).toBe(0);
            }

            // Delete activity
            debug("delete an activity")
            const delAct = await request(srv).delete('/activity').set(authA).send({activityId: idActA}).expect(200).catch(done);
            {
                // Is the feed empty?
                debug("check for empty feed")
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);
                expect(userFeedA.body).toHaveLength(0);

            }

            debug("check for empty responses")
            // Ensure nothing is available
            const checkRep = await request(srv).get(`/activity/reply/${replyId}`).set(authA).expect(404).catch(done);
            const checkCom = await request(srv).get(`/activity/comment/${idComA0}`).set(authA).expect(404).catch(done);
            const checkAct = await request(srv).get(`/activity/${idActA}`).set(authA).expect(404).catch(done);
            const checkVot = await request(srv).get(`/activity/vote/${voteReply}`).set(authA).expect(404).catch(done);

            debug("take it back now yall")
            // Recreating everything then doing a delte in the oppoiste direction
            // An activity
            actA.activity['cabildoId'] = idCab;
            const RidActA = await request(srv).post('/activity').set(authA).send(actA)
                .expect(201).then(idCheck).catch(done);
            debug("made activity again")
            // A comment
            comA0.activityId = RidActA;
            const RidComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(done);
            debug("made comment again")

            // A Reply
            const RreplyId = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        content: 'This is a reply',
                        commentId: RidComA0,
                        activityId: RidActA,
                    },
                },
            ).expect(201).then(idCheck).catch(done);
            debug("added reply, back to test")
            // A Reaction
            const Rreact = {
                reaction: {
                    activityId: RidActA,
                    value: 2,
                },
            };
            debug("reaction time")
            const RidReact = await request(srv).post('/activity/react').set(authA)
                .send(Rreact).expect(201).then(idCheck).catch(done);
            debug("reaction made, time for votes")
            // An activity vote
            const RvoteAct = await request(srv).post('/activity/vote').set(authA)
                .send({vote: {activityId: RidActA, value: 1}}).expect(201).then(idCheck).catch(done);

            // A comment vote
            const RvoteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({vote: {activityId: RidActA, commentId: RidComA0, value: 1}}).expect(201).then(idCheck).catch(done);

            // A Reply Vote
            const RvoteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({vote: {activityId: RidActA, replyId: RreplyId, value: 1}}).expect(201).then(idCheck).catch(done);

            debug("voted on stuff, does it get fed?")
            {
                // Is everything back?
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);
                const dummy7 = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const act = dummy7.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.comment_number).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(1);
                expect(com.content).toBe('Comment');
                debug("got fed")
                const RdelCom = await request(srv).delete('/activity/comment').set(authA)
                    .send({commentId: RidComA0}).expect(200).catch(done);
                debug("del com")
                // Are the votes and reply gone?
                const qUserFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);
                const dummy8 = await request(srv).get(`/activity/${qUserFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const qAct = dummy8.body;
                expect(qAct.user.firstName).toBe(userA.user.firstName)
                expect(qAct.comments).toHaveLength(0);
                expect(qAct.text).toBe('Content');
                expect(qAct.comment_number).toBe(0);
                expect(qAct.score).toBe(3);
                expect(qAct.ping).toBe(2);
                debug("del com good")
                const gCom = await request(srv).get(`/activity/comment/${com.id}`).set(authA).expect(404).catch(done);
                const gRep = await request(srv).get(`/activity/reply/${RreplyId}`).set(authA).expect(404).catch(done);
            }

            // Delete a comment

            // Re-comment
            comA0.activityId = RidActA;
            const RRidComA0 = await request(srv).post('/activity/comment').set(authA).send(comA0)
                .expect(201).then(idCheck).catch(done);
            debug("recom")

            // Re-reply
            const RRreplyId = await request(srv).post('/activity/reply').set(authA).send(
                {
                    reply: {
                        content: 'This is a reply',
                        commentId: RRidComA0,
                        activityId: RidActA,
                    },
                },
            ).expect(201).then(idCheck).catch(done);
            debug("rereply")
            // A comment vote
            const RRvoteComment = await request(srv).post('/activity/comment/vote').set(authA)
                .send({
                    vote: {
                        activityId: RidActA,
                        commentId: RRidComA0,
                        value: 1,
                    },
                }).expect(201).then(idCheck).catch(done);

            // A reply Vote
            const RRvoteReply = await request(srv).post('/activity/reply/vote').set(authA)
                .send({
                    vote: {
                        activityId: RidActA,
                        replyId: RRreplyId,
                        userId: idA,
                        value: 1,
                    },
                }).expect(201).then(idCheck).catch(done);
            debug("revoted")

            {
                // Is at all back?
                const userFeedA = await request(srv).get(`/user/feed/${idA}/0`).set(authA).expect(200).catch(done);
                const dummy9 = await request(srv).get(`/activity/${userFeedA.body[0].id}`).set(authA).expect(200).catch(done);
                const act = dummy9.body;
                expect(act.user.firstName).toBe(userA.user.firstName)
                expect(act.ping).toBe(6);
                expect(act.score).toBe(3);
                expect(act.comment_number).toBe(1);
                expect(act.text).toBe('Content');
                expect(act.comments).toHaveLength(1);
                const com = act.comments[0];
                expect(com.user.firstName).toBe(userA.user.firstName)
                expect(com.score).toBe(1);
                expect(com.content).toBe('Comment');

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
                        reactions: [],
                        votes: [],
                    },
                );
                // First, second user follows nothing and sees nothing
                let userBView = await request(srv).get(`/user/home/0`).set(authB).expect(200).catch(done);
                debug("got user b view")
                expect(userBView.body).toStrictEqual([]);
                // Second user follows cabildo and sees a populated home feed
                const BfollowC = await request(srv).post('/user/followcabildo').set(authB)
                    .send({cabildoId: idCab}).expect(201).catch(done);
                debug("b followed c")
                userBView = await request(srv).get(`/user/home/0`).set(authB).expect(200).catch(done);
                debug("got user b view again")
                expect(userBView.body).toStrictEqual([actualBView]);

                // Lets make sure cabildo feed works while we're here
                const cabName = cabA.cabildo.name;
                const cabList = await request(srv).get('/cabildo').set(authB).expect(200).catch(done);
                debug("got cab list")
                expect(cabList.body).toHaveLength(1);
                let cabProfile = await request(srv).get(`/cabildo/profile/${idCab}`).set(authB).expect(200).catch(done);
                debug("got cab profile")
                expect(cabProfile.body.name).toStrictEqual(cabName);

                {
                    // Check the default cabildo description
                    const cabDescA = cabA.cabildo.desc;
                    expect(cabProfile.body.desc).toStrictEqual(cabDescA);

                    debug("check cabildo description authentication")
                    const cabDescB = "this is the new cabildo description";
                    // Fake user try to update the cabildo description
                    await request(srv).put(`/cabildo/description/${idCab}`).set(authX).send({newDesc:cabDescB}).expect(401).catch(done);
                    // User A try to update the description in a fake cabildo
                    await request(srv).put(`/cabildo/description/${'9999'}`).set(authA).send({newDesc:cabDescB}).expect(404).catch(done);
                    // User B (not admin) try to update the cabildo description
                    await request(srv).put(`/cabildo/description/${idCab}`).set(authB).send({newDesc:cabDescB}).expect(403).catch(done);
                    // Check if cabildo description was not updated
                    cabProfile = await request(srv).get(`/cabildo/profile/${idCab}`).set(authB).expect(200).catch(done);
                    expect(cabProfile.body.desc).toStrictEqual(cabDescA);
                    debug("cabildo description authentication is good")

                    // User A (admin) update cabildo description
                    await request(srv).put(`/cabildo/description/${idCab}`).set(authA).send({newDesc:cabDescB}).expect(200).catch(done);
                    // Check if cabildo description was updated
                    cabProfile = await request(srv).get(`/cabildo/profile/${idCab}`).set(authB).expect(200).catch(done);
                    expect(cabProfile.body.desc).toStrictEqual(cabDescB);
                    debug("cabildo description properly updated by admin")

                    // Update cabildo description with an empty string
                    const cabDescC = "";
                    await request(srv).put(`/cabildo/description/${idCab}`).set(authA).send({newDesc:cabDescC}).expect(200).catch(done);
                    cabProfile = await request(srv).get(`/cabildo/profile/${idCab}`).set(authB).expect(200).catch(done);
                    expect(cabProfile.body.desc).toStrictEqual(cabDescC);
                    debug(cabProfile.body.desc);
                    debug("cabildo description accept empty strings as inputs")

                    // Update cabildo description to the default
                    await request(srv).put(`/cabildo/description/${idCab}`).set(authA).send({newDesc:cabDescA}).expect(200).catch(done);
                }

                const cabFeed = await request(srv).get(`/cabildo/feed/${idCab}/0`).set(authB).expect(200).catch(done);
                debug("got cab feed")
                expect(cabFeed.body[0]).toStrictEqual(actualBView);
                const cabCheck = await request(srv).get(`/cabildo/check/${cabName}`).set(authB)
                    .expect(200).expect(cabName).catch(done);
                debug("cab check one")
                const badCabCheck = await request(srv).get(`/cabildo/check/ICANNOTEXISTASDKJASLKFJGA`).set(authB)
                    .expect(200).expect(/Could not find/).catch(done);
                debug("cab check two")

                // Second user unfollows cabildo and sees nothin
                const BunFollowC = await request(srv).post('/user/unfollowcabildo').set(authB)
                    .send({cabildoId: idCab}).expect(201).catch(done);
                debug("b unfollow c")
                userBView = await request(srv).get(`/user/home/0`).set(authB).expect(200).catch(done);
                debug("another home feed")
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
                    .send({userId: idA}).expect(201).catch(done);
                debug("b followed a")
                userBView = await request(srv).get(`/user/home/0`).set(authB).expect(200).catch(done);
                debug("another home feed")
                expect(userBView.body[0]).toStrictEqual(unfollowedview);
                // Second user unfollows first user and sees nothing
                const BunFollowA = await request(srv).post('/user/unfollowuser').set(authB)
                    .send({userId: idA}).expect(201).catch(done);
                debug("b unfollowed a")
                userBView = await request(srv).get(`/user/home/0`).set(authB).expect(200).catch(done);
                debug("another home feed, end of block")
                expect(userBView.body).toStrictEqual([]);
            }

            // get activity public
            const activityPublic = await request(srv).get('/activity/public/0').set(authA).expect(200).catch(done);
            debug("got activityPublic")

            // Cabildo to be deleted
            const getCabB = await request(srv).post('/cabildo').set(authA).send(cabB).expect(201).catch(done);
            debug(getCabB.body)
            const idCabB = getCabB.body.id;
            debug("got the cabildo id")
            const deleteCabildoBad = await request(srv).delete('/cabildo/9999999').set(authA).expect(404).catch(done); // return 404 cabildo not found
            debug("bad uid")
            const deleteCabildoWrongUser = await request(srv).delete('/cabildo/' + idCabB).set(authB).expect(403).catch(done); // return unauthorized
            debug("wrong user")
            const deleteCabildoOkay = await request(srv).delete('/cabildo/' + idCabB).set(authA).expect(200).catch(done); // return ok, cabildo deleted
            debug("cabildo stuff done")

            // Search
            debug("get search history while empty")
            const getSearchRes1 = await request(srv).get('/search/0').set(authA).expect(204).catch(done);

            debug("valid activity search")
            const searchResA1 = await request(srv).post('/search/activities/0').set(authA).send(searchA).expect(201).catch(done);
            const searchResA2 = await request(srv).post('/search/users/0').set(authA).send(searchA).expect(204).catch(done);
            const searchResA3 = await request(srv).post('/search/cabildos/0').set(authA).send(searchA).expect(204).catch(done);

            debug("valid cabildo search")
            const searchResB1 = await request(srv).post('/search/activities/0').set(authA).send(searchB).expect(204).catch(done);
            const searchResB2 = await request(srv).post('/search/users/0').set(authA).send(searchB).expect(204).catch(done);
            const searchResB3 = await request(srv).post('/search/cabildos/0').set(authA).send(searchB).expect(201).catch(done);

            debug("search SQL injection");
            const badSearchResA1 = await request(srv).post('/search/activities/0').set(authA).send(badSearchA).expect(204).catch(done);
            const badSearchResA2 = await request(srv).post('/search/users/0').set(authA).send(badSearchA).expect(204).catch(done);
            const badSearchResC2 = await request(srv).post('/search/users/0').set(authA).send(badSearchC).expect(204).catch(done);
            const badSearchResD2 = await request(srv).post('/search/users/0').set(authA).send(badSearchD).expect(204).catch(done);
            const badSearchResA3 = await request(srv).post('/search/cabildos/0').set(authA).send(badSearchA).expect(204).catch(done);

            debug("empty searches");
            const badSearchResB1 = await request(srv).post('/search/activities/0').set(authA).send(badSearchB).expect(204).catch(done);
            const badSearchResB2 = await request(srv).post('/search/users/0').set(authA).send(badSearchB).expect(204).catch(done);
            const badSearchResB3 = await request(srv).post('/search/cabildos/0').set(authA).send(badSearchB).expect(204).catch(done);

            debug("valid user search");
            const searchResC1 = await request(srv).post('/search/activities/0').set(authA).send(searchC).expect(204).catch(done);
            const searchResC2 = await request(srv).post('/search/users/0').set(authA).send(searchC).expect(201).catch(done);
            const searchResC3 = await request(srv).post('/search/cabildos/0').set(authA).send(searchC).expect(204).catch(done);

            debug("request populated search history");
            const getSearchRes2 = await request(srv).get('/search/0').set(authA).expect(200).catch(done);

            debug("validate search return data");

            let actRes = searchResA1.body[0];
            let cabRes = searchResB3.body[0];
            let userRes = searchResC2.body[0];
            expect(actRes.title).toBe(actA.activity.title);
            expect(cabRes.name).toBe(cabA.cabildo.name);
            expect(userRes.firstName).toBe(userA.user.firstName);

            //NOTE: Searches that return an empty array seem to do it with a 404 response code as well.
            debug("done with search testing");

            debug("tag testing");
            // make extra activities for extra testing
            actB.activity['cabildoId'] = idCab;
            actC.activity['cabildoId'] = idCab;
            actD.activity['cabildoId'] = idCab;
            actE.activity['cabildoId'] = idCab;
            const resActB = await request(srv).post('/activity').set(authA).send(actB).expect(201).catch(done);
            const resActC = await request(srv).post('/activity').set(authA).send(actC).expect(201).catch(done);
            const resActD = await request(srv).post('/activity').set(authA).send(actD).expect(201).catch(done);
            const resActE = await request(srv).post('/activity').set(authA).send(actE).expect(201).catch(done);

            const getTagsB = await request(srv).get('/tag/wat').set(authA).expect(200).catch(done);
            expect(getTagsB.body.tags[0].label).toBe('water');

            const getTagsC = await request(srv).get('/tag/acti').set(authA).expect(200).catch(done);
            debug(getTagsC.body);
            expect(getTagsC.body.tags[0].label).toBe('actividad');

            const getTagsD = await request(srv).get('/tag/').set(authA).expect(404).catch(done);
            debug(getTagsD.body);

            const getTagsE = await request(srv).get('/tag/lugar').set(authA).expect(200).catch(done);
            debug(getTagsE.body);
            expect(getTagsE.body.tags[0].label).toBe('lugar');

            debug("tag search endpoint testing")
            const tagSearchResA = await request(srv).post('/search/tag/0').set(authA).send(tagSearchA).expect(201).catch(done);
            const tagSearchResB = await request(srv).post('/search/tag/0').set(authA).send(tagSearchB).expect(204).catch(done);
            const tagSearchResC = await request(srv).post('/search/tag/0').set(authA).send(badSearchA).expect(204).catch(done);
            const tagSearchResD = await request(srv).post('/search/tag/0').set(authA).send(badSearchB).expect(204).catch(done);
            const tagSearchResE = await request(srv).post('/search/tag/0').set(authA).send(badSearchC).expect(204).catch(done);
            const tagSearchResF = await request(srv).post('/search/tag/0').set(authA).send(badSearchD).expect(204).catch(done);
            debug(tagSearchResA.body);
            debug(tagSearchResB.body);
            debug(tagSearchResC.body);
            debug(tagSearchResD.body);
            debug(tagSearchResE.body);
            debug(tagSearchResF.body);

            // Goodbye!
            done();
        }
    });
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
  x    Put    /user/description
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
  x  Search:
  x    Post   /search/users
  x    Post   /search/activities
  x    Post   /search/cabildos
  x    Post   /search/tag
  x    Get    /search
  x  Tags:
  x    Get    /tag/:partial

*/
