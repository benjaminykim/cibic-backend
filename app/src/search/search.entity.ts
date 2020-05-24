import {
	RelationId,
	OneToMany,
	PrimaryGeneratedColumn,
	ManyToOne,
	Index,
	Column,
	CreateDateColumn,
	Entity,
} from 'typeorm';

import { User } from '../users/users.entity';
import { Cabildo } from '../cabildos/cabildo.entity';
import { Comment } from '../activities/comment/comment.entity';
import { Reply } from '../activities/reply/reply.entity';
import { Reaction } from '../activities/reaction/reaction.entity';
import { ActivityVote, CommentVote, ReplyVote } from '../vote/vote.entity';

@Entity()
export class Search {

	@PrimaryGeneratedColumn('increment')
	public id: number;

	@Column({
		default: 0,
	})
	@Index()
	public userId: number;

	@Column({
		default: 0,
	})
	@Index()
	public qtype: number;

	@CreateDateColumn()
	public date: Date;

	@Column()
	public query: string;
}
