import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cabildo } from './cabildo.schema';

@Injectable()
export class CabildosService {
    constructor(
        @InjectModel('Cabildo') private readonly cabildoModel: Model<Cabildo>,
    ) {}

    async insertCabildo(name: string,
                        members: string,
                        moderators: string,
                        location: string,
                        issues: string,
                        meetings: object[],
                        files: string) {
        const newCabildo = new this.cabildoModel({
            name,
            members,
            moderators,
            location,
            issues,
            meetings,
            files,
        });
        const result = await newCabildo.save();
        return result.id as string;
    }

    async getCabildos() {
        const cabildo = await this.cabildoModel.find().exec();
        return cabildo.map(data => ({
            name: data.name,
            members: data.members,
            moderators: data.moderators,
            location: data.location,
            issues: data.issues,
            meetings: data.meetings,
            files: data.files,
        }));
    }

    async getCabildoById(cabildoId: string) {
        const cabildo = await this.findCabildo(cabildoId);
        return cabildo.map(data => ({
            name: data.name,
            members: data.members,
            moderators: data.moderators,
            location: data.location,
            issues: data.issues,
            meetings: data.meetings,
            files: data.files,
        }));
    }

    async deleteCabildo(id: string) {
        const result = await this.cabildoModel.deleteOne({_id: id}).exec();
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
