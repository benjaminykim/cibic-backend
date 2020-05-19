import {
    RelationId,
    PrimaryGeneratedColumn,
    Column,
    Index,
    ManyToMany,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Entity,
} from 'typeorm';

import { User } from '../users/users.entity';
import { Activity } from '../activities/activity.entity';

@Entity()
export class Cabildo {

    @PrimaryGeneratedColumn() // select with
    public id: number;

    @Column() // select with
    @Index({unique: true})
    public name: string;

    @Column()
    public location: string;

    @Column()
    public desc: string;

    // @Column(/*{
    //     array: true,
    // }*/)
    // public issues: string;

    // @Column(/*{
    //     array: true,
    // }*/)
    // public meetings: number; // Meeting

    // @Column({
    //     array: true,
    // })
    // public files:  string;

    //// Relations ////

    @ManyToMany(
        () => User,
        (user: User) => user.cabildos,
    )
    public members: User[];

    @RelationId(
        (cabildo: Cabildo) => cabildo.members,
    )
    public membersIds: number[];

    @ManyToMany(
        () => User,
        (user: User) => user.moderCabildos,
    )
    public moderators: User[];

    @RelationId(
        (cabildo: Cabildo) => cabildo.moderators,
    )
    public moderatorsIds: number[];

    @ManyToOne(
        () => User,
        (user: User) => user.ownedCabildos,
    )
    public admin: User;

//    @RelationId(
//        (cabildo: Cabildo) => cabildo.admin,
    //    )
    @Column()
    public adminId: number;

    @OneToMany(
        () => Activity,
        (activity: Activity) => activity.cabildo,
    )
    @JoinColumn()
    public activityFeed: Activity[];

    @RelationId(
        (cabildo: Cabildo) => cabildo.activityFeed,
    )
    public activityFeedIds: number[];
}
