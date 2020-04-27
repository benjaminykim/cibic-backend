import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { commentPop } from '../../constants';
import { validateId } from '../../utils';
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

    async updateComment(idComment: string, content: string) {
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            { content: content },
        );
    }

    async reply(idComment: string, idReply: string) {
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            { $push: { reply: idReply}}, // only called from insertReply, known to be unique
        );
    }

    async deleteReply(idComment: string, idReply: string) {
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            { $pull: { reply: idReply}},
        );
    }

    async getCommentById(idComment: string, idUser: string) {
        let comment;
        try {
            comment = await this.commentModel
                .findById(idComment)
                .populate(commentPop(idUser, 10))
                .exec();
        } catch (error) {
            throw new NotFoundException('Could not find comment.');
        }
        if (!comment) {
            throw new NotFoundException('Could not find comment.');
        }
        return comment;
    }

    async deleteComment(idComment: string) {
        const comment = await this.commentModel.findByIdAndDelete(idComment).exec();
        if (comment === null) {
            throw new NotFoundException('Could not find comment.');
        }
        return comment;
    }

    async exists(idComment: string | object) {
        await validateId(idComment as string);
        let it = await this.commentModel.exists({_id: idComment});
        if (!it)
            throw new NotFoundException('Could not find comment');
    }

    // Vote Flow
    async addVote(
        idComment: string,
        idVote: string,
        value: number,
    ) {
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            {
                $inc: {
                    score: value,
                },
                $addToSet: { votes: idVote },
            },
        );
    }

    async updateVote(
        idComment: string,
        idVote: string,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            {
                $inc: { score: diff }
            },
        );
    }

    async deleteVote(
        idComment: string,
        idVote: string,
        oldValue: number,
    ) {
        return await this.commentModel.findByIdAndUpdate(
            idComment,
            {
                $inc: {
                    score: -oldValue,
                },
                $pull: {
                    votes: idVote,
                },
            },
        );
    }
}
