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
import { VoteService } from '../vote/vote.service';

import { Activity } from './activity.schema';
import { Comment } from './comment/comment.schema';
import { Reply } from './reply/reply.schema';
import { Reaction } from './reaction/reaction.schema';
import { Vote } from '../vote/vote.schema';

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
        private readonly voteService: VoteService,
    ) {}

    // Activity Flow

    @Post()
    async addActivity(
        @Headers() header: any,
        @Body('activity') activity: Activity,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.usersService.exists(idUser);
        if (activity.idCabildo) {
            await this.cabildoService.exists(activity.idCabildo.toString());
        }
        activity.idUser = idUser;
        const idActivity = await this.activityService.insertActivity(activity);
        const user = await this.usersService.pushToFeed(activity.idUser.toString(), idActivity);
        if (activity.idCabildo) {
            const cabildo = await this.cabildoService.pushToFeed(activity.idCabildo.toString(), idActivity);
        }
        await this.usersService.addPoints(idUser, 3);
        return { id: idActivity };
    }

    @Get('public')
    async getPublicFeed(
        @Headers() h: any,
    ) {
        let idUser = idFromToken(h.authorization);
        const activities = await this.activityService.getPublicFeed(idUser);
        return activities;
    }

    @Get(':idActivity')
    async getActivityById(
        @Headers() h: any,
        @Param('idActivity') idActivity: string,
    ) {
        const idUser = idFromToken(h.authorization);
        if (!idUser || !idActivity)
            throw new UnprocessableEntityException();
        await this.activityService.exists(idActivity);
        return await this.activityService.getActivityById(idUser, idActivity);
    }

    @Put()
    async updateActivity(
        @Body('idActivity') idActivity: string,
        @Body('content') content: string) {
        if (!idActivity || !content)
            throw new UnprocessableEntityException();
        return await this.activityService.updateActivity(idActivity, content);
    }

    @Delete()
    async deleteActivity(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
    ) {
        const idUser = idFromToken(header.authorization);
        if (!idActivity || !idUser)
            throw new UnprocessableEntityException();
        await this.activityService.deleteActivity(idActivity);
        return null;
    }

    // Activity Vote Flow

    @Post('vote')
    async addVote(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('vote') vote: Vote,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.activityService.exists(idActivity);
        const idVote = await this.voteService.addVote(vote);
        await this.activityService.addVote(idActivity, idVote, vote.value);
        await this.usersService.addPoints(idUser, 1);
        return {id: idVote as string};
    }

    @Put('vote')
    async updateVote(
        @Body('idVote') idVote: string,
        @Body('idActivity') idActivity: string,
        @Body('value') newValue: number,
    ) {
        await this.voteService.exists(idVote);
        await this.activityService.exists(idActivity);
        let oldValue = await this.voteService.updateVote(idVote, newValue);
        await this.activityService.updateVote(idActivity, idVote, oldValue, newValue);
    }

    @Delete('vote')
    async deleteVote(
        @Headers() header: any,
        @Body('idVote') idVote: string,
        @Body('idActivity') idActivity: string,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.voteService.exists(idVote);
        await this.activityService.exists(idActivity);
        const oldVote = await this.voteService.deleteVote(idVote);
        await this.activityService.deleteVote(idActivity, idVote, oldVote.value);
        await this.usersService.addPoints(idUser, -1);
    }

    // Comment Flow

    @Post('comment')
    async addComment(
        @Headers() header: any,
        @Body('comment') comment: Comment,
        @Body('idActivity') idActivity: string,
    ) {
        const idUser = idFromToken(header.authorization);
        const idComment = await this.commentService.insertComment(comment);
        await this.activityService.commentActivity(idComment, idActivity);
        await this.usersService.addPoints(idUser, 2);
        return { id: idComment };
    }

    @Get('comment/:idComment')
    async getCommentById(
        @Param('idComment') idComment: string,
    ) {
        return await this.commentService.getCommentById(idComment);
    }

    @Put('comment')
    async updateComment(
        @Body('idComment') idComment: string,
        @Body('content') content: string,
    ) {
        return await this.commentService.updateComment(idComment, content);
    }

    @Delete('comment')
    async deleteComment(
        @Headers() header: any,
        @Body('idComment') idComment: string,
        @Body('idActivity') idActivity: string,
    ) {
        const idUser = idFromToken(header.authorization);
        if (!idComment || !idActivity || !idUser)
            throw new UnprocessableEntityException();
        await this.commentService.deleteComment(idComment);
        await this.activityService.deleteComment(idComment, idActivity);
        await this.usersService.addPoints(idUser, -2);
        return null;
    }

    // Comment Vote Flow

    @Post('comment/vote')
    async addCommentVote(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('idComment') idComment: string,
        @Body('vote') vote: Vote,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.commentService.exists(idComment);
        const idVote = await this.voteService.addVote(vote);
        await this.commentService.addVote(idComment, idVote, vote.value);
        await this.activityService.incPing(idActivity, 1);
        await this.usersService.addPoints(idUser, 1);
        return {id: idVote as string};
    }

    @Put('comment/vote')
    async updateCommentVote(
        @Body('idVote') idVote: string,
        @Body('idComment') idComment: string,
        @Body('value') newValue: number,
    ) {
        await this.voteService.exists(idVote);
        await this.commentService.exists(idComment);
        let oldValue = await this.voteService.updateVote(idVote, newValue);
        await this.commentService.updateVote(idComment, idVote, oldValue, newValue);
    }

    @Delete('comment/vote')
    async deleteCommentVote(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('idComment') idComment: string,
        @Body('idVote') idVote: string,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.voteService.exists(idVote);
        await this.commentService.exists(idComment);
        const oldVote = await this.voteService.deleteVote(idVote);
        await this.commentService.deleteVote(idComment, idVote, oldVote.value);
        await this.usersService.addPoints(idUser, -1);
        await this.activityService.incPing(idActivity, -1);
    }

    // Reply Flow

    @Post('reply')
    async addReply(
        @Headers() header: any,
        @Body('reply') reply: Reply,
        @Body('idActivity') idActivity: string,
        @Body('idComment') idComment: string,
    ) {
        const idUser = idFromToken(header.authorization);
        if (!reply || !idComment || !idActivity || !idUser)
            throw new UnprocessableEntityException();
        await this.commentService.exists(idComment);
        reply.idUser = idUser;
        const idReply = await this.replyService.insertReply(reply);
        const comment = await this.commentService.reply(idComment, idReply);
        await this.usersService.addPoints(idUser, 2);
        await this.activityService.incPing(idActivity, 1);
        return { id: idReply };
    }

    @Get('reply/:idReply')
    async getReplyById(
        @Param('idReply') idReply: string,
    ) {
        return await this.replyService.getReplyById(idReply);
    }

    @Put('reply')
    async updateReply(
        @Body('idReply') idReply: string,
        @Body('content') content: string) {
        return await this.replyService.updateReply(idReply, content);
    }

    @Delete('reply')
    async deleteReply(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('idReply') idReply: string,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.replyService.deleteReply(idReply);
        await this.usersService.addPoints(idUser, -2);
        await this.activityService.incPing(idActivity, -1);
        return null;
    }

    // Reply Vote Flow

    @Post('reply/vote')
    async addReplyVote(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('idReply') idReply: string,
        @Body('vote') vote: Vote,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.replyService.exists(idReply);
        const idVote = await this.voteService.addVote(vote);
        await this.replyService.addVote(idReply, idVote, vote.value);
        await this.activityService.incPing(idActivity, 1);
        await this.usersService.addPoints(idUser, 1);
        return {id: idVote as string};
    }

    @Put('reply/vote')
    async updateReplyVote(
        @Body('idVote') idVote: string,
        @Body('idReply') idReply: string,
        @Body('value') newValue: number,
    ) {
        await this.voteService.exists(idVote);
        await this.replyService.exists(idReply);
        let oldValue = await this.voteService.updateVote(idVote, newValue);
        await this.replyService.updateVote(idReply, idVote, oldValue, newValue);
    }

    @Delete('reply/vote')
    async deleteReplyVote(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('idVote') idVote: string,
        @Body('idReply') idReply: string,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.voteService.exists(idVote);
        await this.replyService.exists(idReply);
        const oldVote = await this.voteService.deleteVote(idVote);
        await this.replyService.deleteVote(idReply, idVote, oldVote.value);
        await this.usersService.addPoints(idUser, -1);
        await this.activityService.incPing(idActivity, -1);
    }

    // Reaction Flow

    @Post('react')
    async addReaction(
        @Headers() header: any,
        @Body('idActivity') idActivity: string,
        @Body('reaction') reaction: Reaction,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.activityService.exists(idActivity);
        const idReaction = await this.reactionService.addReaction(reaction);
        await this.activityService.addReaction(idActivity, idReaction, reaction.value);
        await this.usersService.addPoints(idUser, 1);
        return {id: idReaction as string};
    }

    @Put('react')
    async updateReaction(
        @Body('idReaction') idReaction: string,
        @Body('idActivity') idActivity: string,
        @Body('value') newValue: number,
    ) {
        await this.reactionService.exists(idReaction);
        await this.activityService.exists(idActivity);
        let oldValue = await this.reactionService.updateReaction(idReaction, newValue);
        await this.activityService.updateReaction(idActivity, idReaction, oldValue, newValue);
    }

    @Delete('react')
    async deleteReaction(
        @Headers() header: any,
        @Body('idReaction') idReaction: string,
        @Body('idActivity') idActivity: string,
    ) {
        const idUser = idFromToken(header.authorization);
        await this.reactionService.exists(idReaction);
        await this.activityService.exists(idActivity);
        const oldReaction = await this.reactionService.deleteReaction(idReaction);
        await this.activityService.deleteReaction(idActivity, idReaction, oldReaction.value);
        await this.usersService.addPoints(idUser, -1);
    }
}
