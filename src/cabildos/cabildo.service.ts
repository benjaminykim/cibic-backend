import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cabildo } from './cabildo.schema';

@Injectable()
export class CabildoService {
    constructor(
        @InjectModel('Cabildo') private readonly cabildoModel: Model<Cabildo>,
    ) {}

    async insertCabildo(cabildo: Cabildo) {
        const newCabildo = new this.cabildoModel(cabildo)
        const result = await newCabildo.save();
        return result.id as string;
    }

    async getCabildos() {
        const cabildo = await this.cabildoModel.find().exec();
        return cabildo.map(data => ({
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

    async getCabildoById(cabildoId: string) {
        const cabildo = await this.findCabildo(cabildoId);
        return cabildo;
    }

    async deleteCabildo(id: string) {
        const result = await this.cabildoModel.findByIdAndDelete(id).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could not find cabildo.');
        }
    }

    private async findCabildo(id: string) {
        let result;
        try {
            result = await this.cabildoModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('Could not find cabildo.');
        }
        if (!result) {
            throw new NotFoundException('Could not find cabildo.');
        }
        return result;
    }
}
