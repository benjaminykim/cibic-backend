import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    userProfilePopulate,
    feedPopulate,
    followPopulate,
} from '../constants'
import { validateId } from '../utils';
import { activityPopulate } from '../constants';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { User } from './users.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: mongoose.Model<User>) {}

    private userView = data => ({
        id: data._id,
        username: data.username,
        email: data.email,
        firstname: data.firstName,
        middleName: data. middleName,
        lastName: data.lastName,
        maidenName: data.maidenName,
        phone: data.phone,
        rut: data.rut,
        desc: data.desc,
        cabildos: data.cabildos,
        followers: data.followers,
        following: data.following,
        citizenPoints: data.citizenPoints,
    });

    async insertUser(user: User) {
        let collision = await this.userModel.exists({email: user.email})
            || await this.userModel.exists({username: user.username});
        if (collision)
            throw new UnprocessableEntityException();
        const idUser = bcrypt.hash(user.password, saltRounds)
            .then(async hash => {
                user.password = hash;
                const newUser = new this.userModel(user);
                const result = await newUser.save();
                return result.id as string;
            }).catch(err => console.log(err));
        return idUser;
    }

    async getProfile(idUser: string) {
        await this.exists(idUser);
        return await this.userModel.findById(idUser)
            .populate(userProfilePopulate)// get activities from user's feed list
            .lean() // return plan json object
    }

    async getFeed(idUser: string, limit: number = 20, offset: number = 0) {
        await this.exists(idUser);
        let feed = await this.userModel.findById(idUser)
            .populate(feedPopulate(idUser, limit, offset))
            .lean() // return plain json object
        return feed.activityFeed;
    }

    async getFollow(idUser: string, limit: number = 20, offset: number = 0) {
        // TODO This is HORRIBLE, we have got to find a better way to accomplish unique activity list
        //Specifically, initial query returns duplicates
        //We use tally object to ensure unique id list
        //And then sort in Object.values line
        //And then populate that final list.
        //Gross.
        await this.exists(idUser);
        const user = await this.userModel
            .findById(idUser)
            .populate(
                [
                    {
                        path: 'following',
                        select: 'activityFeed -_id',
                        populate: { path: 'activityFeed' },
                    },
                    {
                        path: 'cabildos',
                        select: 'activityFeed -_id',
                        populate: { path: 'activityFeed' },
                    },
                ]
            )
            .exec();
        const ids = [...user.following, ...user.cabildos].map(obj => obj.activityFeed);
        const feedIds = [].concat.apply([], ids);
        let tally = {};
        feedIds.forEach(id => {tally[id._id] = id});
        const feed = await this.userModel.populate(
            Object.values(tally).sort((a,b) => a['ping'] < b['ping'] ? 1 : -1),
            activityPopulate(idUser));
        return feed;
    }

    // update idFollower's activityFeed with query of idFollowed
    async followUser(idFollower: string, idFollowed: string) {
        await this.exists(idFollower);
        await this.exists(idFollowed);
        const first = await this.userModel.findByIdAndUpdate(
            idFollower,
            { $addToSet: {following: idFollowed}},
        );
        const second = await this.userModel.findByIdAndUpdate(
            idFollowed,
            { $addToSet: {followers: idFollower}},
        );
        if (!first || !second) {
            return false;
        }
        return true;
    }

    async followCabildo(idUser: string, idCabildo: string) {
        return await this.userModel.findByIdAndUpdate(
            idUser,
            { $addToSet: {cabildos: idCabildo}},
        );
    }

    // update idFollower's activityFeed with query of idFollowed
    async unfollowUser(idFollower: string, idFollowed: string) {
        await this.exists(idFollower);
        await this.exists(idFollowed);
        const first = await this.userModel.findByIdAndUpdate(
            idFollower,
            { $pull: {following: idFollowed}},
        );
        const second = await this.userModel.findByIdAndUpdate(
            idFollowed,
            { $pull: {followers: idFollower}},
        );
        if (!first || !second) {
            return false;
        }
        return true;
    }
    async unfollowCabildo(idUser: string, idCabildo: string) {
        return await this.userModel.findByIdAndUpdate(
            idUser,
            { $pull: {cabildos: idCabildo}},
        );
    }

    async exists(idUser: string) {
        await validateId(idUser);
        let it = await this.userModel.exists({_id: idUser});
        if (!it)
            throw new NotFoundException('Could not find user.');
    }

    async pushToFeed(idUser: string, idActivity: string) {//unused
        return await this.userModel.findByIdAndUpdate(
            idUser,
            {$addToSet: {activityFeed: idActivity}},
        );
    }

    async pushToFollow(idFollower: string, idActivity: string) {
        return await this.userModel.findByIdAndUpdate(
            idFollower,
            {$addToSet: {followFeed: idActivity}},
        );
    }

    async addPoints(idUser: string | object, value: number) {
        return await this.userModel.findByIdAndUpdate(
            idUser,
            { $inc: { citizenPoints: value } }
        );
    }

    async getUserByEmail(email: string) {
        return await this.userModel.findOne({ email });
	  }

    private async findUser(userId: string) {
        let user;
        try {
            user = await this.userModel.findById(userId).lean().exec();
        } catch (error) {
            throw new NotFoundException('Could not find user.');
        }
        if (!user) {
            throw new NotFoundException('Could not find user.');
        }
        return user;
    }

}
