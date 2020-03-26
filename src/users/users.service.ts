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
        const cryptPass = await bcrypt.hash(user.password, saltRounds).then(async hash => {
            const newUser = new this.usersModel(Object.assign(user,{
                password: hash, // hashed password, no plaintext storing
            }));
            const result = await newUser.save();
            return result.id as string;
        }).catch(err => console.log(err));
        return cryptPass;
    }

    async getUsers() {
        const users = await this.usersModel.find().exec();
        return users.map(data => ({
            username: data.username,
            email: data.email,
            firstname: data.firstName,
            middleName: data. middleName,
            lastName: data.lastName,
            maidenName: data.maidenName,
            phone: data.phone,
            rut: data.rut,
            cabildos: data.cabildos,
        }));
    }

    async followUser(followerId, followedId) {
        function callback (err, res) {
            if (err) {
                console.error(`Error: ${err}`);
            } else {
                console.log(`Success: ${res}`);
            }
        }
        const first = await this.usersModel.findOneAndUpdate(
            {_id: followerId},
            { $push: {following: followedId}},
            callback
        );
        const second = await this.usersModel.findOneAndUpdate(
            {_id: followedId},
            { $push: {followers: followerId}},
            callback
        );
    }

    async followCabildo(userId, cabildoId) {
        function callback (err, res) {
            if (err) {
                console.error(`Error: ${err}`);
            } else {
                console.log(`Success: ${res}`);
            }
        }
        const first = await this.usersModel.findOneAndUpdate(
            {_id: userId},
            { $push: {cabildos: cabildoId}},
            callback
        );
        const second = await this.cabildoModel.findOneAndUpdate(
            {_id: cabildoId},
            { $push: {members: userId}},
            callback
        );
    }

    async getUserById(UserId: string) {
        const users = await this.findUser(UserId);
        return users;
        /*.map(data => ({
            username: data.username,
            email: data.email,
            firstname: data.firstName,
            middleName: data. middleName,
            lastName: data.lastName,
            maidenName: data.maidenName,
            phone: data.phone,
            rut: data.rut,
            cabildos: data.cabildos,
        }));*/
    }

    private async findUser(id: string) {
        let result;
        try {
            result = await this.usersModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('Could not find user.');
        }
        if (!result) {
            throw new NotFoundException('Could not find user.');
        }
        return result;
    }
}
