import {
    RelationId,
    OneToMany,
    Index,
    Column,
    CreateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Entity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.entity';
import { Comment } from '../../activities/comment/comment.entity';
import { Activity } from '../../activities/activity.entity';
import { ReplyVote } from '../../vote/vote.entity';

@Entity()
export class Reply {

    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public publishDate: Date;

    @Column({
        length: 500,
    }) // select
    public content: string;

    @Column({default: 0}) // select
    @Index()
    public score: number;

    //// Relations ////

    @ManyToOne( // select
        () => User,
        (user: User) => user.replies,
    )
    public user: User;

    @Column()
    public userId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.replies,
    )
    public activity: Activity;

    @Column()
    public activityId: number;

    @ManyToOne(
        () => Comment,
        (comment: Comment) => comment.replies,
        {onDelete: 'CASCADE'},
    )
    public comment: Comment;

    @Column()
    public commentId: number;

    @OneToMany(
        () => ReplyVote,
        (vote: ReplyVote) => vote.reply,
    )
    public votes: ReplyVote[];

    @RelationId(
        (reply: Reply) => reply.votes,
    )
    public votesIds: number[];

    @ManyToOne(
        () => User,
        (taggedUser: User) => taggedUser.taggedReplies,
        { nullable: true }
    )
    public taggedUser: User;

    @Column({nullable: true})
    public taggedUserId: number;
}
