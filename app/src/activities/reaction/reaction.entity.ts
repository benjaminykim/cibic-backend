import {
    RelationId,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    Entity,
    Check,
} from 'typeorm';

import { User } from '../../users/users.entity';
import { Activity } from '../activity.entity';

@Entity()
@Check(`"value" > -3 AND "value" < 3`)
export class Reaction {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(
        () => User,
        (user: User) => user.reactions,
    )
    public user: User;

    @RelationId(
        (reaction: Reaction) => reaction.user,
    )
    public userId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.reactions,
    )
    public activity: Activity;

    @RelationId(
        (reaction: Reaction) => reaction.activity,
    )
    public activityId: number;

    @Column()
    public value: number;
}
