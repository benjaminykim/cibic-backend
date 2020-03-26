import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    Put,
} from '@nestjs/common';

import { ActivityService } from './activity.service';
import { Activity } from './activity.schema';

@Controller('activity') // http://localhost:3000/activity
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Post()
    async addActivity(@Body() activity: Activity) {
        const generatedId = await this.activityService.insertActivity(activity);
        return { id: generatedId };
    }

    @Get()
    async getAllActivities() {
        const activities = await this.activityService.getActivity();
        return activities;
    }

    @Get(':id')
    async getActivityById(@Param('id') idActivity: string) {
        return await this.activityService.getActivityById(idActivity);
    }

    @Put(':update')
    async updateActivity(activityId: string, activity: Activity) {
        return await this.activityService.updateActivity(activityId, activity);
    }


    @Delete(':id')
    async deleteActivity(@Param('id') idActivity: string) {
        await this.activityService.deleteActivity(idActivity);
        return null;
    }
}
