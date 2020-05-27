import {
	RelationId,
	PrimaryGeneratedColumn,
	ManyToOne,
	Column,
	Index,
	OneToMany,
	Entity,
} from 'typeorm';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn('increment')
	public id: number;

	@Column()
	public text: string;
}
