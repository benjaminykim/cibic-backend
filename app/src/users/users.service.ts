import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../activities/activity.entity';
import { Repository, getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { User } from './users.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

    async insertUser(user: User) {
        let collision = await this.repository.count({email: user.email})
            + await this.repository.count({phone: user.phone});
        if (collision)
            throw new UnprocessableEntityException();
        const userId = bcrypt.hash(user.password, saltRounds)
            .then(async hash => {
                user.password = hash;
                const result = await this.repository.save(user);
                return result.id as number;
            }).catch(err => console.log(err));
        return userId;
    }

    async getProfile(userId: number) {
        const tmp = await this.repository
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.id = :id", {id: userId})
            .leftJoinAndSelect("user.cabildos", "cabildos")
            .leftJoinAndSelect("user.following", "following")
            .leftJoinAndSelect("user.followers", "followers")
            .getOne()
        return tmp;
    }

    async getFeed(userId: number, limit: number = 20, offset: number = 0) {
        return await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where('activity.user = :id', { id: userId})
            .leftJoinAndSelect("activity.user", "auser")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.userId = :userId")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId")
            .setParameter("userId", userId)
            .getMany();
    }

    async getFollow(userId: number, limit: number = 5, offset: number = 0) {
        const user = await this.repository.findOne({id: userId})
        const cabIds = user.cabildosIds.length ? user.cabildosIds : [0]
        const folIds = user.followingIds.length ? user.followingIds : [0]
        return await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where("activity.cabildo IN (:...cabildos)", {cabildos: cabIds})
            .orWhere("activity.user IN (:...following)", {following: folIds})
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId")
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :userId")
            .setParameter("userId", userId)
            .orderBy("activity.ping", "DESC")
            .skip(offset)
            .take(limit)
            .getMany();
    }

    // update idFollower's activityFeed with query of idFollowed
    async followUser(idFollower: number, idFollowed: number) {
        await this.repository
            .createQueryBuilder()
            .relation(User, 'following')
            .of(idFollower)
            .add(idFollowed);
    }

    async followCabildo(userId: number, cabildoId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(User, 'cabildos')
            .of(userId)
            .add(cabildoId);
    }

    // update idFollower's activityFeed with query of idFollowed
    async unfollowUser(idFollower: number, idFollowed: number) {
        await this.repository
            .createQueryBuilder()
            .relation(User, 'following')
            .of(idFollower)
            .remove(idFollowed);
    }

    async unfollowCabildo(userId: number, cabildoId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(User, 'cabildos')
            .of(userId)
            .remove(cabildoId);
    }

    async exists(userId: number) {
        if (!userId || !await this.repository.count({id: userId}))
            throw new NotFoundException('Could not find user.');
    }

    async pushToFeed(userId: number, activityId: number) {
         await this.repository
            .createQueryBuilder()
            .relation(User, 'activityFeed')
            .of(userId)
            .add(activityId)
    }

    async addPoints(userId: number, value: number) {
        return await this.repository
            .increment({id: userId}, 'citizenPoints', value)
    }

    async getUserByEmail(email: string) {
        return await this.repository.createQueryBuilder()
            .from(User, "user")
            .select("user")
            .addSelect("user.password")
            .where("user.email = :email", { email: email })
            .getOne()
      }

    async updateDesc(userId: number, newDesc: string) {
        return await this.repository.update(
            {id: userId},
            {desc: newDesc},
        );
    }
}
