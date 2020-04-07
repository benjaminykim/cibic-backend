import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
    UseGuards,
    Headers,
    UnprocessableEntityException,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from '../users/users.service';
import { Reaction } from './reaction/reaction.schema';
import { ReactionService } from './reaction/reaction.service';
import { ActivityService } from './activity.service';
import { Activity } from './activity.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { idFromToken } from '../constants';

@UseGuards(JwtAuthGuard)
@Controller('activity') // http://localhost:3000/activity
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
        private readonly reactionService: ReactionService,
        private readonly usersService: UserService,
        private readonly cabildoService: CabildoService,
    ) {}

    @Post()
    async addActivity(@Body('activity') activity: Activity) {
        await this.usersService.exists(activity.idUser.toString());
        if (activity.idCabildo) {
            if (!(await this.cabildoService.exists(activity.idCabildo.toString()))) {
                throw new UnprocessableEntityException();
            }
        }
        const idActivity = await this.activityService.insertActivity(activity);
        const user = await this.usersService.pushToFeed(activity.idUser.toString(), idActivity);
        user.followers.forEach(async idFollower => await this.usersService.pushToFollow(idFollower, idActivity));
        if (activity.idCabildo) {
            const cabildo = await this.cabildoService.pushToFeed(activity.idCabildo.toString(), idActivity);
            cabildo.members.forEach(async idUser => await this.usersService.pushToFollow(idUser, idActivity));
        }
        return { id: idActivity };
    }

    @Get('feed/public')
    async getPublicFeed(
        @Headers() h: any,
    ) {
        let idUser = idFromToken(h.authorization);
        const activities = await this.activityService.getPublicFeed(idUser);
        return activities;
    }

    @Get(':id')
    async getActivityById(
        @Headers() h: any,
        @Param('id') idActivity: string,
    ) {
        return await this.activityService.getActivityById(idFromToken(h.authorization), idActivity);
    }

    @Post()
    async updateActivity(
        @Body('activityid') idActivity: string,
        @Body('activity') activity: Activity) {
        return await this.activityService.updateActivity(idActivity, activity);
    }

    @Delete(':id')
    async deleteActivity(@Param('id') idActivity: string) {
        await this.activityService.deleteActivity(idActivity);
        return null;
    }

    // Reaction Flow

    @Post('react')
    async addReaction(
        @Body('idActivity') idActivity: string,
        @Body('reaction') reaction: Reaction,
    ) {
        await this.activityService.exists(idActivity);
        const idReaction = await this.reactionService.addReaction(reaction);
        await this.activityService.addReaction(idActivity, idReaction, reaction.value);
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
        @Body('idReaction') idReaction: string,
        @Body('idActivity') idActivity: string,
    ) {
        await this.reactionService.exists(idReaction);
        await this.activityService.exists(idActivity);
        const oldReaction = await this.reactionService.deleteReaction(idReaction);
        await this.activityService.deleteReaction(idActivity, idReaction, oldReaction);
    }
}
