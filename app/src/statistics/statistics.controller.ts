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

import { Activity } from './activity.entity';
import { Comment } from './comment/comment.entity';
import { Reply } from './reply/reply.entity';
import { Reaction } from './reaction/reaction.entity';
import { CommentVote, ReplyVote, ActivityVote } from '../vote/vote.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../users/users.decorator';

@UseGuards(JwtAuthGuard)
@Controller('statistics') // http://localhost:3000/statistics
export class StatisticsController {
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

    @Post()
    async addActivity(
        @UserId() userId: number,
        @Body('activity') activity: Activity,
    ) {
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
    
    @Post() // http://localhost:3000/user
    @ApiBody({type: User})
    async addUser(@Body('user') user: User) {
        const generatedId = await this.userService.insertUser(user);
        return {id: generatedId};
    }

    @Post() // http://localhost:3000/cabildo
    async addCabildo(
        @UserId() userId: number,
        @Body('cabildo') cabildo: Cabildo,
    ) {
        cabildo.adminId = userId;
        const generatedId = await this.cabildoService.insertCabildo(cabildo);
        return { id: generatedId };
    }
}