import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { VoteSchema, Vote } from './vote.schema'
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');


describe('VoteService', () => {
    setupDB('test', true);
    let service: VoteService;

    beforeEach(async () => {
        let voteModel = mongoose.model('Vote', VoteSchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VoteService,
                {
                    provide: getModelToken('Vote'),
                    useValue: voteModel,
                },
            ],
        }).compile();

        service = module.get<VoteService>(VoteService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
