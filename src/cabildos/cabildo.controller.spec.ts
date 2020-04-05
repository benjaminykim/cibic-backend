import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CabildoController } from './cabildo.controller';
import { CabildoSchema } from './cabildo.schema';
import { CabildoService } from './cabildo.service';

import * as mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('UsersService', () => {
    setupDB('cibic', true);
    let controller: CabildoController;

    beforeEach(async () => {
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CabildoController],
            providers: [
                CabildoService,
                {
                    provide: getModelToken('Cabildo'),
                    useValue: cabildoModel,
                },
            ],
        }).compile();

        controller = module.get<CabildoController>(CabildoController);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        it('should return empty set', () => {
            return controller.getAllCabildos()
                .then(data => expect(data).toStrictEqual([]))
                .catch(err => console.log(err));
        });
    });
});
