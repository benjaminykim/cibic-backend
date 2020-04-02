import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ActivityController } from './activity.controller';
import { ActivitySchema } from './activity.schema';
import { ActivityService } from './activity.service';

import { UsersService } from '../users/users.service';
import { UsersSchema, Users } from '../users/users.schema';

import { CabildoSchema } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';

import * as mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('UsersService', () => {
    setupDB('cibic', true);
    let controller: ActivityController;

    beforeEach(async () => {
        let activityModel = mongoose.model('Activity', ActivitySchema);
        let userModel = mongoose.model('Users', UsersSchema);
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActivityController],
            providers: [
                ActivityService,
                UsersService,
                CabildoService,
                {
                    provide: getModelToken('Activity'),
                    useValue: activityModel,
                },
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

        controller = module.get<ActivityController>(ActivityController);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        it('should return empty set', () => {
            return controller.getAllActivities()
                .then(data => expect(data).toStrictEqual([]))
                .catch(err => console.log(err));
        });
    });
});
