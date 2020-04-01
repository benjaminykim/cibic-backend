import {
    Inject,
    Injectable,
    forwardRef,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { Users } from './users.schema';

import { CabildoService } from '../cabildos/cabildo.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly usersModel: Model<Users>,
        @Inject(forwardRef(() => 'CabildoService')) private readonly cabildoService: CabildoService,
    ) {}

    private async callback (err, res) {
        if (err) {
            console.error(`Error: ${err}`);
            throw new InternalServerErrorException();
        } else {
            //                console.log(`Success: ${res}`);
        }
    }

    async insertUser(user: Users) {
        let collision = await this.usersModel.exists({email: user.email})
            || await this.usersModel.exists({rut: user.rut})
            || await this.usersModel.exists({username: user.username});
        if (collision)
            throw new UnprocessableEntityException();
        const idUser = await bcrypt.hash(user.password, saltRounds)
            .then(async hash => {
                user.password = hash;
                const newUser = new this.usersModel(user);
                const result = await newUser.save();
                return result.id as string;
            }).catch(err => console.log(err));
        return idUser;
    }

    async getUsers() {
        const users = await this.usersModel.find().exec();
        return users.map(data => ({
            id: data._id,
            username: data.username,
            email: data.email,
            firstname: data.firstName,
            middleName: data. middleName,
            lastName: data.lastName,
            maidenName: data.maidenName,
            phone: data.phone,
            rut: data.rut,
            cabildos: data.cabildos,
            followers: data.followers,
            following: data.following,
            citizenPoints: data.citizenPoints,
        }));
    }

    // update idFollower's activityFeed with query of idFollowed
    async followUser(idFollower: string, idFollowed: string) {
        const followerExists = await this.usersModel.exists({_id: idFollower});
        const followedBExists = await this.usersModel.exists({_id: idFollowed});
        if (!followerExists || !followedBExists) {
            return false;
        }
        const first = await this.usersModel.findByIdAndUpdate(
            idFollower,
            { $addToSet: {following: idFollowed}},
            this.callback
        );
        const second = await this.usersModel.findByIdAndUpdate(
            idFollowed,
            { $addToSet: {followers: idFollower}},
            this.callback
        );
        if (!first || !second) {
            return false;
        }
        return true;
    }

    async followCabildo(idUser: string, idCabildo: string) {
        const userExists = await this.exists(idUser);
        const cabildoExists = await this.cabildoService.exists(idCabildo);
        if (!userExists || !cabildoExists) {
            return false;
        }
        const user = await this.usersModel.findByIdAndUpdate(
            idUser,
            { $addToSet: {cabildos: idCabildo}},
            this.callback
        );
        const cabildo = await this.cabildoService.addUser(idCabildo, idUser);
        if (user && cabildo) {
            return true;
        }
        return false;
    }

    async exists(idUser: string) {
        return await this.usersModel.exists({_id: idUser});
    }

    async getUserById(idUser: string) {
        const user = await this.findUser(idUser);
        return user;
    }

    async pushToFeed(idUser: string, idActivity: string) {
        await this.usersModel.findByIdAndUpdate(
            idUser,
            {$addToSet: {activityFeed: idActivity}},
            this.callback
        );
    }

    // Function to be called from ActivityService.insertActivity()
    async pushToFeedAndFollowers(idUser: string, idActivity: string) {
        const user = await this.usersModel.findByIdAndUpdate(
            idUser,
            {$addToSet: {activityFeed: idActivity}},
            this.callback
        );
        // Is it faster to populate and iterate or to do this?
        user.followers.forEach(async idFollower => {
            await this.usersModel.findByIdAndUpdate(
                idFollower,
                {$addToSet: {activityFeed: idActivity}},
                this.callback
            );
        });
    }

    private async findUser(userId: string) {
        let user;
        try {
            user = await this.usersModel.findById(userId).exec();
        } catch (error) {
            throw new NotFoundException('Could not find user.');
        }
        if (!user) {
            throw new NotFoundException('Could not find user.');
        }
        return user;
    }
    async getFeed(idUser: string) {
        return await this.usersModel.findById(idUser)
            .populate({ // get activities from user's feed list
                path: 'activityFeed',
                slice: 20,
                populate: [
                    { // info about user that created activity
                        path: 'idUser',
                        select: '_id username citizenPoints',
                    },
                    { // info about cabildo posted to
                        path: 'idCabildo',
                        select: 'name _id',
                    },
                    { // first 100 comments
                        path: 'comments',
                        slice: 100,
                        sort: 'score',
                        populate: [
                            { // user info about posters
                                path: 'idUser',
                                select: 'username _id citizenPoints'
                            },
                            { // top ten replies
                                path: 'reply',
                                slice: 10,
                                sort: 'score',
                                populate: [
                                    {
                                        path: 'idUser',
                                        select: '_id username citizenPoints',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            })
            .lean() // return plan json object
    }
}
