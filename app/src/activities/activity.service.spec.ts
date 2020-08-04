import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ActivitySchema } from './activity.schema';
import { ActivityService } from './activity.service';

import mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('ActivityService', () => {
    setupDB('test', true);
    let service: ActivityService;

    beforeEach(async () => {
        let activityModel = mongoose.model('Activity', ActivitySchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ActivityService,
                {
                    provide: getModelToken('Activity'),
                    useValue: activityModel,
                },
            ],
        }).compile();

        service = module.get<ActivityService>(ActivityService);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });
        // it('should return empty set', () => {
        //     return service.getPublicFeed()
        //         .then(data => expect(data).toStrictEqual([]))
        //         .catch(err => console.log(err));
        // });
    });
});
