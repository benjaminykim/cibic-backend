import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private readonly repository: Repository<Comment>,
    ) {}

    async insertComment(comment: Comment) {
        const result = await this.repository.save(comment);
        return result.id as number;
    }

    async updateComment(commentId: number, content: string) {
        return await this.repository.update(
            {id: commentId},
            { content: content },
        );
    }

    async reply(commentId: number, replyId: number) {
        return await this.repository
            .createQueryBuilder()
            .relation(Comment, 'replies')
            .of(commentId)
            .add(replyId);
    }

    async deleteReply(commentId: number, replyId: number) {
        return await this.repository
            .createQueryBuilder()
            .relation(Comment, 'replies')
            .of(commentId)
            .remove(replyId);
    }

    async getCommentById(commentId: number, userId?: number) {
        let comment;
        try {
            if (userId) {
                comment = await this.repository
                    .createQueryBuilder()
                    .select("comment")
                    .from(Comment, "comment")
                    .where("comment.id = :commentId", {commentId: commentId})
                    .leftJoinAndSelect("comment.user", "user")
                    .leftJoinAndSelect("comment.replies", "replies")
                    .leftJoinAndSelect("replies.user", "ruser")
                    .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("comment.votes", "votes", "votes.userId = :userId", {userId: userId})
                    .getOne()
            }
            else {
                comment = await this.repository
                    .createQueryBuilder()
                    .select("comment")
                    .from(Comment, "comment")
                    .where("comment.id = :commentId", {commentId: commentId})
                    .leftJoinAndSelect("comment.replies", "replies")
                    .leftJoinAndSelect("replies.votes", "rvotes")
                    .leftJoinAndSelect("comment.votes", "votes")
                    .getOne()
            }
        } catch (error) {
            throw new NotFoundException('Could not find comment.');
        }
        if (!comment) {
            throw new NotFoundException('Could not find comment.');
        }
        return comment;
    }

    async deleteComment(commentId: number) {
        return await this.repository.delete(commentId);
    }

    async exists(commentId: number) {
        let it = await this.repository.count({id: commentId});
        if (!it)
            throw new NotFoundException('Could not find comment');
    }

    // Vote Flow
    async addVote(
        commentId: number,
        voteId: number,
        value: number,
    ) {
        await this.repository.increment({id: commentId}, 'score', value);
        await this.repository
            .createQueryBuilder()
            .relation(Comment, 'votes')
            .of(commentId)
            .add(voteId);
        return true;
    }

    async updateVote(
        commentId: number,
        voteId: number,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.repository.increment({id: commentId}, 'score', diff);
    }

    async deleteVote(
        commentId: number,
        voteId: number,
        oldValue: number,
    ) {
        await this.repository.decrement({id: commentId}, 'score', oldValue);
        return true;
    }
}
