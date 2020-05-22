import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { cabildoProfilePopulate, feedPopulate } from '../constants';
import { validateId } from '../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Activity } from '../activities/activity.entity';
import { Cabildo } from './cabildo.entity';

@Injectable()
export class CabildoService {
    constructor(@InjectRepository(Cabildo) private readonly repository: Repository<Cabildo>) {}

    async checkCabildoName(cabildoName: string) { return await this.repository.count({name: cabildoName}); }
    async getCabildoAdmin(cabildoId: number) { return await this.repository.findOne({select: ["admin"], where: {id: cabildoId}}); }

    async exists(cabildoId: number) {
        await validateId(cabildoId);
        let it = await this.repository.count({id: cabildoId});
        if (!it)
            throw new NotFoundException('Could not find cabildo.');
    }

    async insertCabildo(cabildo: Cabildo) {
        const collision = await this.checkCabildoName(cabildo.name);
        if (collision)
            throw new InternalServerErrorException();
        const newCabildo = await this.repository.create(cabildo)
        const result = await this.repository.save(newCabildo);
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
        const cabildo = await this.repository.findOne(
            cabildoId,
            {
                relations: [
                    'members',
                    'moderators',
                    'admin',
                ],
            },
        );
        return cabildo//.populate(cabildoProfilePopulate).execPopulate();
    }

    async getCabildoFeed(cabildoId: number, userId: number) {
        const feed = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where("activity.cabildo = :id", {id:cabildoId})
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.comments", "comments")
            .leftJoinAndSelect("comments.replies", "replies")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", { user: userId })
            .orderBy("activity.ping", "DESC")
            .getMany()
        return feed;
    }

    async deleteCabildo(cabildoId: number) {
        const cabildo = await this.repository.delete(cabildoId)
        console.log(cabildo)
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
}