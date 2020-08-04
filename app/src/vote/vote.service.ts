import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { ActivityVote, CommentVote, ReplyVote } from './vote.entity';

@Injectable()
export class ActivityVoteService {
    constructor(
        @InjectRepository(ActivityVote) private readonly repository: Repository<ActivityVote>,
    ) {
    }

    async exists(activityIdVote: number) {
        if (!activityIdVote || !await this.repository.count({id: activityIdVote}))
            throw new NotFoundException('Could not find activity vote');
    }

    async addVote(vote: ActivityVote) {
        if (await this.repository.count({userId: vote.userId, activityId: vote.activityId}))
            throw new UnprocessableEntityException();
        const result = await this.repository.save(vote);
        return result.id as number;
    }

    async getVote(activityIdVote: number) {
        return await this.repository.findOne(activityIdVote);
    }

    async updateVote(activityIdVote: number, value: number) {
        const vote = await this.repository.findOne(activityIdVote);
        const success = await this.repository.update(
            {id: activityIdVote},
            { value: value },
        );
        return vote;
    }

    async deleteVote(activityIdVote: number) {
        return await this.repository.delete(activityIdVote);
    }
}

@Injectable()
export class CommentVoteService {
    constructor(
        @InjectRepository(CommentVote) private readonly repository: Repository<CommentVote>,
    ) {
    }

    async exists(commentIdVote: number) {
        if (!commentIdVote || !await this.repository.count({id: commentIdVote}))
            throw new NotFoundException('Could not find comment vote');
    }

    async addVote(vote: CommentVote) {
        if (await this.repository.count({userId: vote.userId, commentId: vote.commentId}))
            throw new UnprocessableEntityException();
        const result = await this.repository.save(vote);
        return result.id as number;
    }

    async getVote(commentIdVote: number) {
        return await this.repository.findOne(commentIdVote);
    }

    async updateVote(commentIdVote: number, value: number) {
        const vote = await this.repository.findOne(commentIdVote);
        const success = await this.repository.update(
            {id: commentIdVote},
            { value: value },
        );
        return vote;
    }

    async deleteVote(commentIdVote: number) {
        return await this.repository.delete(commentIdVote);
    }
}

@Injectable()
export class ReplyVoteService {
    constructor(
        @InjectRepository(ReplyVote) private readonly repository: Repository<ReplyVote>,
    ) {
    }

    async exists(replyIdVote: number) {
        if (!replyIdVote || !await this.repository.count({id: replyIdVote}))
            throw new NotFoundException('Could not find reply vote');
    }

    async addVote(vote: ReplyVote) {
        if (await this.repository.count({userId: vote.userId, replyId: vote.replyId}))
            throw new UnprocessableEntityException();
        const result = await this.repository.save(vote);
        return result.id as number;
    }

    async getVote(replyIdVote: number) {
        return await this.repository.findOne(replyIdVote);
    }

    async updateVote(replyIdVote: number, value: number) {
        const vote = await this.repository.findOne(replyIdVote);
        const success = await this.repository.update(
            {id: replyIdVote},
            { value: value },
        );
        return vote;
    }

    async deleteVote(replyIdVote: number) {
        return await this.repository.delete(replyIdVote);
    }
}
