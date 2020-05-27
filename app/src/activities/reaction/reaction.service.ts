import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';

@Injectable()
export class ReactionService {
    constructor(
        @InjectRepository(Reaction) private readonly repository: Repository<Reaction>,
    ) {
    }

    async exists(reactionId: number) {
        if (!reactionId || !await this.repository.count({id: reactionId}))
            throw new NotFoundException('Could not find reaction');
    }

    async addReaction(reaction: Reaction) {
        const result = await this.repository.save(reaction);
        return result.id as number;
    }

    async getReaction(reactionId: number) {
        const tmp = await this.repository.findOne(reactionId);
        return tmp;
    }

    async updateReaction(reactionId: number, value: number) {
        const oldReact = await this.repository.findOne(reactionId);
        const success = await this.repository.update(
            {id: reactionId},
            { value: value },
        );
        return oldReact;
    }

    async deleteReaction(reactionId: number) {
        return await this.repository.delete(reactionId);
    }
 }
