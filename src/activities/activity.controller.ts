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
    UnprocessableEntityException,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UserService } from '../users/users.service';
import { ActivityService } from './activity.service';
import { Activity } from './activity.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('activity') // http://localhost:3000/activity
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
        private readonly usersService: UserService,
        private readonly cabildoService: CabildoService,
    ) {}

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Get('feed/public')
    async getPublicFeed() {
        const activities = await this.activityService.getPublicFeed();
//        console.error(activities);
        return activities;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getActivityById(@Param('id') activityId: string) {
        return await this.activityService.getActivityById(activityId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async updateActivity(
        @Body('activityid') activityId: string,
        @Body('activity') activity: Activity) {
        return await this.activityService.updateActivity(activityId, activity);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteActivity(@Param('id') activityId: string) {
        await this.activityService.deleteActivity(activityId);
        return null;
    }
}
