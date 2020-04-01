import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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
        // promise callback on document creation
        const idCheck = res => {
            expect(res.body.id).toHaveLength(24);
            return res.body.id;
        };

        // less typing on request() calls
        const srv = app.getHttpServer();

        // get an empty user list
        const emptyUsers = await request(srv).get('/users').expect(200)
        expect(emptyUsers.body).toStrictEqual([]);

        // make a user
        const idA = await request(srv).post('/users').send(userA).expect(201).then(idCheck);
        console.log(`idA: ${idA}`);

        // make a user
        const idB = await request(srv).post('/users').send(userB).expect(201).then(idCheck);
        console.log(`idB: ${idB}`);

        // get both users back
        const twoUsers = await request(srv).get('/users').expect(200)
        expect(twoUsers.body).toHaveLength(2);

        // git an empty cabildo list
        const emptyCabildos = await request(srv).get('/cabildos').expect(200)
        expect(emptyCabildos.body).toStrictEqual([]);

        // make a cabildo
        cabA.cabildo.admin = idA;
        const idCab = await request(srv).post('/cabildos').send(cabA).expect(201).then(idCheck);
        console.log(`idCab: ${idCab}`);

        // get a cabildo back
        const oneCabildo = await request(srv).get('/cabildos').expect(200)
        expect(oneCabildo.body).toHaveLength(1);

        // first user follows second user
        const AfollowB = await request(srv).post('/users/followuser')
            .send({data:{follower: idA, followed: idB}}).expect(/now follows user/)
        console.log(`AfollowB`);

        // first user follows a cabildo
        const AfollowC = await request(srv).post('/users/followcabildo')
            .send({data:{follower: idA, followed: idCab}}).expect(/now follows cabildo/)
        console.log(`AfollowC`);

        // second user follows a cabildo
        const BfollowC = await request(srv).post('/users/followcabildo')
            .send({data:{follower: idB, followed: idCab}}).expect(/now follows cabildo/)
        console.log(`BfollowC`);

        // prepare activities with user and cabildo ids
        actA.activity.idUser = idB;
        actB.activity.idUser = idB;
        actC.activity.idUser = idA;
        actD.activity.idUser = idA;
        actE.activity.idUser = idA;
        actA.activity.idCabildo =
            actB.activity.idCabildo =
            actC.activity.idCabildo =
            actD.activity.idCabildo =
            actE.activity.idCabildo =
            idCab;
        console.log("prepared activities");

        // post activites
        const idActA = await request(srv).post('/activity').send(actA)
            .expect(201).then(idCheck).catch(err => done(err));
        const idActB = await request(srv).post('/activity').send(actB)
            .expect(201).then(idCheck).catch(err => done(err));
        const idActC = await request(srv).post('/activity').send(actC)
            .expect(201).then(idCheck).catch(err => done(err));
        const idActD = await request(srv).post('/activity').send(actD)
            .expect(201).then(idCheck).catch(err => done(err));
        const idActE = await request(srv).post('/activity').send(actE)
            .expect(201).then(idCheck).catch(err => done(err));
        console.log("posted activities");

        // prapare comments with user and activity ids
        comA0.comment.idUser = idA;
        comA1.comment.idUser = idB;
        comA2.comment.idUser = idA;
        comB0.comment.idUser = idB;
        comB1.comment.idUser = idA;
        comB2.comment.idUser = idB;
        comC0.comment.idUser = idA;
        comC1.comment.idUser = idB;
        comC2.comment.idUser = idA;
        comD0.comment.idUser = idB;
        comD1.comment.idUser = idA;
        comD2.comment.idUser = idB;
        comE0.comment.idUser = idA;
        comE1.comment.idUser = idB;
        comE2.comment.idUser = idA;
        comA0.activity_id = comA1.activity_id = comA2.activity_id = idActA;
        comB0.activity_id = comB1.activity_id = comB2.activity_id = idActB;
        comC0.activity_id = comC1.activity_id = comC2.activity_id = idActC;
        comD0.activity_id = comD1.activity_id = comD2.activity_id = idActD;
        comE0.activity_id = comE1.activity_id = comE2.activity_id = idActE;
        console.log("prepared comments");

        // post comments
        const idComA0 = await request(srv).post('/comment').send(comA0)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComA1 = await request(srv).post('/comment').send(comA1)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComA2 = await request(srv).post('/comment').send(comA2)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComB0 = await request(srv).post('/comment').send(comB0)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComB1 = await request(srv).post('/comment').send(comB1)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComB2 = await request(srv).post('/comment').send(comB2)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComC0 = await request(srv).post('/comment').send(comC0)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComC1 = await request(srv).post('/comment').send(comC1)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComC2 = await request(srv).post('/comment').send(comC2)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComD0 = await request(srv).post('/comment').send(comD0)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComD1 = await request(srv).post('/comment').send(comD1)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComD2 = await request(srv).post('/comment').send(comD2)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComE0 = await request(srv).post('/comment').send(comE0)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComE1 = await request(srv).post('/comment').send(comE1)
            .expect(201).then(idCheck).catch(err => done(err));
        const idComE2 = await request(srv).post('/comment').send(comE2)
            .expect(201).then(idCheck).catch(err => done(err));
        console.log("posted comments");

        // post 100 replies
        for (let i = 0; i < 100; i++) {
            await request(srv).post('/reply').send(
                {
                    reply: {
                        idUser: idA,
                        content: `This is reply ${i}`,
                        score: i,
                    },
                    comment: idComE2
                }
            ).expect(201).then(idCheck).catch(err => done(err));
        }

        // get activity feed for first user
        const feedA = await request(srv).get(`/users/feed/${idA}`).expect(200);

        // get activity feed for second user
        const feedB = await request(srv).get(`/users/feed/${idB}`).expect(200);

        // both are the same currently
        expect(feedA.body.activityFeed).toStrictEqual(feedB.body.activityFeed)

        // make a new user
        const idC = await request(srv).post('/users').send(userC).expect(201).then(idCheck);
        console.log(`idC: ${idC}`);

        // get a blank activity feed
        const feedC = await request(srv).get(`/users/feed/${idC}`).expect(200)
        expect(feedC.body.activityFeed).toStrictEqual([]);

        // third user follows a cabildo
        const CfollowC = await request(srv).post('/users/followcabildo')
            .send({data:{follower: idC, followed: idCab}}).expect(/now follows cabildo/)
        console.log(`CfollowC`);

        // get a populated activity feed
        const feedC2 = await request(srv).get(`/users/feed/${idC}`).expect(200)

        // Need to add activityFeed update when a user follows a cabildo or another user
        // to include the activities from that entity
        //expect(feedC2.body.activityFeed).toStrictEqual(feedB.body.activityFeed)

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

        done();
    });
});
