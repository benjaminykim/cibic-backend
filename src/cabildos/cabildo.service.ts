import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cabildo } from './cabildo.schema';

@Injectable()
export class CabildoService {
    constructor(@InjectModel('Cabildo') private readonly cabildoModel: Model<Cabildo>) {}

    private async callback(err: any, data: any) {
        if (err) {
            console.error(`Error with activity: ${err}`);
        } else {
            //            console.log(`Success with activity: ${data}`);
        }
    }

    async insertCabildo(cabildo: Cabildo) {
        const collision = await this.cabildoModel.exists({name: cabildo.name});
        if (collision)
            throw new InternalServerErrorException();
        const newCabildo = new this.cabildoModel(cabildo)
        const result = await newCabildo.save();
        return result.id as string;
    }

    async checkCabildoName(cabildoName: string) {
        return await this.cabildoModel.exists({name: cabildoName});
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
            issues: data.issues,
            meetings: data.meetings,
            files: data.files,
        }));
    }

    async exists(idCabildo: string) {
        return await this.cabildoModel.exists({_id: idCabildo});
    }

    async getCabildoById(cabildoId: string) {
        const cabildo = await this.findCabildo(cabildoId);
        return cabildo;
    }

    async deleteCabildo(cabildoId: string) {
        const cabildo = await this.cabildoModel.findByIdAndDelete(cabildoId).exec();
        if (cabildo.n === 0) {
            throw new NotFoundException('Could not find cabildo.');
        }
    }

    async addUser(idCabildo: string, idUser) {
        return await this.cabildoModel.findByIdAndUpdate(
            idCabildo,
            { $addToSet: {members: idUser}},
            this.callback
        );
    }

    async pushToFeed(idCabildo: string, idActivity: string) {
        return await this.cabildoModel.findByIdAndUpdate(
            idCabildo,
            {$addToSet: {activities: idActivity}},
            this.callback
        );
    }

    private async findCabildo(cabildoId: string) {
        let cabildo;
        try {
            cabildo = await this.cabildoModel.findById(cabildoId).lean().exec();
        } catch (error) {
            throw new NotFoundException('Could not find cabildo.');
        }
        if (!cabildo) {
            throw new NotFoundException('Could not find cabildo.');
        }
        return cabildo;
    }
}
