import {
    RelationId,
    Column,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    Index,
    ManyToMany,
    JoinTable,
    Entity,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Cabildo } from '../cabildos/cabildo.entity';
import { Activity } from '../activities/activity.entity';
import { Comment } from '../activities/comment/comment.entity';
import { Reply } from '../activities/reply/reply.entity';
import { Reaction } from '../activities/reaction/reaction.entity';
import { ActivityVote, CommentVote, ReplyVote } from '../vote/vote.entity';

@Entity()
export class User {
    // always get id, cp, name
    @PrimaryGeneratedColumn() // select always
    public id: number;

    @ApiProperty()
    @Column("text", {
        default: "Ciudadano Nuevo",
    }) // select prof
    public desc: string;

    @Column({
        default: 0,
    }) // select always
    public citizenPoints: number;

    @ApiProperty()
    @Column({select: false})
    @Index({unique: true})
    public email: string;

    @ApiProperty()
    @Column({select: false})
    @Index()
    public password: string;

    @ApiProperty()
    @Column({select: false})
    public firstName: string;

    @ApiProperty()
    @Column({select: false})
    public lastName: string;

    @ApiProperty()
    @Column({select: false})
    public phone: string;

    //// Relations ////

    @ManyToMany( // select prof
        () => Cabildo,
        (cabildo: Cabildo) => cabildo.members,
    )
    @JoinTable()
    public cabildos: Cabildo[];

    @RelationId(
        (user: User) => user.cabildos,
    )
    public cabildosIds: number[];

    @ManyToMany(
        () => Cabildo,
        (cabildo: Cabildo) => cabildo.moderators,
    )
    @JoinTable()
    public moderCabildos: Cabildo[];

    @RelationId(
        (user: User) => user.moderCabildos,
    )
    public moderCabildosIds: number[];

    @OneToMany(
        () => Cabildo,
        (cabildo: Cabildo) => cabildo.admin,
    )
    @JoinColumn()
    public ownedCabildos: Cabildo[];

    @RelationId(
        (user: User) => user.ownedCabildos,
    )
    public ownedCabildosIds: number[];

    @ManyToMany( // select prof
        () => User,
        (user: User) => user.following,
    )
    public followers: User[];

    @ManyToMany(
        () => User,
        (user: User) => user.followers,
    )
    @JoinTable()
    public following: User[];

    @RelationId(
        (user: User) => user.following,
    )
    public followingIds: number[];

    @OneToMany(
        () => Activity,
        (activity: Activity) => activity.user,
    )
    @JoinColumn()
    public activityFeed: Activity[]; // Activity

    @RelationId(
        (user: User) => user.activityFeed,
    )
    public activityFeedIds: number[];

    @OneToMany(
        () => Comment,
        (comment: Comment) => comment.user,
    )
    @JoinColumn()
    public comments: Comment[];

    @RelationId(
        (user: User) => user.comments,
    )
    public commentsIds: number[];

    @OneToMany(
        () => Reply,
        (reply: Reply) => reply.user,
    )
    @JoinColumn()
    public replies: Reply[];

    @RelationId(
        (user: User) => user.replies,
    )
    public repliesIds: number[];

    @OneToMany(
        () => Reaction,
        (reaction: Reaction) => reaction.user,
    )
    @JoinColumn()
    public reactions: Reaction[];

    @RelationId(
        (user: User) => user.reactions,
    )
    public reactionsIds: number[];

    @OneToMany(
        () => ActivityVote,
        (vote: ActivityVote) => vote.user,
    )
    @JoinColumn()
    public activityVotes: ActivityVote[];

    @RelationId(
        (user: User) => user.activityVotes,
        )
    public activityVotesIds: number[];

    @OneToMany(
        () => CommentVote,
        (vote: CommentVote) => vote.user,
    )
    @JoinColumn()
    public commentVotes: CommentVote[];

    @RelationId(
        (user: User) => user.commentVotes,
        )
    public commentVotesIds: number[];

    @OneToMany(
        () => ReplyVote,
        (vote: ReplyVote) => vote.user,
    )
    @JoinColumn()
    public replyVotes: ReplyVote[];

    @RelationId(
        (user: User) => user.replyVotes,
        )
    public replyVotesIds: number[];
}
