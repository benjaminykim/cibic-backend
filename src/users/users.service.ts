import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { Users } from './users.schema';
import {Cabildo} from '../cabildos/cabildo.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly usersModel: Model<Users>,
    ) {}

    async insertUser(
                    username: string,
                    email: string,
                    password: string,
                    firstName: string,
                    middleName: string,
                    lastName: string,
                    maidenName: string,
                    phone: number,
                    rut: string,
                    cabildos: string) {
        const cryptPass = bcrypt(password, saltRounds);
        const newUser = new this.usersModel({
            username,
            email,
            password: cryptPass,
            firstName,
            middleName,
            lastName,
            maidenName,
            phone,
            rut,
            cabildos,
        });
        const result = await newUser.save();
        return result.id as string;
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

    async getUsersById(UserId: string) {
        const users = await this.findUser(UserId);
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
