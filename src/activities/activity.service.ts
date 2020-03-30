import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Activity } from './activity.schema';
import { Cabildo } from '../cabildos/cabildo.schema';
import { Users } from '../users/users.schema';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel('Activity') private readonly activityModel: Model<Activity>,
        @InjectModel('Cabildo') private readonly cabildoModel: Model<Cabildo>,
        @InjectModel('Users') private readonly usersModel: Model<Users>,
	) {}

    private async activityCallback(err: any, data: any) {
        if (err) {
            console.error(`Error with activity: ${err}`);
        } else {
            console.log(`Success with activity: ${data}`);
        }
    }

    async insertActivity(activity: Activity) {
        const newActivity = new this.activityModel(activity);
        const result = await newActivity.save();
        const genId = result.id;
        const user = await this.usersModel.findByIdAndUpdate(
            activity.idUser,
            {$addToSet: {activityFeed: genId}},
            this.activityCallback
        );
        user.followers.forEach(async id => {
            await this.usersModel.findByIdAndUpdate(
                id,
                {$addToSet: {activityFeed: genId}},
                this.activityCallback
            );
        })
        if (activity.idCabildo && await this.cabildoModel.exists({_id: activity.idCabildo})) {
            const cabildo = await this.cabildoModel.findByIdAndUpdate(
                activity.idCabildo,
                {$addToSet: {activities: genId}},
                this.activityCallback
            )
            cabildo.members.forEach(async id => {
                await this.usersModel.findByIdAndUpdate(
                    id,
                    {$addToSet: {activityFeed: genId}},
                    this.activityCallback
                );
            })
        }
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
            { $addToSet: { comments: idComment }},
            this.activityCallback
        );
        return result;
    }

    async getActivity() { // list all activities
        const activities = await this.activityModel.find().exec();
        return activities;
    }

    async getActivityById(idActivity: string) {
        const activity = await this.findActivity(idActivity);
        return activity;
    }

    async deleteActivity(idActivity: string) {
        const activity = await this.activityModel.findByIdAndDelete(idActivity).exec(); //callback stuf here TODO SMONROE
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

    async getActivityList(idUser: string) {
        let list = await this.usersModel.findById(idUser)
            .populate({
                path: 'activityFeed',
                populate: {
                    path: 'comments',
                    slice: 3,
                    populate: {
                        path: 'replies',
                        slice: 10,
                    },
                },
            });
        console.log(list);
        return list;
    }
}
