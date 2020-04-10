import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';
const  { setupDB } = require('../../test/setupdb');

import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserSchema, User } from './users.schema';

import { CabildoSchema } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';

describe('UserController', () => {
    setupDB('test', true);
    let controller: UserController;
    let mockUser: User = {
        username: "smonroe",
        email: "smonroe@gmail.fake",
        password: "arealpassword",
        firstName: "Steven",
        middleName: "Cristopher",
        lastName: "Monroe",
        maidenName: "Rose",
        phone: 9417261303,
        rut: "1234567891",
        desc: "looky here!",
        cabildos: [],
        files: [],
        followers: [],
        following: [],
        activityFeed: [],
        followFeed: [],
        activityVotes: [],
        commentVotes: [],
        citizenPoints: 100,
    };

    beforeEach(async () => {
        let userModel = mongoose.model('User', UserSchema);
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                CabildoService,
                {
                    provide: getModelToken('User'),
                    useValue: userModel,
                },
                {
                    provide: getModelToken('Cabildo'),
                    useValue: cabildoModel,
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    describe('root', () => {
        let genId;
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        it('shouldn`t find an invalid idUser', () => {
            return controller.getUserProfile("4c6d7a6a5")
                .catch(err => expect(err).toBeInstanceOf(NotFoundException));
        })
        it('shouldn`t find a nonexistant user', () => {
            return controller.getUserProfile("4c6d7a6a5d65aa7acdb65bef")
                .catch(err => expect(err).toBeInstanceOf(NotFoundException));

        });
        it('should create a user, then find that user', async (done) => {
            const data = await controller.addUser(mockUser);
            expect(data.id).toHaveLength(24);
            const again = await controller.getUserProfile(data.id);
            again._id = again._id.toString();
            expect(again).toMatchObject(Object.assign({},{_id:data.id,__v:0},mockUser));
            done();
        });
    });
});
