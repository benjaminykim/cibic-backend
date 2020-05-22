import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';

@Injectable()
export class ReactionService {
    constructor(
        @InjectRepository(Reaction) private readonly repository: Repository<Reaction>,
    ) {
    }

    async exists(idReaction: number) {
        return await this.repository.count({id: idReaction});
    }

    async addReaction(reaction: Reaction) {
        const result = await this.repository.save(reaction);
        return result.id as number;
    }

    async getReaction(idReaction: number) {
        return await this.repository.findOne(idReaction);
    }

    async updateReaction(idReaction: number, value: number) {
        const oldValue = await this.repository.findOne(idReaction);
        const success = await this.repository.update(
            {id: idReaction},
            { value: value },
        );
        return oldValue.value as number;
    }

    async deleteReaction(idReaction: number) {
        return await this.repository.delete(idReaction);
    }
 }
