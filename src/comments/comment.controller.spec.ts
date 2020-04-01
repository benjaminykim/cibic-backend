import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
const  { setupDB } = require('../../test/setupdb');
import mongoose = require('mongoose');
import { NotFoundException } from '@nestjs/common';

import { CommentSchema, Comment } from './comment.schema';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

import { ActivitySchema, Activity } from '../activities/activity.schema';
import { ActivityService } from '../activities/activity.service';

import { CabildoSchema, Cabildo } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';

import { UsersSchema, Users } from '../users/users.schema';
import { UsersService } from '../users/users.service';

describe('CommentController', () => {
    setupDB('cibic', true);
    let controller: CommentController;
    let mockComment: Comment = {
        idUser: mongoose.Types.ObjectId("123456789012345678901234"),
        publishDate: Date.now(),
        content: "I made my first activity!",
        score: 42,
        reply: [],
    };

    beforeEach(async () => {
        let commentModel = mongoose.model('Comment', CommentSchema);
        let activityModel = mongoose.model('Activity', ActivitySchema);
        let usersModel = mongoose.model('Users', UsersSchema);
        let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [
                ActivityService,
                CommentService,
                UsersService,
                CabildoService,
                {
                    provide: getModelToken('Comment'),
                    useValue: commentModel,
                },
                {
                    provide: getModelToken('Activity'),
                    useValue: activityModel,
                },
                {
                    provide: getModelToken('Users'),
                    useValue: usersModel,
                },
                {
                    provide: getModelToken('Cabildo'),
                    useValue: cabildoModel,
                }

            ],
        }).compile();

        controller = module.get<CommentController>(CommentController);
    });

    describe('root', () => {
        let genId;
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        it('should get empty set', () => {
            return controller.getAllComments().then(data => expect(data).toStrictEqual([]));
        });
        it('shouldn`t find an invalid idComment', () => {
            return controller.getCommentById("4c6d7a6a5").catch(err => expect(err).toBeInstanceOf(NotFoundException));
        })
        it('shouldn`t find a nonexistant comment', () => {
            return controller.getCommentById("4c6d7a6a5d65aa7acdb65bef").catch(err => expect(err).toBeInstanceOf(NotFoundException));
        })
    });
});
