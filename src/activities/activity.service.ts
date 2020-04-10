import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { feedPopulate, activityPopulate } from '../constants'
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

    async incPing(idActivity: string, value: number) {
        // Call this when an interaction requires change in ping
        // But isn't already updating Activity Document
        // Otherwise do this inline in query
        return await this.activityModel.findByIdAndUpdate(
            idActivity,
            { $inc: { ping: value }}
        );
    }

    // Activity Flow

    async insertActivity(activity: Activity) {
        const newActivity = new this.activityModel(activity);
        const result = await newActivity.save();
        const genId = result.id;
        return genId as string;
    }

    async updateActivity(idActivity: string, content: string) {
        const result = await this.activityModel.findByIdAndUpdate(
            idActivity,
            { text: content },
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
    async deleteComment(idComment: string, idActivity) {
        const result = await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: {
                    ping: -1,
                    commentNumber: -1,
                },
                $pull: { comments: idComment }
            },
        );
        return result;
    }

    async getPublicFeed(idUser: string, limit: number = 20, offset: number = 0) { // list all activities
//        console.error("reentry");
        let activities = await this.activityModel.find().skip(offset).limit(limit);
//        console.error(activities[0]);
//        console.error("returning inner");
        let query = activityPopulate(idUser);
//        console.error(query);
        let ret = await this.activityModel.populate(activities, query);
//        console.error(ret)
        return ret;
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

    async exists(idActivity: string) {
        await validateId(idActivity);
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

    // Vote Flow
    async addVote(
        idActivity: string,
        idVote: string,
        value: number,
    ) {
        return await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: {
                    ping: 1,
                    score: value,
                },
                $addToSet: { votes: idVote },
            },
        );
    }

    async updateVote(
        idActivity: string,
        idVote: string,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.activityModel.findByIdAndUpdate(
            idActivity,
            {
                $inc: { score: diff }
            },
        );
    }

    async deleteVote(
        idActivity: string,
        idVote: string,
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
                    votes: idVote,
                },
            },
        );
    }
}
