import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { replyPop } from '../../constants';
import { Reply } from './reply.entity';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(Reply) private readonly repository: Repository<Reply>,
	) {}

    async insertReply(reply: Reply) {
        const newReply = await this.repository.create(reply);
        const result = await this.repository.save(newReply);
        const replyId = result.id;
        return replyId as number;
    }

    async updateReply(replyId: number, content: string) {
        const result = await this.repository.update(
            {id: replyId},
            {content: content},
        );
        return result;
    }

    async getReplyById(replyId: number, userId?: number) {
        let reply;
        try {
            if (userId) {
                reply = await this.repository
                    .createQueryBuilder()
                    .select("reply")
                    .from(Reply, "reply")
                    .where("reply.id = :replyId", { replyId: replyId})
                    .leftJoinAndSelect("reply.votes", "votes", "votes.userId = :userId", {userId: userId})
                    .getOne()
            }
            else {
                reply = await this.repository
                    .createQueryBuilder()
                    .select("reply")
                    .from(Reply, "reply")
                    .where("reply.id = :replyId", { replyId: replyId})
                    .leftJoinAndSelect("reply.votes", "votes")
                    .getOne()
            }
        } catch (error) {
            throw new NotFoundException('Could not find reply.');
        }
        if (!reply) {
            throw new NotFoundException('Could not find reply.');
        }
        return reply;
    }

    async deleteReply(replyId: number) {
        const reply = await this.repository.delete(replyId);
        return reply;
    }

    async exists(replyId: number) {
        let it = await this.repository.count({id: replyId});
        if (!it)
            throw new NotFoundException('Could not find reply');
    }

    // Vote Flow
    async addVote(
        replyId: number,
        voteId: number,
        value: number,
    ) {
        await this.repository.increment({id: replyId}, 'score', value);
        await this.repository
            .createQueryBuilder()
            .relation(Reply, 'votes')
            .of(replyId)
            .add(voteId);
        return true;
    }

    async updateVote(
        replyId: number,
        voteId: number,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.repository.increment({id: replyId}, 'score', diff);
    }

    async deleteVote(
        replyId: number,
        voteId: number,
        oldValue: number,
    ) {
        await this.repository.decrement({id: replyId}, 'score', oldValue);
        return true;
    }
}
