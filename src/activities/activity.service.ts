import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { feedPopulate, activityPopulate } from '../constants'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Activity } from './activity.schema';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel('Activity') private readonly activityModel: Model<Activity>,
    ) {
    }

    private async activityCallback(err: any, data: any) {
        if (err) {
            console.error(`Error with activity: ${err}`);
        } else {
            //            console.log(`Success with activity: ${data}`);
        }
    }

    async insertActivity(activity: Activity) {
        const newActivity = new this.activityModel(activity);
        const result = await newActivity.save();
        const genId = result.id;
        return genId as string;
    }

    async updateActivity(activityId: string, activity: Activity) {
        const result = await this.activityModel.findByIdAndUpdate(
            activityId,
            activity,
            this.activityCallback
        );
        return result;
    }

    async commentActivity(idComment: string, idActivity) {
        const result = await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: {ping: 1},
                $addToSet: { comments: idComment }
            },
            this.activityCallback
        );
        return result;
    }

    async getPublicFeed(limit: number = 20, offset: number = 0) { // list all activities
        let activities = await this.activityModel.find().skip(offset).limit(limit);
        return await this.activityModel.populate(activities, activityPopulate);
    }

    async getActivityById(idActivity: string) {
        const activity = await this.activityModel.findById(idActivity);
        return activity.populate(feedPopulate).execPopulate();
    }

    async deleteActivity(idActivity: string) {
        const activity = await this.activityModel.findByIdAndDelete(idActivity).exec();
        //callback stuf here TODO SMONROE
        if (activity.n === 0) {
            throw new NotFoundException('Could not find activity.');
        }
    }

    private async findActivity(idActivity: string) {
        let activity;
        try {
            activity = await this.activityModel.findById(idActivity).exec();
        } catch (error) {
            throw new NotFoundException('Could not find activity.');
        }
        if (!activity) {
            throw new NotFoundException('Could not find activity.');
        }
        return activity;
    }
}
