import {
    RelationId,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
    Index,
    OneToMany,
    Entity,
} from 'typeorm';

import { User } from '../../users/users.entity';
import { Activity } from '../activity.entity';
import { Reply } from '../reply/reply.entity';
import { CommentVote } from '../../vote/vote.entity';

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(
        () => User,
        (user: User) => user.comments,
    )
    public user: User;

    @RelationId(
        (comment: Comment) => comment.user,
    )
    public userId: User;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.comments,
    )
    public activity: Activity;

    @RelationId(
        (comment: Comment) => comment.activity,
    )
    public activityId: number;

    @CreateDateColumn()
    public publishDate: Date;

    @Column()
    public content: string;

    @Column({
        default: 0,
    })
    @Index()
    public score: number;

    @OneToMany(
        () => Reply,
        (reply: Reply) => reply.comment,
        {eager: true},
    )
    public replies: Reply[];

    @RelationId(
        (comment: Comment) => comment.replies,
    )
    public repliesIds: number[];

    @OneToMany(
        () => CommentVote,
        (vote: CommentVote) => vote.comment,
    )
    public votes: CommentVote[];

    @RelationId(
        (comment: Comment) => comment.votes,
    )
    public votesIds: number[];
}
