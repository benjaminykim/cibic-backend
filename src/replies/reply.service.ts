import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Reply } from './reply.schema';

@Injectable()
export class ReplyService {
    constructor(
        @InjectModel('Reply') private readonly replyModel: Model<Reply>,
	) {}

    private async replyCallback(err: any, data: any) {
        if (err) {
            console.error(`Error with reply: ${err}`);
        } else {
//            console.log(`Success with reply: ${data}`);
        }
    }

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
            this.replyCallback
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
        const reply = await this.replyModel.findByIdAndDelete(idReply).exec(); //callback stuf here TODO SMONROE
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
