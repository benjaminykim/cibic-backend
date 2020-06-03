import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Activity } from './activity.entity';
import { Comment } from '../activities/comment/comment.entity';
import { User } from '../users/users.entity';

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
        // centralize these magic numbers to a config file or something
        if (activity && activity.text && activity.text.length > 1500 || activity.title.length > 80)
            throw new HttpException('Payload Too Large', HttpStatus.PAYLOAD_TOO_LARGE);
        const result = await this.repository.save(activity);
        return result.id as number;
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

    async getPublicFeed(userId: number, limit: number = 20, offset: number = 0) {
        const topThree = getRepository(Comment)
            .createQueryBuilder()
            .select("comments.id")
            .from(Comment, "comments")
            .where("comments.activityId = activity.id")
            .orderBy("comments.score", "DESC")
            .take(3)
        return await this.repository
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.comments", "comments",
                               `comments.id IN (${topThree.getQuery()})`)
            .leftJoinAndSelect("comments.user", "cuser")
            .leftJoinAndSelect("comments.replies", "replies")
            .leftJoinAndSelect("replies.user", "ruser")
            .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", {userId: userId})
            .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", {userId: userId})
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", {userId: userId})
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", {user: userId})
            .leftJoinAndSelect("activity.savers", "savers", "savers.id = :user", {user: userId})
            .skip(offset)
            .take(limit)
            .getMany()
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
                    .leftJoinAndSelect("activity.user", "user")
                    .leftJoinAndSelect("activity.cabildo", "cabildo")
                    .leftJoinAndSelect("activity.comments", "comments")
                    .leftJoinAndSelect("comments.user", "cuser")
                    .leftJoinAndSelect("comments.replies", "replies")
                    .leftJoinAndSelect("replies.user", "ruser")
                    .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", {userId: userId})
                    .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", {user: userId})
                    .leftJoinAndSelect("activity.savers", "savers", "savers.id = :user", {user: userId})
                    .getOne()
            }
            else {
                activity = await this.repository
                    .createQueryBuilder()
                    .select("activity")
                    .from(Activity, "activity")
                    .where("activity.id = :activityId", {activityId: activityId})
                    .leftJoinAndSelect("activity.user", "user")
                    .leftJoinAndSelect("activity.cabildo", "cabildo")
                    .leftJoinAndSelect("activity.comments", "comments")
                    .leftJoinAndSelect("comments.user", "cuser")
                    .leftJoinAndSelect("comments.replies", "replies")
                    .leftJoinAndSelect("replies.user", "ruser")
                    .leftJoinAndSelect("replies.votes", "rvotes")
                    .leftJoinAndSelect("comments.votes", "cvotes")
                    .leftJoinAndSelect("activity.votes", "votes")
                    .leftJoinAndSelect("activity.reactions", "reactions")
                    .leftJoinAndSelect("activity.savers", "savers")
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
        reactionId: number,
        value: number,
    ) {
        await this.repository.increment({id: activityId}, 'score', value);
        await this.repository.increment({id: activityId}, 'ping', 1);
    }

    async updateReaction(
        activityId: number,
        reactionId: number,
        oldValue: number,
        newValue: number,
    ) {
        const diff: number = newValue - oldValue;
        return await this.repository.increment({id: activityId}, 'score', diff);
    }

    async deleteReaction(
        activityId: number,
        reactionId: number,
        oldValue: number,
    ) {
        await this.repository.decrement({id: activityId}, 'score', oldValue);
        await this.repository.decrement({id: activityId}, 'ping', 1);
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

    // Save Activity Flow

    async saveActivity(userId: number, activityId: number) {
        const user = await getRepository(User)
            .findOne({id: userId});
        if (user.activitySavedIds.indexOf(activityId) === -1) {
            await getRepository(User)
                .createQueryBuilder()
                .relation(User, 'activitySaved')
                .of(userId)
                .add(activityId);
        }
        else {
            throw new InternalServerErrorException("Cannot save same activity twice");
        }
    }

    async getActivitySaved(userId: number, limit: number = 20, offset: number = 0) {
        const user = await getRepository(User).findOne({id: userId})
        if (!user.activitySavedIds.length)
            return [];
        const topThree = getRepository(Comment)
            .createQueryBuilder()
            .select("comments.id")
            .from(Comment, "comments")
            .where("comments.activityId = activity.id")
            .orderBy("comments.score", "DESC")
            .take(3)
        const savfeed = await this.repository
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where("activity.id IN (:...activitySaved)", {activitySaved: user.activitySavedIds})
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.comments", "comments")
            .leftJoinAndSelect("comments.user", "cuser")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", { userId: userId})
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :user", { user: userId })
            .leftJoinAndSelect("activity.savers", "savers", "savers.id = :user", { user: userId })
            .orderBy("activity.ping", "DESC")
            .skip(offset)
            .take(limit)
            .getMany()
        return savfeed;
    }

    async unsaveActivity(userId: number, activityId: number) {
        await getRepository(User)
            .createQueryBuilder()
            .relation(User, 'activitySaved')
            .of(userId)
            .remove(activityId);
        return true;
    }
}
