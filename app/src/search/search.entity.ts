import {
	PrimaryGeneratedColumn,
	Index,
	Column,
	CreateDateColumn,
	Entity,
} from 'typeorm';

@Entity()
export class Search {

	@PrimaryGeneratedColumn('increment')
	public id: number;

	@Column()
	@Index()
	public userId: number;

	@Column()
	@Index()
	public qtype: number;

	@CreateDateColumn()
	public date: Date;

	@Column()
	public query: string;
}
