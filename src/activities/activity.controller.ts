import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import { ActivityService } from './activity.service';

@Controller('activity') // http://localhost:3000/activity
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @Post()
    async addActivity(
        @Body('createdBy') createdBy: string,
        @Body('cabildo') cabildo: string,
        @Body('activityType') activityType: string,
        @Body('score') score: number,
        @Body('pingNumber') pingNumber: number,
        @Body('commentNumber') commentNumber: number,
        @Body('createdAt') createdAt: string,
        @Body('title') title: string,
        @Body('text') text: string,
        @Body('comments') comments: object[],
        @Body('reaction') reaction: object[],
        @Body('votes') votes: string,
    ) {
        const generatedId = await this.activityService.insertActivity(
            createdBy,
            cabildo,
            activityType,
            score,
            pingNumber,
            commentNumber,
            createdAt,
            title,
            text,
            comments,
            reaction,
            votes,
        );
        return { id: generatedId };
    }

    @Get()
    async getAllActivities() {
        const activities = await this.activityService.getActivity();
        return activities;
    }

    @Get(':id')
    getActivityById(@Param('id') activityId: string) {
        return this.activityService.getActivityById(activityId);
    }

    @Delete(':id')
    async deleteActivity(@Param('id') activityId: string) {
        await this.activityService.deleteActivity(activityId);
        return null;
    }
}
