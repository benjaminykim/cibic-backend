import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    let user1 = {
        user: {
            id: "",
            username: "smonroe",
            email: "smonroe@gmail.fake",
            password: "arealpassword",
            firstName: "Steven",
            middleName: "Cristopher",
            lastName: "Monroe",
            maidenName: "Rose",
            phone: 9417261303,
            rut: "1234567891",
            cabildos: [],
            files: [],
            followers: [],
            following: [],
            activityFeed: [],
            activityVotes: [],
            commentVotes: [],
            citizenPoints: 100
        }
    };
    let user2 = {
        user: {
            id: "",
            username: "bekim",
            email: "bekim@gmail.fake",
            password: "anotherrealpassword",
            firstName: "Benjamin",
            middleName: "Y",
            lastName: "Kim",
            maidenName: "Boris",
            phone: 9412346543,
            rut: "1234567892",
            cabildos: [],
            files: [],
            followers: [],
            following: [],
            activityFeed: [],
            activityVotes: [],
            commentVotes: [],
            citizenPoints: 101
        }
    };
    let cabildo1 = {
        cabildo: {
            name: "OurBitchinCabildo",
            members: [],
            moderators: [],
            admin: null, // fill
            location: "42 SiliconValley",
            issues: [],
            meetings: [],
            files: [],
            activities: []
        }
    };
    let activity1 = {
        activity: {
            idUser: null, // fill
            idCabildo: null, // fill
            activityType: 'discussion',
            title: "My first activity",
            text: "Gee this is fun",
            comments: [],
            reactions: [],
            votes: []
        }
    };
    let comment1 = {
        comment: {
            idUser: null, // fill
            content: "I like your activity",
            reply: []
        },
        activity_id: null
    };
    it('End To End', async (done) => {
        const idCheck = res => {
            expect(res.body.id).toHaveLength(24);
            return res.body.id;
        };
        const server = app.getHttpServer();

        const emptyUsers = await request(server)
            .get('/users')
            .expect(200)
        expect(emptyUsers.body).toStrictEqual([]);

        const idA = await request(server)
            .post('/users').send(user1)
            .expect(201).then(idCheck);
        console.log(`idA: ${idA}`);

        const idB = await request(server)
            .post('/users').send(user2)
            .expect(201).then(idCheck);
        console.log(`idB: ${idB}`);

        const twoUsers = await request(server)
            .get('/users')
            .expect(200)
        expect(twoUsers.body).toHaveLength(2);

        const emptyCabildos = await request(server)
            .get('/cabildos')
            .expect(200)
        expect(emptyCabildos.body).toStrictEqual([]);

        cabildo1.cabildo.admin = idA;
        const idCab = await request(server)
            .post('/cabildos').send(cabildo1)
            .expect(201)
            .then(idCheck);
        console.log(`idCab: ${idCab}`);

        const oneCabildo = await request(server)
            .get('/cabildos')
            .expect(200)
        expect(oneCabildo.body).toHaveLength(1);

        const AfollowB = await request(server)
            .post('/users/followuser')
            .send({data:{follower: idA, followed: idB}})
            .expect(/now follows user/)
        console.log(`AfollowB`);

        const BfollowC = await request(server)
            .post('/users/followcabildo')
            .send({data:{follower: idB, followed: idCab}})
            .expect(/now follows cabildo/)
        console.log(`BfollowC`);

        activity1.activity = Object.assign(activity1.activity, {
            idUser: idB,
            idCabildo: idCab,
        });

        const idAct = await request(server)
            .post('/activity')
            .send(activity1)
            .expect(201)
            .then(idCheck);
        console.log(`idAct: ${idAct}`);

        comment1.comment.idUser = idA;
        comment1.activity_id = idAct;
        const idCom = await request(server)
            .post('/comment')
            .send(comment1)
            .expect(201)
            .then(idCheck)
        console.log(`idCom: ${idCom}`);

        const feedA = await request(server)
            .get(`/activity/feed/${idA}`)
            .expect(200);

        const feedB = await request(server)
            .get(`/activity/feed/${idB}`)
            .expect(200);

        expect(feedA.body.activityFeed).toStrictEqual(feedB.body.activityFeed)

        // We should move mock post data to a seperate file, its going to get large.

        // Positive Tests Needed:
        // add more acitivites
        // add more comments
        // add replies to acitivities
        // test for full population of nested object refs
        // add a user who's follwing scheme excludes them from an activity
        // update an activity and ensure difference

        // Negative Tests Needed:
        // add a conflicting user.email
        // add a conflicting cabildo.name
        // add an activity with bad fields
        // add a comment with bad fields
        // add a reply with bad fields

        done();
    });
});
