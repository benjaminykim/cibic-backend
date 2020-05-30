import {
	PrimaryGeneratedColumn,
	Column,
	Index,
	Entity,
        ManyToMany,
        RelationId,
        JoinTable,
} from 'typeorm';

import { Activity } from '../activities/activity.entity';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn('increment')
	public id: number;

        @Column({
            default: 0,
        })
        public count: number;

	@Column()
	public label: string;

        @RelationId(
            (tag: Tag) => tag.activities,
        )
        public activityIds: number[];

        @ManyToMany(
            () => Activity,
            (activity: Activity) => activity.tags,
            { nullable: true }
        )
        @JoinTable()
        public activities: Activity[];
}
