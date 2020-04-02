import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

import * as mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('UsersService', () => {
    setupDB('cibic', true);
    let service: CommentService;

    beforeEach(async () => {
        let commentModel = mongoose.model('Comment', CommentSchema);
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: getModelToken('Comment'),
                    useValue: commentModel,
                },
            ],
        }).compile();

        service = module.get<CommentService>(CommentService);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });
        it('should return empty set', () => {
            return service.getAllComments()
                .then(data => expect(data).toStrictEqual([]))
                .catch(err => console.log(err));
        });
    });
});
