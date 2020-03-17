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
        @Body('idUser') idUser: string,
        @Body('idCabildo') idCabildo: string,
        @Body('activityType') activityType: string,
        @Body('score') score: number,
        @Body('pingNumber') pingNumber: number,
        @Body('commentNumber') commentNumber: number,
        @Body('publishDate') publishDate: string,
        @Body('title') title: string,
        @Body('text') text: string,
        @Body('comments') comments: object[],
        @Body('reactions') reactions: object[],
        @Body('votes') votes: string,
    ) {
        const generatedId = await this.activityService.insertActivity(
            idUser,
            idCabildo,
            activityType,
            score,
            pingNumber,
            commentNumber,
            publishDate,
            title,
            text,
            comments,
            reactions,
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
    getActivityById(@Param('id') idActivity: string) {
        return this.activityService.getActivityById(idActivity);
    }

    @Delete(':id')
    async deleteActivity(@Param('id') idActivity: string) {
        await this.activityService.deleteActivity(idActivity);
        return null;
    }
}
