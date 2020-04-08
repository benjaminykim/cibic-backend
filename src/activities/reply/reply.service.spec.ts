import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ReplySchema } from './reply.schema';
import { ReplyService } from './reply.service';

import mongoose from 'mongoose';
const  { setupDB } = require('../../../test/setupdb');

describe('ReplyService', () => {
    setupDB('cibic', true);
    let service: ReplyService;

    beforeEach(async () => {
        let replyModel = mongoose.model('Reply', ReplySchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReplyService,
                {
                    provide: getModelToken('Reply'),
                    useValue: replyModel,
                },
            ],
        }).compile();

        service = module.get<ReplyService>(ReplyService);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });
    });
});
