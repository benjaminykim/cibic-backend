import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(Activity) private readonly repository: Repository<Activity>,
    ) {
    }

    async incPing(activityId: number, value: number) {
        return await this.repository.increment({id: activityId}, 'ping', value);
    }

    // Activity Flow

    async insertActivity(activity: Activity) {
        const result = await this.repository.save(activity);
        const genId = result.id;
        return genId as number;
    }

    async updateActivity(activityId: number, content: string) {
        return await this.repository.update({id: activityId}, { text: content });
    }

    async commentActivity(commentId: number, activityId) {
        await this.repository.increment({id: activityId}, 'ping', 1);
        await this.repository.increment({id: activityId}, 'comment_number', 1);
        await this.repository
            .createQueryBuilder()
            .relation(Activity, 'comments')
            .of(activityId)
            .add(commentId);
    }
    async deleteComment(commentId: number, activityId) {
        await this.repository.decrement({id: activityId}, 'ping', 1);
        await this.repository.decrement({id: activityId}, 'comment_number', 1);
        return true;
    }

    async getPublicFeed(userId: number, limit: number = 20, offset: number = 0) { // list all activities
        return await this.repository.find({skip: offset, take: limit});
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

    async exists(activityId: number) {
        if (!activityId || !await this.repository.count({id: activityId})) {
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
        await this.repository.decrement({id: activityId}, 'ping', 1);
        await this.repository
            .createQueryBuilder()
            .relation(Activity, 'reactions')
            .of(activityId)
            .remove(idReaction);
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
        await this.repository.decrement({id: activityId}, 'ping', 1);
    }
}
