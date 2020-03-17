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
        idUser: string,
        idCabildo: string,
        activityType: string,
        score: number,
        pingNumber: number,
        commentNumber: number,
        publishDate: string,
        title: string,
        text: string,
        comments: object[],
        reactions: object[],
        votes: string,
    ) {
        const newActivity = new this.activityModel({
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
        });
        const result = await newActivity.save();
        return result.id as string;
    }

    async updateActivity(
        activityId: string,
        idUser: string,
        idCabildo: string,
        activityType: string,
        score: number,
        pingNumber: number,
        commentNumber: number,
        publishDate: string,
        title: string,
        text: string,
        comments: object[],
        reactions: object[],
        votes: string,
    ) {}

    async getActivity() { // list all activities
        const activity = await this.activityModel.find().exec();
        return activity.map(data => ({
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
        }));
    }

    async getActivityById(activityId: string) {
        const activity = await this.findActivity(activityId);
        return activity.map(data => ({
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
