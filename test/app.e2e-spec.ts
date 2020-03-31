import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import {
    userA,userB,cabA,
    actA,comA0,comA1,comA2,
    actB,comB0,comB1,comB2,
    actC,comC0,comC1,comC2,
    actD,comD0,comD1,comD2,
    actE,comE0,comE1,comE2,
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
        const emptyUsers = await request(srv)
            .get('/users')
            .expect(200)
        expect(emptyUsers.body).toStrictEqual([]);

        // make a user
        const idA = await request(srv)
            .post('/users')
            .send(userA)
            .expect(201)
            .then(idCheck);
        console.log(`idA: ${idA}`);

        // make a user
        const idB = await request(srv)
            .post('/users')
            .send(userB)
            .expect(201)
            .then(idCheck);
        console.log(`idB: ${idB}`);

        // get both users back
        const twoUsers = await request(srv)
            .get('/users')
            .expect(200)
        expect(twoUsers.body).toHaveLength(2);

        // git an empty cabildo list
        const emptyCabildos = await request(srv)
            .get('/cabildos')
            .expect(200)
        expect(emptyCabildos.body).toStrictEqual([]);

        // make a cabildo
        cabA.cabildo.admin = idA;
        const idCab = await request(srv)
            .post('/cabildos')
            .send(cabA)
            .expect(201)
            .then(idCheck);
        console.log(`idCab: ${idCab}`);

        // get a cabildo back
        const oneCabildo = await request(srv)
            .get('/cabildos')
            .expect(200)
        expect(oneCabildo.body).toHaveLength(1);

        // first user follows second user
        const AfollowB = await request(srv)
            .post('/users/followuser')
            .send({data:{follower: idA, followed: idB}})
            .expect(/now follows user/)
        console.log(`AfollowB`);

        // first user follows a cabildo
        const AfollowC = await request(srv)
            .post('/users/followcabildo')
            .send({data:{follower: idA, followed: idCab}})
            .expect(/now follows cabildo/)
        console.log(`AfollowC`);

        // second user follows a cabildo
        const BfollowC = await request(srv)
            .post('/users/followcabildo')
            .send({data:{follower: idB, followed: idCab}})
            .expect(/now follows cabildo/)
        console.log(`BfollowC`);

        // second user posts activity to the cabildo
        actA.activity.idUser = idB;
        actA.activity.idCabildo = idCab;
        const idActA = await request(srv)
            .post('/activity')
            .send(actA)
            .expect(201)
            .then(idCheck);
        console.log(`idActA: ${idActA}`);

        // first user comments on activity
        comA0.comment.idUser = idA;
        comA0.activity_id = idActA;
        const idComA0 = await request(srv)
            .post('/comment')
            .send(comA0)
            .expect(201)
            .then(idCheck)
        console.log(`idComA0: ${idComA0}`);

        // get activity feed for first user
        const feedA = await request(srv)
            .get(`/activity/feed/${idA}`)
            .expect(200);

        // get activity feed for second user
        const feedB = await request(srv)
            .get(`/activity/feed/${idB}`)
            .expect(200);

        // both are the same currently
        expect(feedA.body.activityFeed).toStrictEqual(feedB.body.activityFeed)

        // Positive Tests Needed:

        // add more acitivites
        // add more comments
        // add replies to comments
        // test for full population of nested object refs
        // add a user who's follows exclude them from an activity
        // update an activity and ensure difference on everyones feed


        // Negative Tests Needed:
        // TBD: should all negative tests go in unit test?
        // If they only deal with a single module, yes.
        // If we have multi-module negative tests, they happen here.

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
