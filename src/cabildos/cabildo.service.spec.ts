import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CabildoSchema } from './cabildo.schema';
import { CabildoService } from './cabildo.service';

import * as mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('UsersService', () => {
    setupDB('cibic', true);
    let cabildoService: CabildoService;

    beforeEach(async () => {
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CabildoService,
                {
                    provide: getModelToken('Cabildo'),
                    useValue: cabildoModel,
                },
            ],
        }).compile();

        cabildoService = module.get<CabildoService>(CabildoService);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(cabildoService).toBeDefined();
        });
        it('should return empty set', () => {
            return cabildoService.getAllCabildos()
                .then(data => expect(data).toStrictEqual([]))
                .catch(err => console.log(err));
        });
    });
});
