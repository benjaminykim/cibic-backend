import {
    ManyToOne,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Check,
} from 'typeorm';

import { User } from '../users/users.entity';
import { Activity } from '../activities/activity.entity';
import { Comment } from '../activities/comment/comment.entity';
import { Reply } from '../activities/reply/reply.entity';

@Entity()
@Check(`"value" > -2 AND "value" < 2`)
export abstract class BaseVote {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public value: number;
}

@Entity()
export class ActivityVote extends BaseVote {

    @Column()
    public userId: number;

    @ManyToOne(
        () => User,
        (user: User) => user.activityVotes,
    )
    public user: User;

    @Column()
    public activityId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.votes,
    )
    public activity: Activity;
}

@Entity()
export class CommentVote extends BaseVote {

    @Column()
    public userId: number;

    @ManyToOne(
        () => User,
        (user: User) => user.commentVotes,
    )
    public user: User;

    @Column()
    public commentId: number;

    @ManyToOne(
        () => Comment,
        (comment: Comment) => comment.votes,
    )
    public comment: Comment;
}

@Entity()
export class ReplyVote extends BaseVote {

    @Column()
    public userId: number;

    @ManyToOne(
        () => User,
        (user: User) => user.replyVotes,
    )
    public user: User;

    @Column()
    public replyId: number;

    @ManyToOne(
        () => Reply,
        (reply: Reply) => reply.votes,
    )
    public reply: Reply;
}
