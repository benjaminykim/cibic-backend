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
import { Reaction } from './reaction/reaction.entity';
import { ActivityVote } from '../vote/vote.entity';

export enum ActivityType {'discussion', 'proposal', 'poll'}

@Entity()
export class Activity {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(
        () => User,
        (user: User) => user.activityFeed,
    )
    public user: User; // User

    @RelationId(
        (activity: Activity) => activity.user,
    )
    public userId: number;

    @ManyToOne(
        () => Cabildo,
        (cabildo: Cabildo) => cabildo.activityFeed,
        {eager: true},
    )
    public cabildo: Cabildo; // Cabildo

    @RelationId(
        (activity: Activity) => activity.cabildo,
    )
    public cabildoId: number;

    @Column({
        type: 'enum',
        enum: ActivityType,
    })
    public activityType: ActivityType;

    @Column({
        default: 0,
    })
    @Index()
    public score: number;

    @Column({
        default: 0,
    })
    @Index()
    public ping: number;

    @Column({
        default: 0,
    })
    public commentNumber: number;

    @CreateDateColumn()
    public publishDate: Date;

    @Column()
    public title: string;

    @Column()
    public text: string;

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
