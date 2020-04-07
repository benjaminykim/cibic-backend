import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Callback, validateId } from '../../utils';
import { ReactionSchema, Reaction } from './reaction.schema';

@Injectable()
export class ReactionService {
    constructor(
        @InjectModel('Reaction') private readonly reactionModel: Model<Reaction>,
    ) {
    }

    async exists(idReaction: string) {
        await validateId(idReaction);
        return await this.reactionModel.exists({_id: idReaction});
    }

    async addReaction(reaction: Reaction) {
        const newReaction = new this.reactionModel(reaction);
        const result = await newReaction.save();
        return result.id as string;
    }

    async getReaction(idReaction: string) {
        return await this.reactionModel.findById(idReaction, Callback);
    }

    async updateReaction(idReaction: string, value: number) {
        const oldValue = await this.reactionModel.findById(idReaction, Callback)!;
        const success = await this.reactionModel.findByIdAndUpdate(
            idReaction,
            { value: value },
            Callback,
        );
        return oldValue.value as number;
    }

    async deleteReaction(idReaction: string) {
        return await this.reactionModel.findByIdAndDelete(idReaction, 'select value', Callback);
    }
 }
