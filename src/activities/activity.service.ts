import {
    Inject,
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Activity } from './activity.schema';
//import { Cabildo } from '../cabildos/cabildo.schema';
import { CabildoService } from '../cabildos/cabildo.service';
//import { Users } from '../users/users.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ActivityService {
    constructor(
        @InjectModel('Activity') private readonly activityModel: Model<Activity>,
//        @InjectModel('Cabildo') private readonly cabildoModel: Model<Cabildo>,
//        @InjectModel('Users') private readonly usersModel: Model<Users>,
        @Inject('UsersService') private readonly usersService: UsersService,
        @Inject('CabildoService') private readonly cabildoService: CabildoService,
	) {}

    private async activityCallback(err: any, data: any) {
        if (err) {
            console.error(`Error with activity: ${err}`);
        } else {
//            console.log(`Success with activity: ${data}`);
        }
    }

    async insertActivity(activity: Activity) {
        if (!(await this.usersService.exists(activity.idUser.toString()))) {
            throw new UnprocessableEntityException();
        }
        if (activity.idCabildo) {
            if (!(await this.cabildoService.exists(activity.idCabildo.toString()))) {
                throw new UnprocessableEntityException();
            }
        }
        const newActivity = new this.activityModel(activity);
        const result = await newActivity.save();
        const genId = result.id;
        await this.usersService.pushToFeedAndFollowers(activity.idUser.toString(), genId);
        // const user = await this.usersModel.findByIdAndUpdate(
        //     activity.idUser,
        //     {$addToSet: {activityFeed: genId}},
        //     this.activityCallback
        // );alabama shakes
        // user.followers.forEach(async id => {
        //     await this.usersModel.findByIdAndUpdate(
        //         id,
        //         {$addToSet: {activityFeed: genId}},
        //         this.activityCallback
        //     );
        // })
        if (activity.idCabildo) {
            await this.cabildoService.pushToFeedAndFollowers(activity.idCabildo.toString(), genId);
            // const cabildo = await this.cabildoModel.findByIdAndUpdate(
            //     activity.idCabildo,
            //     {$addToSet: {activities: genId}},
            //     this.activityCallback
            // )
            // cabildo.members.forEach(async id => {
            //     await this.usersModel.findByIdAndUpdate(
            //         id,
            //         {$addToSet: {activityFeed: genId}},
            //         this.activityCallback
            //     );
            // })
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

    async getActivities() { // list all activities
        const activities = await this.activityModel.find().populate({
            path: 'idUser',
            model: 'Users',
            select: 'username _id citizenPoints',
        }, this.activityCallback);
        return activities;
    }

    async getActivityById(idActivity: string) {
        const activity = await this.findActivity(idActivity);
        await activity.populate({
            path: 'idUser',
            model: 'Users',
            select: 'username _id citizenPoints'
        }, this.activityCallback);
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

    async getActivityFeed(idUser: string) {
        return await this.usersService.getFeed(idUser);
    }
}
