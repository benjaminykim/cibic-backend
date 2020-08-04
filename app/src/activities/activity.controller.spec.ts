import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ActivityController } from './activity.controller';
import { ActivitySchema } from './activity.schema';
import { ActivityService } from './activity.service';

import { UserService } from '../users/users.service';
import { UserSchema, User } from '../users/users.schema';

import { CabildoSchema } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';

import { CommentService } from './comment/comment.service';
import { CommentSchema } from './comment/comment.schema';

import { ReplyService } from './reply/reply.service';
import { ReplySchema } from './reply/reply.schema';

import { ReactionSchema } from './reaction/reaction.schema';
import { ReactionService } from './reaction/reaction.service';

import { VoteSchema } from '../vote/vote.schema';
import { VoteService } from '../vote/vote.service';

import mongoose from 'mongoose';
const  { setupDB } = require('../../test/setupdb');

describe('ActivityController', () => {
    setupDB('test', true);
    let controller: ActivityController;

    beforeEach(async () => {
        const activityModel = mongoose.model('Activity', ActivitySchema);
        const userModel = mongoose.model('User', UserSchema);
        const cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const commentModel = mongoose.model('Comment', CommentSchema);
        const replyModel = mongoose.model('Reply', ReplySchema);
        const reactionModel = mongoose.model('Reaction', ReactionSchema);
        const voteModel = mongoose.model('Vote', VoteSchema);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActivityController],
            providers: [
                ActivityService,
                UserService,
                CabildoService,
                CommentService,
                ReplyService,
                ReactionService,
                VoteService,
                {
                    provide: getModelToken('Activity'),
                    useValue: activityModel,
                },
                {
                    provide: getModelToken('User'),
                    useValue: userModel,
                },
                {
                    provide: getModelToken('Cabildo'),
                    useValue: cabildoModel,
                },
                {
                    provide: getModelToken('Comment'),
                    useValue: commentModel,
                },
                {
                    provide: getModelToken('Reply'),
                    useValue: replyModel,
                },
                {
                    provide: getModelToken('Reaction'),
                    useValue: reactionModel,
                },
                {
                    provide: getModelToken('Vote'),
                    useValue: voteModel,
                },
            ],
        }).compile();

        controller = module.get<ActivityController>(ActivityController);
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        // it('should return empty set', () => {
        //     return controller.getPublicFeed()
        //         .then(data => expect(data).toStrictEqual([]))
        //         .catch(err => console.log(err));
        // });
    });
});
