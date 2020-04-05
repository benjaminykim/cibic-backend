import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
} from '@nestjs/common';
import { userProfilePopulate, feedPopulate } from '../constants'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { User } from './users.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    private async callback (err, res) {
        if (err) {
            console.error(`Error: ${err}`);
            throw new InternalServerErrorException();
        } else {
            //                console.log(`Success: ${res}`);
        }
    }

    private async validateId(id: string) {
        if (id.length == 24)
            return;
        throw new NotFoundException();
    }

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
            || await this.userModel.exists({rut: user.rut})
            || await this.userModel.exists({username: user.username});
        if (collision)
            throw new UnprocessableEntityException();
        const idUser = await bcrypt.hash(user.password, saltRounds)
            .then(async hash => {
                user.password = hash;
                const newUser = new this.userModel(user);
                const result = await newUser.save();
                return result.id as string;
            }).catch(err => console.log(err));
        return idUser;
    }

    async getUsers() { // only useful in testing
        const users = await this.userModel.find().lean().exec();
        return users.map(this.userView);
    }

    // update idFollower's activityFeed with query of idFollowed
    async followUser(idFollower: string, idFollowed: string) {
        await this.exists(idFollower);
        await this.exists(idFollowed);
        const first = await this.userModel.findByIdAndUpdate(
            idFollower,
            { $addToSet: {following: idFollowed}},
            this.callback
        );
        const second = await this.userModel.findByIdAndUpdate(
            idFollowed,
            { $addToSet: {followers: idFollower}},
            this.callback
        );
        if (!first || !second) {
            return false;
        }
        // populate feed
        return true;
    }

    async followCabildo(idUser: string, idCabildo: string) {
        return await this.userModel.findByIdAndUpdate(
            idUser,
            { $addToSet: {cabildos: idCabildo}},
            this.callback
        );
    }

    async exists(idUser: string) {
        await this.validateId(idUser);
        let it = await this.userModel.exists({_id: idUser});
        if (!it)
            throw new NotFoundException('Could not find user.');
    }

    async pushToFeed(idUser: string, idActivity: string) {//unused
        return await this.userModel.findByIdAndUpdate(
            idUser,
            {$addToSet: {activityFeed: idActivity}},
            this.callback
        );
    }

    async pushToFollow(idFollower: string, idActivity: string) {
        return await this.userModel.findByIdAndUpdate(
            idFollower,
            {$addToSet: {followFeed: idActivity}},
            this.callback
        );
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

    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
		return user;
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
            .populate(feedPopulate('activityFeed', limit, offset))
            .lean() // return plain json object
        return feed && feed.activityFeed;
    }

    async getFollow(idUser: string, limit: number = 20, offset: number = 0) {
        await this.exists(idUser);
        let feed = await this.userModel.findById(idUser)
            .populate(feedPopulate('followFeed', limit, offset))
            .lean() // return plain json object
        return feed && feed.followFeed;
    }
}
