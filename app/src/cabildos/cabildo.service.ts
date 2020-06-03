import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    UnprocessableEntityException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Activity } from '../activities/activity.entity';
import { Cabildo } from './cabildo.entity';
import { configService } from '../config/config.service';

@Injectable()
export class CabildoService {
    constructor(@InjectRepository(Cabildo) private readonly repository: Repository<Cabildo>) {}

    async checkCabildoName(cabildoName: string) {
        return await this.repository.count({name: cabildoName});
    }

    async verifyCabildoAdmin(cabildoId: number, userId: number) {
        const cabildo = await this.repository.findOne(cabildoId)
        if (cabildo.adminId !== userId) {
            throw new ForbiddenException('You are not the admin of this cabildo');
        }
    }

    async exists(cabildoId: number) {
        if (!cabildoId || !await this.repository.count({id: cabildoId}))
            throw new NotFoundException('Could not find cabildo.');
    }

    async insertCabildo(cabildo: Cabildo) {
        const collision = await this.checkCabildoName(cabildo.name);
        if (collision)
            throw new UnprocessableEntityException();
        const result = await this.repository.save(cabildo);
        await this.repository
            .createQueryBuilder()
            .relation(Cabildo, "members")
            .of(result.id)
            .add(result.adminId)
        return result.id as number;
    }

    async getAllCabildos() {
        const cabildos = await this.repository.find();
        return cabildos.map(data => ({
            id: data.id,
            name: data.name,
            members: data.members,
            moderators: data.moderators,
            admin: data.admin,
            location: data.location,
            desc: data.desc,
        }));
    }

    async getCabildoProfile(cabildoId: number) {
        const cabildo = await this.repository
            .createQueryBuilder()
            .select("cabildo")
            .from(Cabildo, "cabildo")
            .where("cabildo.id = :id", {id: cabildoId})
            .leftJoinAndSelect("cabildo.members", "members")
            .leftJoinAndSelect("cabildo.moderators", "moderators")
            .leftJoinAndSelect("cabildo.admin", "admin")
            .getOne()
        return cabildo;
    }

    async getCabildoFeed(cabildoId: number, userId: number, offset: number) {
        const feed = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where("activity.cabildo = :id", {id:cabildoId})
            .leftJoinAndSelect("activity.user", "auser")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.tags", "tags")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", { user: userId })
            .orderBy("activity.ping", "DESC")
            .skip(offset)
            .take(configService.getFeedLimit())
            .getMany()
        return feed;
    }

    async deleteCabildo(cabildoId: number) {
        const cabildo = await this.repository.delete(cabildoId)
        if (!cabildo) {
            throw new NotFoundException('Could not find cabildo.');
        }
    }

    async addUser(cabildoId: number, userId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Cabildo, 'members')
            .of(cabildoId)
            .add(userId)
        return true;
    }

    async removeUser(cabildoId: number, userId: number) {
          await this.repository
            .createQueryBuilder()
            .relation(Cabildo, 'members')
            .of(cabildoId)
            .remove(userId)
        return true;
    }

    async pushToFeed(cabildoId: number, activityId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Cabildo, 'activityFeed')
            .of(cabildoId)
            .add(activityId)
        return true;
    }

    private async findCabildo(cabildoId: number) {
        let cabildo;
        try {
            cabildo = await this.repository.findOne(cabildoId)
        } catch (error) {
            throw new NotFoundException('Could not find cabildo.');
        }
        if (!cabildo) {
            throw new NotFoundException('Could not find cabildo.');
        }
        return cabildo;
    }

    async updateCabildoDesc(cabildoId: number, newDesc: string) {
        return await this.repository.update(
            {id: cabildoId},
            {desc: newDesc},
        );
    }
}
