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

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public publishDate: Date;

    @Column({
        length: 500,
    }) // select
    public content: string;

    @Column({ // select
        default: 0,
    })
    @Index()
    public score: number;

    //// Relations ////

    @ApiProperty()
    @ManyToOne(
        () => User,
        (user: User) => user.comments,
    )
    public user: User;

    @ApiProperty()
    @Column()
    public userId: number;

    @ApiProperty()
    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.comments,
        { onDelete: 'CASCADE' },
    )
    public activity: Activity;

    @ApiProperty()
    @Column()
    public activityId: number;

    @OneToMany(
        () => Reply,
        (reply: Reply) => reply.comment,
    )
    public replies: Reply[];

    @RelationId(
        (comment: Comment) => comment.replies,
    )
    public repliesIds: number[];

    @OneToMany(
        () => CommentVote,
        (vote: CommentVote) => vote.comment,
        {onDelete: 'CASCADE'},
    )
    public votes: CommentVote[];

    @RelationId(
        (comment: Comment) => comment.votes,
    )
    public votesIds: number[];
}
