import {
    UseGuards,
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Headers,
    UnprocessableEntityException,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from '../users/users.service';
import { ActivityService } from './activity.service';
import { CommentService } from './comment/comment.service';
import { ReplyService } from './reply/reply.service';
import { ReactionService } from './reaction/reaction.service';
import { ActivityVoteService, CommentVoteService, ReplyVoteService } from '../vote/vote.service';

import { Activity } from './activity.entity';
import { Comment } from './comment/comment.entity';
import { Reply } from './reply/reply.entity';
import { Reaction } from './reaction/reaction.entity';
import { CommentVote, ReplyVote, ActivityVote } from '../vote/vote.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { idFromToken } from '../utils';

@UseGuards(JwtAuthGuard)
@Controller('activity') // http://localhost:3000/activity
export class ActivityController {
    constructor(
        private readonly cabildoService: CabildoService,
        private readonly usersService: UserService,
        private readonly activityService: ActivityService,
        private readonly commentService: CommentService,
        private readonly replyService: ReplyService,
        private readonly reactionService: ReactionService,
        private readonly activityVoteService: ActivityVoteService,
        private readonly commentVoteService: CommentVoteService,
        private readonly replyVoteService: ReplyVoteService,
    ) {}

    // Activity Flow

    @Post()
    async addActivity(
        @Headers() header: any,
        @Body('activity') activity: Activity,
    ) {
        const userId = idFromToken(header.authorization);
        await this.usersService.exists(userId);
        if (activity.cabildoId) {
            await this.cabildoService.exists(activity.cabildoId);
        }
        activity.userId = userId;
        const activityId = await this.activityService.insertActivity(activity);
        const user = await this.usersService.pushToFeed(activity.userId, activityId);
        if (activity.cabildoId) {
            const cabildo = await this.cabildoService.pushToFeed(activity.cabildoId, activityId);
        }
        await this.usersService.addPoints(userId, 3);
        return { id: activityId };
    }

    @Get('public')
    async getPublicFeed(
        @Headers() h: any,
    ) {
        const userId = idFromToken(h.authorization);
        const activities = await this.activityService.getPublicFeed(userId);
        return activities;
    }

    @Get(':activityId')
    async getActivityById(
        @Headers() h: any,
        @Param('activityId') activityId: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !activityId) {
            throw new UnprocessableEntityException();
        }
        await this.activityService.exists(activityId);
        return await this.activityService.getActivityById(userId, activityId);
    }

    @Put()
    async updateActivity(
        @Body('activityId') activityId: number,
        @Body('content') content: string) {
        if (!activityId || !content) {
            throw new UnprocessableEntityException();
        }
        return await this.activityService.updateActivity(activityId, content);
    }

    @Delete()
    async deleteActivity(
        @Headers() header: any,
        @Body('activityId') activityId: number,
    ) {
        const userId = idFromToken(header.authorization);
        if (!activityId || !userId) {
            throw new UnprocessableEntityException();
        }
        const activity = await this.activityService.getActivityById(activityId);
        activity.commentsIds.forEach(
            async commentId => {
                await this.activityService.deleteComment(commentId, activityId);
                const comment = await this.commentService.getCommentById(commentId);
                comment.repliesIds.forEach(async replyId => {
                    const reply = await this.replyService.getReplyById(replyId);
                    reply.votesIds.forEach(async voteId => this.replyVoteService.deleteVote(voteId));
                    await this.replyService.deleteReply(replyId);
                });
                comment.votesIds.forEach(async voteId => await this.commentVoteService.deleteVote(voteId));
                await this.commentService.deleteComment(commentId);
            },
        );
        activity.reactionsIds.forEach(async idReact => await this.reactionService.deleteReaction(idReact));
        activity.votesIds.forEach(async voteId => await this.activityVoteService.deleteVote(voteId));
        await this.activityService.deleteActivity(activityId);
        return null;
    }

    // Activity Vote Flow

    @Post('vote')
    async addVote(
        @Headers() header: any,
        @Body('vote') vote: ActivityVote,
    ) {
        const userId = idFromToken(header.authorization);
        await this.activityService.exists(vote.activityId);
        const voteId = await this.activityVoteService.addVote(vote);
        await this.activityService.addVote(vote.activityId, voteId, vote.value);
        await this.usersService.addPoints(userId, 1);
        return {id: voteId as number};
    }

    @Put('vote')
    async updateVote(
        @Body('activityId') activityId: number,
        @Body('voteId') voteId: number,
        @Body('value') newValue: number,
    ) {
        await this.activityVoteService.exists(voteId);
        await this.activityService.exists(activityId);
        const oldValue = await this.activityVoteService.updateVote(voteId, newValue);
        await this.activityService.updateVote(activityId, voteId, oldValue, newValue);
    }

    @Delete('vote')
    async deleteVote(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('voteId') voteId: number,
    ) {
        const userId = idFromToken(header.authorization);
        await this.activityVoteService.exists(voteId);
        await this.activityService.exists(activityId);
        const oldVote = await this.activityVoteService.getVote(voteId);
        await this.activityService.deleteVote(activityId, voteId, oldVote.value);
        await this.activityVoteService.deleteVote(voteId);
        await this.usersService.addPoints(userId, -1);
    }

    // Comment Flow

    @Post('comment')
    async addComment(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('comment') comment: Comment,
    ) {
        const userId = idFromToken(header.authorization);
        const commentId = await this.commentService.insertComment(comment);
        await this.activityService.commentActivity(commentId, activityId);
        await this.usersService.addPoints(userId, 2);
        return { id: commentId };
    }

    @Get('comment/:commentId')
    async getCommentById(
        @Headers() header: any,
        @Param('commentId') commentId: number,
    ) {
        const userId = idFromToken(header.authorization);
        return await this.commentService.getCommentById(commentId, userId);
    }

    @Put('comment')
    async updateComment(
        @Body('commentId') commentId: number,
        @Body('content') content: string,
    ) {
        return await this.commentService.updateComment(commentId, content);
    }

    @Delete('comment')
    async deleteComment(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
    ) {
        const userId = idFromToken(header.authorization);
        if (!commentId || !activityId || !userId) {
            throw new UnprocessableEntityException();
        }
        await this.activityService.deleteComment(commentId, activityId);
        const comment = await this.commentService.getCommentById(commentId);
        await comment.replies.forEach(async reply => {
            await reply.votes.forEach(async vote => {
                await this.replyVoteService.deleteVote(vote.id);
            });
            await this.activityService.incPing(activityId, -(reply.votes.length + 1));
            await this.replyService.deleteReply(reply.id);
        });
        await comment.votes.forEach(async vote => {
            await this.commentVoteService.deleteVote(vote.id);
        });
        await this.activityService.incPing(activityId, -(comment.votes.length));
        await this.commentService.deleteComment(commentId);
        await this.usersService.addPoints(userId, -2);
        return null;
    }

    // Comment Vote Flow

    @Post('comment/vote')
    async addCommentVote(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('vote') vote: CommentVote,
    ) {
        const userId = idFromToken(header.authorization);
        await this.commentService.exists(vote.commentId);
        const voteId = await this.commentVoteService.addVote(vote);
        await this.commentService.addVote(vote.commentId, voteId, vote.value);
        await this.activityService.incPing(activityId, 1);
        await this.usersService.addPoints(userId, 1);
        return {id: voteId as number};
    }

    @Put('comment/vote')
    async updateCommentVote(
        @Body('commentId') commentId: number,
        @Body('voteId') voteId: number,
        @Body('value') newValue: number,
    ) {
        await this.commentVoteService.exists(voteId);
        await this.commentService.exists(commentId);
        const oldValue = await this.commentVoteService.updateVote(voteId, newValue);
        await this.commentService.updateVote(commentId, voteId, oldValue, newValue);
    }

    @Delete('comment/vote')
    async deleteCommentVote(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
        @Body('voteId') voteId: number,
    ) {
        const userId = idFromToken(header.authorization);
        await this.commentVoteService.exists(voteId);
        await this.commentService.exists(commentId);
        const oldVote = await this.commentVoteService.getVote(voteId);
        await this.commentService.deleteVote(commentId, voteId, oldVote.value);
        await this.commentVoteService.deleteVote(voteId);
        await this.usersService.addPoints(userId, -1);
        await this.activityService.incPing(activityId, -1);
    }

    // Reply Flow

    @Post('reply')
    async addReply(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
        @Body('reply') reply: Reply,
    ) {
        const userId = idFromToken(header.authorization);
        if (!reply || !commentId || !activityId || !userId) {
            throw new UnprocessableEntityException();
        }
        await this.commentService.exists(commentId);
        reply.userId = userId;
        const replyId = await this.replyService.insertReply(reply);
        const comment = await this.commentService.reply(commentId, replyId);
        await this.usersService.addPoints(userId, 2);
        await this.activityService.incPing(activityId, 1);
        return { id: replyId };
    }

    @Get('reply/:replyId')
    async getReplyById(
        @Headers() header: any,
        @Param('replyId') replyId: number,
    ) {
        const userId = idFromToken(header.authorization);
        return await this.replyService.getReplyById(replyId, userId);
    }

    @Put('reply')
    async updateReply(
        @Body('replyId') replyId: number,
        @Body('content') content: string) {
        return await this.replyService.updateReply(replyId, content);
    }

    @Delete('reply')
    async deleteReply(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
        @Body('replyId') replyId: number,
    ) {
        const userId = idFromToken(header.authorization);
        const reply = await this.replyService.getReplyById(replyId);
        reply.votes.forEach(async voteId => {
            await this.replyVoteService.deleteVote(voteId);
            await this.activityService.incPing(activityId, -1);
        });
        await this.commentService.deleteReply(commentId, replyId);
        await this.replyService.deleteReply(replyId);
        await this.usersService.addPoints(userId, -2);
        await this.activityService.incPing(activityId, -1);
        return null;
    }

    // Reply Vote Flow

    @Post('reply/vote')
    async addReplyVote(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('vote') vote: ReplyVote,
    ) {
        const userId = idFromToken(header.authorization);
        await this.replyService.exists(vote.replyId);
        const voteId = await this.replyVoteService.addVote(vote);
        await this.replyService.addVote(vote.replyId, voteId, vote.value);
        await this.activityService.incPing(activityId, 1);
        await this.usersService.addPoints(userId, 1);
        return {id: voteId as number};
    }

    @Put('reply/vote')
    async updateReplyVote(
        @Body('replyId') replyId: number,
        @Body('voteId') voteId: number,
        @Body('value') newValue: number,
    ) {
        await this.replyVoteService.exists(voteId);
        await this.replyService.exists(replyId);
        const oldValue = await this.replyVoteService.updateVote(voteId, newValue);
        await this.replyService.updateVote(replyId, voteId, oldValue, newValue);
    }

    @Delete('reply/vote')
    async deleteReplyVote(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('replyId') replyId: number,
        @Body('voteId') voteId: number,
    ) {
        const userId = idFromToken(header.authorization);
        await this.replyVoteService.exists(voteId);
        await this.replyService.exists(replyId);
        const oldVote = await this.replyVoteService.getVote(voteId);
        await this.replyService.deleteVote(replyId, voteId, oldVote.value);
        await this.replyVoteService.deleteVote(voteId);
        await this.usersService.addPoints(userId, -1);
        await this.activityService.incPing(activityId, -1);
    }

    // Reaction Flow

    @Post('react')
    async addReaction(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('reaction') reaction: Reaction,
    ) {
        const userId = idFromToken(header.authorization);
        await this.activityService.exists(activityId);
        const idReaction = await this.reactionService.addReaction(reaction);
        await this.activityService.addReaction(activityId, idReaction, reaction.value);
        await this.usersService.addPoints(userId, 1);
        return {id: idReaction as number};
    }

    @Put('react')
    async updateReaction(
        @Body('activityId') activityId: number,
        @Body('idReaction') idReaction: number,
        @Body('value') newValue: number,
    ) {
        await this.reactionService.exists(idReaction);
        await this.activityService.exists(activityId);
        const oldValue = await this.reactionService.updateReaction(idReaction, newValue);
        await this.activityService.updateReaction(activityId, idReaction, oldValue, newValue);
    }

    @Delete('react')
    async deleteReaction(
        @Headers() header: any,
        @Body('activityId') activityId: number,
        @Body('idReaction') idReaction: number,
    ) {
        const userId = idFromToken(header.authorization);
        await this.reactionService.exists(idReaction);
        await this.activityService.exists(activityId);
        const oldReaction = await this.reactionService.getReaction(idReaction);
        await this.activityService.deleteReaction(activityId, idReaction, oldReaction.value);
        await this.reactionService.deleteReaction(idReaction);
        await this.usersService.addPoints(userId, -1);
    }

    // Save Activity Flow

    @UseGuards(JwtAuthGuard)
    @Post('saveactivity') // http://localhost:3000/activity/saveactivity
    async saveActivity(
        @Headers() h: any,
        @Body('activityId') activityId: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !activityId) {
            // Throw http exception here TODO
            throw new UnprocessableEntityException();
        }
        await this.usersService.exists(userId);
        await this.activityService.exists(activityId);
        const saver = await this.activityService.saveActivity(userId, activityId);
        // const saved = await this.activityService.addUser(activityId, userId);
        if (saver/* && saved*/) {
            return `user ${userId} now saves activity ${activityId}`;
        }
        throw new UnprocessableEntityException();
    }

    @UseGuards(JwtAuthGuard)
    @Post('unsaveactivity') // http://localhost:3000/activity/unsaveactivity
    async unsaveActivity(
        @Headers() h: any,
        @Body('activityId') activityId: number,
    ) {
        const userId = idFromToken(h.authorization);
        if (!userId || !activityId) {
            // Throw http exception here TODO
            throw new UnprocessableEntityException();
        }
        await this.usersService.exists(userId);
        await this.activityService.exists(activityId);
        const saver = await this.activityService.unsaveActivity(userId, activityId);
        // const saved = await this.activityService.removeUser(activityId, userId);
        if (saver/* && saved*/) {
            return `user no longer saves activity`;
        }
        throw new UnprocessableEntityException();
    }
}
