import { Test, TestingModule } from '@nestjs/testing';
import { ReactionService } from './reaction.service';
import { ReactionSchema, Reaction } from './reaction.schema'
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
const  { setupDB } = require('../../../test/setupdb');


describe('ReactionService', () => {
    setupDB('cibic', true);
    let service: ReactionService;

    beforeEach(async () => {
        let reactionModel = mongoose.model('Reaction', ReactionSchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReactionService,
                {
                    provide: getModelToken('Reaction'),
                    useValue: reactionModel,
                },
            ],
        }).compile();

        service = module.get<ReactionService>(ReactionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
