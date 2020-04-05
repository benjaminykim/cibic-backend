import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose = require('mongoose');
import { NotFoundException } from '@nestjs/common';
const  { setupDB } = require('../../test/setupdb');

import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { ReplySchema, Reply } from './reply.schema';

import { CommentSchema } from '../comments/comment.schema';
import { CommentService } from '../comments/comment.service';

describe('ReplyController', () => {
    setupDB('cibic', true);
    let controller: ReplyController;

    beforeEach(async () => {
        let replyModel = mongoose.model('Reply', ReplySchema);
        let commentModel = mongoose.model('Comment', CommentSchema);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReplyController],
            providers: [
                ReplyService,
                CommentService,
                {
                    provide: getModelToken('Reply'),
                    useValue: replyModel,
                },
                {
                    provide: getModelToken('Comment'),
                    useValue: commentModel,
                },
            ],
        }).compile();

        controller = module.get<ReplyController>(ReplyController);
    });

    describe('root', () => {
        let genId;
        it('should be defined', () => {
            expect(controller).toBeDefined();
        });
        it('should get empty set', () => {
            return controller.getAllReplies().then(data => expect(data).toStrictEqual([]));
        });
        it('shouldn`t find an invalid idReply', () => {
            return controller.getReplyById("4c6d7a6a5")
                .catch(err => expect(err).toBeInstanceOf(NotFoundException));
        })
        it('shouldn`t find a nonexistant reply', () => {
            return controller.getReplyById("4c6d7a6a5d65aa7acdb65bef")
                .catch(err => expect(err).toBeInstanceOf(NotFoundException));

        });
        // it('should create a reply, then find that reply', async (done) => {
        //     const data = await controller.addReply(mockReply);//.then(data => {
        //     expect(data.id).toHaveLength(24);
        //     const again = await controller.getReplyById(data.id);
        //     again._id = again._id.toString();
        //     expect(again).toMatchObject(Object.assign({},{_id:data.id,__v:0},mockReply));
        //     done();
        // });
    });
});
