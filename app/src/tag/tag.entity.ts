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

        @Column()
        public count: number;

	@Column()
	public label: string;

        //@Column("int", { array: true, nullable: true })
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
