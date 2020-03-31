import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { Users } from './users.schema';
import { Cabildo } from '../cabildos/cabildo.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly usersModel: Model<Users>,
        @InjectModel('Cabildo') private readonly cabildoModel: Model<Cabildo>,
    ) {}

    async insertUser(user: Users) {
        const idUser = await bcrypt.hash(user.password, saltRounds).then(async hash => {
            const newUser = new this.usersModel(Object.assign(user,{
                password: hash, // hashed password, no plaintext storing
            }));
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

    async followUser(idFollower: string, idFollowed: string) {
        const followerExists = await this.usersModel.exists({_id: idFollower});
        const followedBExists = await this.usersModel.exists({_id: idFollowed});
        if (!followerExists || !followedBExists) {
            return false;
        }
        function callback (err, res) {
            if (err) {
                console.error(`Error: ${err}`);
            } else {
//                console.log(`Success: ${res}`);
            }
        }
        const first = await this.usersModel.findByIdAndUpdate(
            idFollower,
            { $addToSet: {following: idFollowed}},
            callback
        );
        const second = await this.usersModel.findByIdAndUpdate(
            idFollowed,
            { $addToSet: {followers: idFollower}},
            callback
        );
        if (!first || !second) {
            return false;
        }
        return true;
    }

    async followCabildo(idUser: string, idCabildo: string) {
        const userExists = await this.usersModel.exists({_id: idUser});
        const cabildoExists = await this.cabildoModel.exists({_id: idCabildo});
        if (!userExists || !cabildoExists) {
            return false;
        }
        function callback (err, res) {
            if (err) {
                console.error(`Error: ${err}`);
            } else {
//                console.log(`Success: ${res}`);
            }
        }
        const user = await this.usersModel.findByIdAndUpdate(
            idUser,
            { $addToSet: {cabildos: idCabildo}},
            callback
        );
        const cabildo = await this.cabildoModel.findByIdAndUpdate(
            idCabildo,
            { $addToSet: {members: idUser}},
            callback
        );
        if (user && cabildo) {
            return true;
        }
        return false;
    }

    async getUserById(userId: string) {
        const user = await this.findUser(userId);
        return user;
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
}
