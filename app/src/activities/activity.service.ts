import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateId } from '../utils';
import { Activity } from './activity.entity';
import { User } from '../users/users.entity';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity) private readonly repository: Repository<Activity>,
    ) {
    }

    async incPing(activityId: number, value: number) {
        // Call this when an interaction requires change in ping
        // But isn't already updating Activity Document
        // Otherwise do this inline in query
        return await this.repository.increment(
            {id: activityId},
            'ping', value);
    }

    // Activity Flow

    async insertActivity(activity: Activity) {
        const newActivity = await this.repository.create(activity);
        const result = await this.repository.save(newActivity);
        const genId = result.id;
        return genId as number;
    }

    async updateActivity(activityId: number, content: string) {
        const result = await this.repository.update(
            {id: activityId},
            { text: content },
        );
        return result;
    }

    async commentActivity(commentId: number, activityId) {
        const incP = await this.repository.increment({id: activityId}, 'ping', 1);
        const incCN = await this.repository.increment({id: activityId}, 'commentNumber', 1);
        const result = await this.repository
            .createQueryBuilder()
            .relation(Activity, 'comments')
            .of(activityId)
            .add(commentId);
        return true;
    }
    async deleteComment(commentId: number, activityId) {
        const incP = await this.repository.decrement({id: activityId}, 'ping', 1);
        const incCN = await this.repository.decrement({id: activityId}, 'commentNumber', 1);
        return true;
    }

    async getPublicFeed(userId: number, limit: number = 20, offset: number = 0) { // list all activities
        const activities = await this.repository.find({skip: offset, take: limit});
        return activities;
    }

    async getActivityById(activityId: number, userId?: number) {
        let activity;
        try {
            if (userId) {
                activity = await this.repository
                    .createQueryBuilder()
                    .select("activity")
                    .from(Activity, "activity")
                    .where("activity.id = :activityId", {activityId: activityId})
                    .leftJoinAndSelect("activity.cabildo", "cabildo")
                    .leftJoinAndSelect("activity.comments", "comments")
                    .leftJoinAndSelect("comments.replies", "replies")
                    .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", {user: userId})
                    .getOne()
            }
            else {
                activity = await this.repository
                    .createQueryBuilder()
                    .select("activity")
                    .from(Activity, "activity")
                    .where("activity.id = :activityId", {activityId: activityId})
                    .leftJoinAndSelect("activity.cabildo", "cabildo")
                    .leftJoinAndSelect("activity.comments", "comments")
                    .leftJoinAndSelect("comments.replies", "replies")
                    .leftJoinAndSelect("replies.votes", "rvotes")
                    .leftJoinAndSelect("comments.votes", "cvotes")
                    .leftJoinAndSelect("activity.votes", "votes")
                    .leftJoinAndSelect("activity.reactions", "reactions")
                    .getOne()
            }
        } catch (error) {
            throw new NotFoundException('Could not find activity.');
        }
        if (!activity) {
            throw new NotFoundException('Could not find activity.');
        }
        return activity;
    }

    async deleteActivity(activityId: number) {
        const activity = await this.repository.delete(activityId);
        if (activity === null) {
            throw new NotFoundException('Could not find activity.');
        }
        return activity;
    }

    private async findActivity(activityId: number, userId?: number) {
    }

    async exists(activityId: number) {
        await validateId(activityId);
        const it = await this.repository.count({id: activityId});
        if (!it) {
            throw new NotFoundException('Could not find reaction');
        }
    }

    // Reaction Flow

    async addReaction(
        activityId: number,
        idReaction: number,
        value: number,
    ) {
        await this.repository.increment({id: activityId}, 'score', value);
        await this.repository.increment({id: activityId}, 'ping', 1);
        await this.repository
            .createQueryBuilder()
            .relation(Activity, 'reactions')
            .of(activityId)
            .add(idReaction);
        return true;
    }

    async updateReaction(
        activityId: number,
        idReaction: number,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.repository.increment({id: activityId}, 'score', diff);
    }

    async deleteReaction(
        activityId: number,
        idReaction: number,
        oldValue: number,
    ) {
        await this.repository.decrement({id: activityId}, 'score', oldValue);
        await this.repository.increment({id: activityId}, 'ping', -1);
        await this.repository
            .createQueryBuilder()
            .relation(Activity, 'reactions')
            .of(activityId)
            .remove(idReaction);
        return true;
    }

    // Vote Flow
    async addVote(
        activityId: number,
        voteId: number,
        value: number,
    ) {
        await this.repository.increment({id: activityId}, 'score', value);
        await this.repository.increment({id: activityId}, 'ping', 1);
        await this.repository
            .createQueryBuilder()
            .relation(Activity, 'votes')
            .of(activityId)
            .add(voteId);
        return true;
    }

    async updateVote(
        activityId: number,
        voteId: number,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.repository.increment({id: activityId}, 'score', diff);
    }

    async deleteVote(
        activityId: number,
        voteId: number,
        oldValue: number,
    ) {
        await this.repository.decrement({id: activityId}, 'score', oldValue);
        await this.repository.increment({id: activityId}, 'ping', -1);
        return true;
    }

    async saveActivity(userId: number, activityId: number) {
        const ret = await this.repository
            .createQueryBuilder()
            .relation(User, 'activitySaved')
            .of(userId)
            .add(activityId);
        return true;
    }

    async unsaveActivity(userId: number, activityId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(User, 'activitySaved')
            .of(userId)
            .remove(activityId);
        return true;
    }

    async addUser(activityId: number, userId: number) {
        await this.repository
            .createQueryBuilder()
            .relation(Activity, 'savers')
            .of(activityId)
            .add(userId)
        return true;
    }

    async removeUser(activityId: number, userId: number) {
          await this.repository
            .createQueryBuilder()
            .relation(Activity, 'savers')
            .of(activityId)
            .remove(userId)
        return true;
    }
}
