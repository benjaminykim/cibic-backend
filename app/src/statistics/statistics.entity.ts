import {
    Entity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    RelationId,
    JoinColumn,
    OneToMany,
    Index,
} from 'typeorm';

import { Activity } from '../activities/activity.entity';
import { User } from '../users/users.entity';
import { Cabildo } from '../cabildos/cabildo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../activities/comment/comment.entity';
import { Reply } from '../activities/reply/reply.entity';
import { Reaction } from '../activities/reaction/reaction.entity';
import { ActivityVote, CommentVote, ReplyVote } from '../vote/vote.entity';

@Entity()
export class Statistics {

    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public generateDate: Date;

    // Daily Active Users
    @Column({
        default: 0,
    })
    public activeUsers: number;

    // Daily Active Cabildos
    @Column({
        
        default: 0,
    })
    public activeCabildos: number;

    // Daily Active Activities
    @Column({
        default: 0,
    })
    public activeActivities: number;

    // Trending Users
    @ManyToMany(
        () => User
    )
    @JoinTable()
    public trendingUsers: User[];

    @RelationId(
        (statistics: Statistics) => statistics.trendingUsers,
    )
    public trendingUsersIds: number[];

    // Trending Cabildos
    @ManyToMany(
        () => Cabildo
    )
    @JoinTable()
    public trendingCabildos: Cabildo[];

    @RelationId(
        (statistics: Statistics) => statistics.trendingCabildos,
    )
    public trendingCabildosIds: number[];

    // Trending Activities
    @ManyToMany(
        () => Activity
    )
    @JoinTable()
    public trendingActivities: Activity[];

    @RelationId(
        (statistics: Statistics) => statistics.trendingActivities,
    )
    public trendingActivitiesIds: number[];
}
