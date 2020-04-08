import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { validateId } from '../utils';
import { VoteSchema, Vote } from './vote.schema';

@Injectable()
export class VoteService {
    constructor(
        @InjectModel('Vote') private readonly voteModel: mongoose.Model<Vote>,
    ) {
    }

    async exists(idVote: string) {
        await validateId(idVote);
        return await this.voteModel.exists({_id: idVote});
    }

    async addVote(vote: Vote) {
        const newVote = new this.voteModel(vote);
        const result = await newVote.save();
        return result.id as string;
    }

    async getVote(idVote: string) {
        return await this.voteModel.findById(idVote);
    }

    async updateVote(idVote: string, value: number) {
        const oldValue = await this.voteModel.findById(idVote);
        const success = await this.voteModel.findByIdAndUpdate(
            idVote,
            { value: value },
        );
        return oldValue.value as number;
    }

    async deleteVote(idVote: string) {
        return await this.voteModel.findByIdAndDelete(idVote);
    }
 }
