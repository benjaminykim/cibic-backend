import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
    UnprocessableEntityException,
} from '@nestjs/common';

import { CabildoService } from '../cabildos/cabildo.service';
import { UsersService } from '../users/users.service';
import { ActivityService } from './activity.service';
import { Activity } from './activity.schema';

@Controller('activity') // http://localhost:3000/activity
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService,
        private readonly usersService: UsersService,
        private readonly cabildoService: CabildoService,
    ) {}

    @Post()
    async addActivity(@Body('activity') activity: Activity) {
        if (!(await this.usersService.exists(activity.idUser.toString()))) {
            throw new UnprocessableEntityException();
        }
        if (activity.idCabildo) {
            if (!(await this.cabildoService.exists(activity.idCabildo.toString()))) {
                throw new UnprocessableEntityException();
            }
        }
        const idActivity = await this.activityService.insertActivity(activity);
        await this.usersService.pushToFeedAndFollowers(activity.idUser.toString(), idActivity);
        if (activity.idCabildo) {
            const cabildo = await this.cabildoService.pushToFeed(activity.idCabildo.toString(), idActivity);
            cabildo.members.forEach(async idUser => {
                await this.usersService.pushToFeed(idUser, idActivity)
            });
        }
        return { id: idActivity };
    }

    @Get()
    async getAllActivities() {
        const activities = await this.activityService.getAllActivities();
        return activities;
    }

    @Get(':id')
    async getActivityById(@Param('id') activityId: string) {
        return await this.activityService.getActivityById(activityId);
    }

    @Post()
    async updateActivity(
        @Body('activityid') activityId: string,
        @Body('activity') activity: Activity) {
        return await this.activityService.updateActivity(activityId, activity);
    }

    @Delete(':id')
    async deleteActivity(@Param('id') activityId: string) {
        await this.activityService.deleteActivity(activityId);
        return null;
    }
}
