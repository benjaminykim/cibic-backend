import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { feedPopulate, activityPopulate, idFromToken } from '../constants'
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { validateId } from '../utils';
//import { AuthService } from '../auth/auth.service';
import { Activity } from './activity.schema';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel('Activity') private readonly activityModel: mongoose.Model<Activity>,
    ) {
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
        );
        return result;
    }

    async commentActivity(idComment: string, idActivity) {
        const result = await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: {
                    ping: 1,
                    commentNumber: 1,
                },
                $addToSet: { comments: idComment }
            },
        );
        return result;
    }

    async getPublicFeed(idUser: string, limit: number = 20, offset: number = 0) { // list all activities
        let activities = await this.activityModel.find().skip(offset).limit(limit);
        return await this.activityModel.populate(activities, activityPopulate(idUser));
    }

    async getActivityById(idUser: string, idActivity: string) {
        const activity = await this.activityModel.findById(idActivity);
        return await this.activityModel.populate(activity, activityPopulate(idUser));
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

    async exists(idActivity: string | object) {
        await validateId(idActivity as string);
        let it = await this.activityModel.exists({_id: idActivity});
        if (!it)
            throw new NotFoundException('Could not find reaction');
    }

    // Reaction Flow
    async addReaction(
        idActivity: string,
        idReaction: string,
        value: number,
    ) {
        return await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: {
                    ping: 1,
                    score: value,
                },
                $addToSet: { reactions: idReaction },
            },
        );
    }

    async updateReaction(
        idActivity: string,
        idReaction: string,
        oldValue: number,
        newValue: number,
    ) {
        // undo first value, apply second, inc score by that result
        const diff: number = newValue - oldValue;
        return await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: { score: diff }
            },
        );
    }

    async deleteReaction(
        idActivity: string,
        idReaction: string,
        oldValue: number,
    ) {
        return await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: {
                    ping: -1,
                    score: -oldValue,
                },
                $pull: {
                    reactions: idReaction,
                },
            },
        );
    }
}
