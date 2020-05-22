import {
    RelationId,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToOne,
    Index,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
} from 'typeorm';

import { User } from '../users/users.entity';
import { Cabildo } from '../cabildos/cabildo.entity';
import { Comment } from './comment/comment.entity';
import { Reply } from './reply/reply.entity';
import { Reaction } from './reaction/reaction.entity';
import { ActivityVote, CommentVote, ReplyVote } from '../vote/vote.entity';

export enum ActivityType {'discussion', 'proposal', 'poll'}

@Entity()
export class Activity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ // select
        type: 'enum',
        enum: ActivityType,
    })
    public activityType: ActivityType;

    @Column({ // select
        default: 0,
    })
    @Index()
    public score: number;

    @Column({ // select
        default: 0,
    })
    @Index()
    public ping: number;

    @Column({ // select
        default: 0,
    })
    public comment_number: number;

    @CreateDateColumn() // select
    public publishDate: Date;

    @Column() // select
    public title: string;

    @Column() // select
    public text: string;

    //// Relations ////

    @ManyToOne( // select
        () => User,
        (user: User) => user.activityFeed,
    )
    public user: User; // User

    @RelationId(
        (activity: Activity) => activity.user,
    )
    public userId: number;

    @ManyToOne( // select
        () => Cabildo,
        (cabildo: Cabildo) => cabildo.activityFeed,
        {eager: true},
    )
    public cabildo: Cabildo;

    @RelationId(
        (activity: Activity) => activity.cabildo,
    )
    @Column({select: false})
    public cabildoId: number;

    @OneToMany(
        () => Comment,
        (comment: Comment) => comment.activity,
        {eager: true},
    )
    public comments: Comment[];

    @RelationId(
        (activity: Activity) => activity.comments,
    )
    public commentsIds: number[];

    @OneToMany(
        () => Reply,
        (reply: Reply) => reply.activity,
    )
    public replies: Reply[];

    @RelationId(
        (activity: Activity) => activity.replies,
    )
    public repliesIds: number[];

    @OneToMany(
        () => Reaction,
        (reaction: Reaction) => reaction.activity,
    )
    public reactions: Reaction[];

    @RelationId(
        (activity: Activity) => activity.reactions,
    )
    public reactionsIds: number[];

    @OneToMany(
        () => ActivityVote,
        (vote: ActivityVote) => vote.activity,
    )
    public votes: ActivityVote[];

    @RelationId(
        (activity: Activity) => activity.votes,
    )
    public votesIds: number[];

    @OneToMany(
        () => CommentVote,
        (vote: CommentVote) => vote.comment,
    )
    public commentVotes: CommentVote[];

    @RelationId(
        (activity: Activity) => activity.commentVotes,
    )
    public commentVotesIds: number[];

    @OneToMany(
        () => ReplyVote,
        (vote: ReplyVote) => vote.reply,
    )
    public replyVotes: ReplyVote[];

    @RelationId(
        (activity: Activity) => activity.replyVotes,
    )
    public replyVotesIds: number[];

    @ManyToMany(
      () => User,
      (user: User) => user.activitySaved,
    )
    public savers: User[];

    @RelationId(
      (activity: Activity) => activity.savers,
    )
    public saversIds: number[];
}

// Rough example, needs to be fitted to Activity and checked with frontend exposed API,
// Then repeated for every other entity.
// After that, DTO methods have to be propogated across damn near everything
// Then we set up typeorm migrations, cert renewal, and we're done.
// Don't forget to install the three things from the tutorial, docker-start shell.
// Check out authgaurd adding user field as well, mentioned in SO question in a tab somewhere.
