import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Reply } from './reply.schema';

@Injectable()
export class ReplyService {
    constructor(
        @InjectModel('Reply') private readonly replyModel: mongoose.Model<Reply>,
	) {}

    async insertReply(reply: Reply) {
        const newReply = new this.replyModel(reply);
        const result = await newReply.save();
        const idReply = result.id;
        return idReply as string;
    }

    async updateReply(idReply: string, reply: Reply) {
        const result = await this.replyModel.findByIdAndUpdate(
            idReply,
            reply,
        );
        return result;
    }

    async getAllReplies() { // list all replies
        const replies = await this.replyModel.find().exec();
        return replies;
    }

    async getReplyById(idReply: string) {
        const reply = await this.findReply(idReply);
        return reply;
    }

    async deleteReply(idReply: string) {
        const reply = await this.replyModel.findByIdAndDelete(idReply).exec();
        if (reply.n === 0) {
            throw new NotFoundException('Could not find reply.');
        }
    }

    private async findReply(idReply: string) {
        let reply;
        try {
            reply = await this.replyModel.findById(idReply).exec();
        } catch (error) {
            throw new NotFoundException('Could not find reply.');
        }
        if (!reply) {
            throw new NotFoundException('Could not find reply.');
        }
        return reply;
    }
}
