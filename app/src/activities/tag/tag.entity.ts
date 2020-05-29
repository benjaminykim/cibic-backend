import {
	RelationId,
	PrimaryGeneratedColumn,
	ManyToMany,
	Column,
	Index,
	Entity,
} from 'typeorm';

import { Activity } from '../activity.entity';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn('increment')
	public id: number;

	@Column()
	public text: string;

        @ManyToMany(type => Activity)
        activities: Activity[];
}
