import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Activity } from './activity.schema';
import {readConfigurationFile} from 'tslint/lib/configuration';
import { callbackify } from 'util';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel('Activity') private readonly activityModel: Model<Activity>,
	) {}

    async insertActivity(activity: Activity
    ) {
        const newActivity = new this.activityModel(activity);
        const result = await newActivity.save();
        return result.id as string;
    }

    async updateActivity(activityId: string, activity: Activity) {
        function callback(err, data) {
            if (err) {
                console.error(`Error updating activity: ${err}`);
            } else {
                console.log(`updated activity ${data}`);
            }
        }
        const result = await this.activityModel.findbyIdAndUpdate(
            activityId,
            activity,
            callback
        );
        return result;
    }

    async getActivity() { // list all activities
        const activity = await this.activityModel.find().exec();
        return activity;/*.map(data => ({
            idUser: data.idUser,
            idCabildo: data.idCabildo,
            activityType: data.activityType,
            score: data.score,
            pingNumber: data.pingNumber,
            commentNumber: data.commentNumber,
            publishDate: data.publishDate,
            title: data.title,
            text: data.text,
            comments: data.comments,
            reactions: data.reactions,
            votes: data.votes,
        }));*/
    }

    async getActivityById(activityId: string) {
        const activity = await this.findActivity(activityId);
        return activity;/*.map(data => ({
            idUser: data.idUser,
            idCabildo: data.idCabildo,
            activityType: data.activityType,
            score: data.score,
            pingNumber: data.pingNumber,
            commentNumber: data.commentNumber,
            publishDate: data.publishDate,
            title: data.title,
            text: data.text,
            comments: data.comments,
            reactions: data.reactions,
            votes: data.votes,
        }));*/
    }

    async deleteActivity(id: string) {
        const result = await this.activityModel.findByIdAndDelete(id).exec(); //callback stuf here TODO SMONROE
        if (result.n === 0) {
            throw new NotFoundException('Could not find activity.');
        }
    }

    private async findActivity(id: string) {
        let result;
        try {
            result = await this.activityModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('Could not find activity.');
        }
        if (!result) {
            throw new NotFoundException('Could not find activity.');
        }
        return result;
    }
}
