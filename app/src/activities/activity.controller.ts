import {
    UseGuards,
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    UnprocessableEntityException,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from '../users/users.service';
import { ActivityService } from './activity.service';
import { CommentService } from './comment/comment.service';
import { ReplyService } from './reply/reply.service';
import { ReactionService } from './reaction/reaction.service';
import { ActivityVoteService, CommentVoteService, ReplyVoteService } from '../vote/vote.service';
import { TagService } from '../tag/tag.service';

import { Activity } from './activity.entity';
import { Comment } from './comment/comment.entity';
import { Reply } from './reply/reply.entity';
import { Reaction } from './reaction/reaction.entity';
import { CommentVote, ReplyVote, ActivityVote } from '../vote/vote.entity';
import { Tag } from '../tag/tag.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../users/users.decorator';

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
        private readonly tagService: TagService,
    ) {}

    // Activity Flow

    @Post()
    async addActivity(
        @UserId() userId: number,
        @Body('activity') activity: Activity,
        @Body('tags') tags: string[],
    ) {

        // apply tag ids to activity
        activity.tagIds = await this.tagService.matchTagArray(tags);
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

        // apply activity id to tags
        await this.tagService.registerActivity(activityId, activity.tagIds);

        // increment tag count
        await this.tagService.incrementTagCount(activity.tagIds);
        return { id: activityId };
    }

    @Get('public')
    async getPublicFeed(
        @UserId() userId: number,
    ) {
        return await this.activityService.getPublicFeed(userId);
    }

    @Get(':activityId')
    async getActivityById(
        @UserId() userId: number,
        @Param('activityId') activityId: number,
    ) {
        await this.activityService.exists(activityId);
        return await this.activityService.getActivityById(userId, activityId);
    }

    @Put()
    async updateActivity(
        @Body('activityId') activityId: number,
        @Body('content') content: string,
    ) {
        if (!activityId || !content) {
            throw new UnprocessableEntityException();
        }
        await this.activityService.exists(activityId);
        return await this.activityService.updateActivity(activityId, content);
    }

    @Delete()
    async deleteActivity(
        @UserId() userId: number,
        @Body('activityId') activityId: number,
    ) {
        await this.activityService.exists(activityId);
        const activity = await this.activityService.getActivityById(activityId);
        await this.tagService.decrementTagCount(activity.tagIds);
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
    }

    // Activity Vote Flow

    @Post('vote')
    async addVote(
        @UserId() userId: number,
        @Body('vote') vote: ActivityVote,
    ) {
        await this.activityService.exists(vote.activityId);
        vote.userId = userId;
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('voteId') voteId: number,
    ) {
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('comment') comment: Comment,
    ) {
        comment.userId = userId
        const commentId = await this.commentService.insertComment(comment);
        await this.activityService.commentActivity(commentId, activityId);
        await this.usersService.addPoints(userId, 2);
        return { id: commentId };
    }

    @Get('comment/:commentId')
    async getCommentById(
        @UserId() userId: number,
        @Param('commentId') commentId: number,
    ) {
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
    ) {
        await this.activityService.exists(activityId);
        await this.commentService.exists(commentId);
        await this.activityService.deleteComment(commentId, activityId);
        const comment = await this.commentService.getCommentById(commentId);
        await comment.replies.forEach(async reply => {
            await reply.votes.forEach(async vote => {
                await this.replyVoteService.deleteVote(vote.id);
            });
            await this.replyService.deleteReply(reply.id);
            await this.activityService.incPing(activityId, -(reply.votes.length))
        });
        await comment.votes.forEach(async vote => {
            await this.commentVoteService.deleteVote(vote.id);
        });
        await this.commentService.deleteComment(comment.id);
        await this.activityService.incPing(activityId, -(comment.votes.length + comment.replies.length))
        await this.usersService.addPoints(userId, -2);
        return null;
    }

    // Comment Vote Flow

    @Post('comment/vote')
    async addCommentVote(
        @UserId() userId: number,
        @Body('vote') vote: CommentVote,
    ) {
        await this.commentService.exists(vote.commentId);
        vote.userId = userId;
        const voteId = await this.commentVoteService.addVote(vote);
        await this.commentService.addVote(vote.commentId, voteId, vote.value);
        await this.activityService.incPing(vote.activityId, 1);
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
        @Body('voteId') voteId: number,
    ) {
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
        @Body('reply') reply: Reply,
    ) {
        await this.activityService.exists(activityId);
        await this.commentService.exists(commentId);
        if (reply.taggedUserId){
            await this.usersService.exists(reply.taggedUserId);
        }
        reply.userId = userId;
        const replyId = await this.replyService.insertReply(reply);
        const comment = await this.commentService.reply(commentId, replyId);
        await this.usersService.addPoints(userId, 2);
        await this.activityService.incPing(activityId, 1);
        return { id: replyId };
    }

    @Get('reply/:replyId')
    async getReplyById(
        @UserId() userId: number,
        @Param('replyId') replyId: number,
    ) {
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('commentId') commentId: number,
        @Body('replyId') replyId: number,
    ) {
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
        @UserId() userId: number,
        @Body('vote') vote: ReplyVote,
    ) {
        await this.replyService.exists(vote.replyId);
        vote.userId = userId;
        const voteId = await this.replyVoteService.addVote(vote);
        await this.replyService.addVote(vote.replyId, voteId, vote.value);
        await this.activityService.incPing(vote.activityId, 1);
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('replyId') replyId: number,
        @Body('voteId') voteId: number,
    ) {
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('reaction') reaction: Reaction,
    ) {
        await this.activityService.exists(activityId);
        reaction.userId = userId;
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
        @UserId() userId: number,
        @Body('activityId') activityId: number,
        @Body('idReaction') idReaction: number,
    ) {
        await this.reactionService.exists(idReaction);
        await this.activityService.exists(activityId);
        const oldReaction = await this.reactionService.getReaction(idReaction);
        await this.activityService.deleteReaction(activityId, idReaction, oldReaction.value);
        await this.reactionService.deleteReaction(idReaction);
        await this.usersService.addPoints(userId, -1);
    }

    // Save Activity Flow

    @Post('save') // http://localhost:3000/activity/save
    async saveActivity(
        @UserId() userId: number,
        @Body('activityId') activityId: number,
    ) {
        await this.activityService.exists(activityId);
        await this.activityService.saveActivity(userId, activityId);
    }

    @Get('save/feed') // http://localhost:3000/activity/save/feed
    async getActSaved(
        @UserId() userId: number,
    ) {
        return await this.activityService.getActivitySaved(userId);
    }

    @Post('unsave') // http://localhost:3000/activity/unsave
    async unsaveActivity(
        @UserId() userId: number,
        @Body('activityId') activityId: number,
    ) {
        await this.activityService.exists(activityId);
        await this.activityService.unsaveActivity(userId, activityId);
    }
}
