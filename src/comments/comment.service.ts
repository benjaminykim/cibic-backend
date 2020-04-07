import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Comment } from './comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment') private readonly commentModel: mongoose.Model<Comment>,
	) {}

    async insertComment(comment: Comment) {
        const newComment = new this.commentModel(comment);
        const result = await newComment.save();
        return result.id as string;
    }

    async updateComment(commentId: string, comment: Comment) {
        return await this.commentModel.findByIdAndUpdate(
            commentId,
            comment,
        );
    }

    async reply(idComment: string, idReply: string) {
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            { $push: { reply: idReply}}, // only called from insertReply, known to be unique
        );
    }

    async getAllComments() { // list all comments
        return await this.commentModel.find().exec();
    }

    async getCommentById(idComment: string) {
        return await this.findComment(idComment);
    }

    async deleteComment(idComment: string) {
        const comment = await this.commentModel.findByIdAndDelete(idComment).exec();
        if (comment.n === 0) {
            throw new NotFoundException('Could not find comment.');
        }
    }

    private async findComment(idComment: string) {
        let comment;
        try {
            comment = await this.commentModel.findById(idComment).exec();
        } catch (error) {
            throw new NotFoundException('Could not find comment.');
        }
        if (!comment) {
            throw new NotFoundException('Could not find comment.');
        }
        return comment;
    }
}
