import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    userProfilePopulate,
    feedPopulate,
    followPopulate,
} from '../constants'
import { validateId } from '../utils';
import { activityPopulate } from '../constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../activities/activity.entity';
import { Repository, getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

import { User } from './users.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

    private userView = data => ({
        id: data.id,
        username: data.username,
        email: data.email,
        firstname: data.firstName,
        middleName: data. middleName,
        lastName: data.lastName,
        maidenName: data.maidenName,
        phone: data.phone,
        rut: data.rut,
        desc: data.desc,
        cabildos: data.cabildos,
        followers: data.followers,
        following: data.following,
        citizenPoints: data.citizenPoints,
    });

    async insertUser(user: User) {
        let collision = await this.repository.count({email: user.email})
            + await this.repository.count({username: user.username});
        if (collision)
            throw new UnprocessableEntityException();
        const userId = bcrypt.hash(user.password, saltRounds)
            .then(async hash => {
                user.password = hash;
                const newUser = await this.repository.create(user);
                const result = await this.repository.save(newUser);
                return result.id as number;
            }).catch(err => console.log(err));
        return userId;
    }

    async getProfile(userId: number) {
        await this.exists(userId);
        const tmp = await this.repository.findOne(
            userId,
            {
                relations: [ // "username firstname lastname desc citizenPoints cabildos following"
                    'cabildos',
                    'following',
                ],
            });
        return tmp;
    }

    async getFeed(userId: number, limit: number = 20, offset: number = 0) {
        await this.exists(userId);
        const feed = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where('activity.user = :id', { id: userId})
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.comments", "comments")
            .leftJoinAndSelect("activity.reactions", "reactions")
            .leftJoinAndSelect("activity.votes", "activityVotes")
            .leftJoinAndSelect("comments.replies", "replies")
            .leftJoinAndSelect("comments.votes", "commentVotes")
            .leftJoinAndSelect("replies.votes", "replyVotes")
            .getMany();
        return feed;
    }

    async getFollow(userId: number, limit: number = 20, offset: number = 0) {
        await this.exists(userId);
        const user = await this.repository.findOne({id: userId})
        const cabIds = user.cabildosIds.length ? user.cabildosIds : [0]
        const folIds = user.followingIds.length ? user.followingIds : [0]
        const feed = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where("activity.cabildo IN (:...cabildos)", {cabildos: cabIds})
            .orWhere("activity.user IN (:...following)", {following: folIds})
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.comments", "comments")
            .leftJoinAndSelect("comments.replies", "replies")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", { user: userId })
            .orderBy("activity.ping", "DESC")
            .skip(offset)
            .take(limit)
            .getMany()
        return feed;
    }

    // update idFollower's activityFeed with query of idFollowed
    async followUser(idFollower: number, idFollowed: number) {
        await this.exists(idFollower);
        await this.exists(idFollowed);
        await this.repository
            .createQueryBuilder()
            .relation(User, 'following')
            .of(idFollower)
            .add(idFollowed);
        return true;
    }

    async followCabildo(userId: number, cabildoId: number) {
        const ret = await this.repository
            .createQueryBuilder()
            .relation(User, 'cabildos')
            .of(userId)
            .add(cabildoId);
        return true;
    }

    // update idFollower's activityFeed with query of idFollowed
    async unfollowUser(idFollower: number, idFollowed: number) {
        await this.exists(idFollower);
        await this.exists(idFollowed);
        const first = await this.repository
            .createQueryBuilder()
            .relation(User, 'following')
            .of(idFollower)
            .remove(idFollowed);
        return true;
    }
    async unfollowCabildo(userId: number, cabildoId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(User, 'cabildos')
            .of(userId)
            .remove(cabildoId);
        return true;
    }

    async exists(userId: number) {
        let it = await this.repository.count({id: userId});
        if (!it)
            throw new NotFoundException('Could not find user.');
    }

    async pushToFeed(userId: number, activityId: number) {
         await this.repository
            .createQueryBuilder()
            .relation(User, 'activityFeed')
            .of(userId)
            .add(activityId)
        return true;
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
//        return await this.repository.findOne(
	  }
}
