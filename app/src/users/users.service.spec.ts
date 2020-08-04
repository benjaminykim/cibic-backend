import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './users.service';

import { UserSchema } from './users.schema';
import { CabildoSchema } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';

import mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('UserService', () => {
    setupDB('test', true);
    let userService: UserService;

    beforeEach(async () => {
        let userModel = mongoose.model('User', UserSchema);
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
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

        userService = module.get<UserService>(UserService);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(userService).toBeDefined();
        });
    });
});
