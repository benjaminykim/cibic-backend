import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Activity } from './activity.schema';
import {readConfigurationFile} from 'tslint/lib/configuration';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel('Activity') private readonly activityModel: Model<Activity>,
    ) {}

    async insertActivity(
        createdBy: string,
        cabildo: string,
        activityType: string,
        score: number,
        pingNumber: number,
        commentNumber: number,
        createdAt: string,
        title: string,
        text: string,
        comments: object[],
        reaction: object[],
        votes: string,
    ) {
        const newActivity = new this.activityModel({
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
        });
        const result = await newActivity.save();
        return result.id as string;
    }

    async updateActivity(
        activityId: string,
        createdBy: string,
        cabildo: object[],
        activityType: string,
        score: number,
        pingNumber: number,
        commentNumber: number,
        createdAt: string,
        title: string,
        text: string,
        comments: object[],
        reaction: object[],
        votes: string,
    ) {}

    async getActivity() { // list all activities
        const activity = await this.activityModel.find().exec();
        return activity.map(data => ({
            createdBy: data.createdBy,
            cabildo: data.cabildo,
            activityType: data.activityType,
            score: data.score,
            pingNumber: data.pingNumber,
            commentNumber: data.commentNumber,
            createdAt: data.createdAt,
            title: data.title,
            text: data.text,
            comments: data.comments,
            reaction: data.reaction,
            votes: data.votes,
        }));
    }

    async getActivityById(activityId: string) {
        const activity = await this.findActivity(activityId);
        return activity.map(data => ({
            createdBy: data.createdBy,
            cabildo: data.cabildo,
            activityType: data.activityType,
            score: data.score,
            pingNumber: data.pingNumber,
            commentNumber: data.commentNumber,
            createdAt: data.createdAt,
            title: data.title,
            text: data.text,
            comments: data.comments,
            reaction: data.reaction,
            votes: data.votes,
        }));
    }

    async deleteActivity(id: string) {
        const result = await this.activityModel.deleteOne({_id: id}).exec();
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
