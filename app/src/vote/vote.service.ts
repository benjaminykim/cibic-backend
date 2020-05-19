import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityVote, CommentVote, ReplyVote } from './vote.entity';

@Injectable()
export class ActivityVoteService {
    constructor(
        @InjectRepository(ActivityVote) private readonly repository: Repository<ActivityVote>,
    ) {
    }

    async exists(activityIdVote: number) {
        return await this.repository.count({id: activityIdVote});
    }

    async addVote(vote: ActivityVote) {
        const result = await this.repository.save(vote);
        return result.id as number;
    }

    async getVote(activityIdVote: number) {
        return await this.repository.findOne(activityIdVote);
    }

    async updateVote(activityIdVote: number, value: number) {
        const oldValue = await this.repository.findOne(activityIdVote);
        const success = await this.repository.update(
            {id: activityIdVote},
            { value: value },
        );
        return oldValue.value as number;
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
        return await this.repository.count({id: commentIdVote});
    }

    async addVote(vote: CommentVote) {
        const newCommentVote = await this.repository.create(vote);
        const result = await this.repository.save(newCommentVote);
        return result.id as number;
    }

    async getVote(commentIdVote: number) {
        return await this.repository.findOne(commentIdVote);
    }

    async updateVote(commentIdVote: number, value: number) {
        const oldValue = await this.repository.findOne(commentIdVote);
        const success = await this.repository.update(
            {id: commentIdVote},
            { value: value },
        );
        return oldValue.value as number;
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
        return await this.repository.count({id: replyIdVote});
    }

    async addVote(vote: ReplyVote) {
        const newReplyVote = await this.repository.create(vote);
        const result = await this.repository.save(newReplyVote);
        return result.id as number;
    }

    async getVote(replyIdVote: number) {
        return await this.repository.findOne(replyIdVote);
    }

    async updateVote(replyIdVote: number, value: number) {
        const oldValue = await this.repository.findOne(replyIdVote);
        const success = await this.repository.update(
            {id: replyIdVote},
            { value: value },
        );
        return oldValue.value as number;
    }

    async deleteVote(replyIdVote: number) {
        return await this.repository.delete(replyIdVote);
    }
}
