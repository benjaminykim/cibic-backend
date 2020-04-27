import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { replyPop } from '../../constants';
import { validateId } from '../../utils';
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

    async updateReply(idReply: string, content: string) {
        const result = await this.replyModel.findByIdAndUpdate(
            idReply,
            { content: content},
        );
        return result;
    }

    async getReplyById(idReply: string, idUser: string) {
        let reply;
        try {
            reply = await this.replyModel
                .findById(idReply)
                .populate(replyPop(idUser));
        } catch (error) {
            throw new NotFoundException('Could not find reply.');
        }
        if (!reply) {
            throw new NotFoundException('Could not find reply.');
        }
        return reply;
    }

    async deleteReply(idReply: string) {
        const reply = await this.replyModel.findByIdAndDelete(idReply);
        if (reply === null) {
            throw new NotFoundException('Could not find reply.');
        }
        return reply;
    }

    async exists(idReply: string | object) {
        await validateId(idReply as string);
        let it = await this.replyModel.exists({_id: idReply});
        if (!it)
            throw new NotFoundException('Could not find reply');
    }

    // Vote Flow
    async addVote(
        idReply: string,
        idVote: string,
        value: number,
    ) {
        return await this.replyModel.findByIdAndUpdate(
            idReply,
            {
                $inc: {
                    score: value,
                },
                $addToSet: { votes: idVote },
            },
        );
    }

    async updateVote(
        idReply: string,
        idVote: string,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.replyModel.findByIdAndUpdate(
            idReply,
            {
                $inc: { score: diff }
            },
        );
    }

    async deleteVote(
        idReply: string,
        idVote: string,
        oldValue: number,
    ) {
        return await this.replyModel.findByIdAndUpdate(
            idReply,
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
