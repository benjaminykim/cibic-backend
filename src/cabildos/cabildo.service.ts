import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { cabildoProfilePopulate, feedPopulate } from '../constants';
import { validateId } from '../utils';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { Cabildo } from './cabildo.schema';

@Injectable()
export class CabildoService {
    constructor(@InjectModel('Cabildo') private readonly cabildoModel: mongoose.Model<Cabildo>) {}

    async checkCabildoName(cabildoName: string) { return await this.cabildoModel.exists({name: cabildoName}); }
    async getCabildoAdmin(idCabildo: string) { return await this.cabildoModel.findById(idCabildo, 'id'); }

    async exists(idCabildo: string) {
        await validateId(idCabildo);
        let it = await this.cabildoModel.exists({_id: idCabildo});
        if (!it)
            throw new NotFoundException('Could not find cabildo.');
    }

    async insertCabildo(cabildo: Cabildo) {
        const collision = await this.cabildoModel.exists({name: cabildo.name});
        if (collision)
            throw new InternalServerErrorException();
        const newCabildo = new this.cabildoModel(cabildo)
        const result = await newCabildo.save();
        return result.id as string;
    }

    async getAllCabildos() {
        const cabildos = await this.cabildoModel.find().lean().exec();
        return cabildos.map(data => ({
            id: data.id,
            name: data.name,
            members: data.members,
            moderators: data.moderators,
            admin: data.admin,
            location: data.location,
            desc: data.desc,
            issues: data.issues,
            meetings: data.meetings,
            files: data.files,
        }));
    }

    async getCabildoProfile(idCabildo: string) {
        const cabildo = await this.findCabildo(idCabildo);
        return cabildo.populate(cabildoProfilePopulate).execPopulate();
    }

    async getCabildoFeed(idCabildo: string, idUser: string) {
        let cabildo =  await this.cabildoModel
            .findById(idCabildo)
            .populate(feedPopulate('activities', idUser, 20, 0))
            .lean();
        return cabildo.activities;
    }

    async deleteCabildo(idCabildo: string) {
        const cabildo = await this.cabildoModel.findByIdAndDelete(idCabildo).exec();
        if (cabildo.n === 0) {
            throw new NotFoundException('Could not find cabildo.');
        }
    }

    async addUser(idCabildo: string, idUser) {
        return await this.cabildoModel.findByIdAndUpdate(
            idCabildo,
            {
                $addToSet: {
                    members: idUser
                },
            },
        );
    }

    async pushToFeed(idCabildo: string, idActivity: string) {
        return await this.cabildoModel.findByIdAndUpdate(
            idCabildo,
            {
                $addToSet: {
                    activities: idActivity
                },
            },
        );
    }

    private async findCabildo(idCabildo: string) {
        let cabildo;
        try {
            cabildo = await this.cabildoModel.findById(idCabildo).exec();
        } catch (error) {
            throw new NotFoundException('Could not find cabildo.');
        }
        if (!cabildo) {
            throw new NotFoundException('Could not find cabildo.');
        }
        return cabildo;
    }
}
