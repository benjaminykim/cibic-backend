import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment } from './comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment') private readonly commentModel: Model<Comment>,
	) {}

    private async commentCallback(err: any, data: any) {
        if (err) {
            console.error(`Error with comment: ${err}`);
        } else {
//            console.log(`Success with comment: ${data}`);
        }
    }

    async insertComment(comment: Comment) {
        const newComment = new this.commentModel(comment);
        const result = await newComment.save();
        return result.id as string;
    }

    async updateComment(commentId: string, comment: Comment) {
        const result = await this.commentModel.findByIdAndUpdate(
            commentId,
            comment,
            this.commentCallback
        );
        return result;
    }

    async getComments() { // list all comments
        const comments = await this.commentModel.find().exec();
        return comments;
    }

    async getCommentById(idComment: string) {
        const comment = await this.findComment(idComment);
        return comment;
    }

    async deleteComment(idComment: string) {
        const comment = await this.commentModel.findByIdAndDelete(idComment).exec(); //callback stuf here TODO SMONROE
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
