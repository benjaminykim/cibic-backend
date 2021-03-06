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
    public id: number; // select

    @ManyToOne(
        () => User,
        (user: User) => user.reactions,
    )
    public user: User;

    @Column()
    public userId: number;

    @ManyToOne(
        () => Activity,
        (activity: Activity) => activity.reactions,
        {onDelete: 'CASCADE'},
    )
    public activity: Activity;

    @Column()
    public activityId: number;

    @Column() // select
    public value: number;
}
