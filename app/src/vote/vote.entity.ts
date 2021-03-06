import {
    ManyToOne,
    RelationId,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Check,
} from 'typeorm';
import {
    ApiProperty,
    ApiBody,
} from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { Activity } from '../activities/activity.entity';
import { Comment } from '../activities/comment/comment.entity';
import { Reply } from '../activities/reply/reply.entity';

@Entity()
@Check(`"value" > -2 AND "value" < 2`)
export abstract class BaseVote { // select these
    @ApiProperty()
    @PrimaryGeneratedColumn()
    public id: number;

    @ApiProperty()
    @Column()
    public value: number;
}

@Entity()
export class ActivityVote extends BaseVote {

    @ApiProperty()
    @Column()
    public userId: number;

    @ManyToOne(
        () => User,
        (user: User) => user.activityVotes,
    )
    public user: User;

    @ApiProperty()
    @Column()
    public activityId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.votes,
        {onDelete: 'CASCADE'},
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
        {onDelete: 'CASCADE'}
    )
    public comment: Comment;

    @Column()
    public activityId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.commentVotes,
    )
    public activity: Activity;
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
        {onDelete: 'CASCADE'},
    )
    public reply: Reply;

    @Column()
    public activityId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.replyVotes,
    )
    public activity: Activity;
}
