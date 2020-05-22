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

import { User } from '../../users/users.entity';
import { Comment } from '../../activities/comment/comment.entity';
import { ReplyVote } from '../../vote/vote.entity';

@Entity()
export class Reply {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(
        () => User,
        (user: User) => user.replies,
    )
    public user: User;

    @RelationId(
        (reply: Reply) => reply.user,
    )
    public userId: number;

    @ManyToOne(
        () => Comment,
        (comment: Comment) => comment.replies,
    )
    public comment: Comment;

    @RelationId(
        (reply: Reply) => reply.comment,
    )
    public commentId: number;

    @CreateDateColumn()
    public publishDate: Date;

    @Column()
    public content: string; 

    @Column()
    @Index()
    public score: number;

    @RelationId(
        (reply: Reply) => reply.votes,
    )
    public votesIds: number[];

    @OneToMany(
        () => ReplyVote,
        (vote: ReplyVote) => vote.reply,
    )
    public votes: ReplyVote[];
    
    @ManyToOne(
        () => User,
        (taggedUser: User) => taggedUser.taggedReplies,
        { nullable: true }
    )
    public taggedUser: User;

    @Column(
        (reply: Reply) => reply.taggedUser,
    )
    public taggedUserId: number;
}