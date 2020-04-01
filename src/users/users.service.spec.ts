import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';

import { UsersSchema } from './users.schema';
import { CabildoSchema } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';

import * as mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('UsersService', () => {
    setupDB('cibic', true);
    let userService: UsersService;

    beforeEach(async () => {
        let userModel = mongoose.model('Users', UsersSchema);
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                CabildoService,
                {
                    provide: getModelToken('Users'),
                    useValue: userModel,
                },
                {
                    provide: getModelToken('Cabildo'),
                    useValue: cabildoModel,
                },
            ],
        }).compile();

        userService = module.get<UsersService>(UsersService);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(userService).toBeDefined();
        });
        it('should return empty set', () => {
            return userService.getUsers()
                .then(data => expect(data).toStrictEqual([]))
                .catch(err => console.log(err));
        });
    });
});
