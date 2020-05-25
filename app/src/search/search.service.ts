import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';		//'@nestjs/typeorm' & 'typeorm' difference?
import { Repository, getRepository, Like } from 'typeorm';
import { Activity } from '../activities/activity.entity';
import { User } from '../users/users.entity';
import { Cabildo } from '../cabildos/cabildo.entity'
import { Search } from './search.entity'

export enum SearchTypes {
	Activities = 1,
	Cabildos = 2,
	Users = 4
}

@Injectable()
export class SearchService {
	constructor(@InjectRepository(Search) private readonly repository: Repository<Search>) {}

	async saveQuery(s: Search) {
		return await this.repository.save(s);
	}

	async searchUsers(s: Search, limit: number = 20, offset: number = 0) {
		return await getRepository(User)
			.createQueryBuilder()
			.select("user")
			.from(User, "user")
			.where('user.firstName like :q', {q: `%${s.query}%`})
			.orWhere('user.lastName like :q', {q: `%${s.query}%`})
			.orWhere('user.desc like :q', {q: `%${s.query}%`})
			.cache(60000)
			.skip(offset)
			.take(limit)
			.getMany();
	}

	async searchActivities(s: Search,  limit: number = 20, offset: number = 0) {
		return await getRepository(Activity)
			.createQueryBuilder()
			.select("activity")
			.from(Activity, "activity")
			.where('activity.title like :q', {q: `%${s.query}%`})
			.orWhere('activity.text like :q', {q: `%${s.query}%`})
			.leftJoinAndSelect("activity.cabildo", "cabildo")
			.leftJoinAndSelect("activity.comments", "comments")
			.leftJoinAndSelect("activity.reactions", "reactions")
			.leftJoinAndSelect("comments.replies", "replies")
			.leftJoinAndSelect("comments.votes", "commentVotes")
			.leftJoinAndSelect("replies.votes", "replyVotes")
			.orderBy("activity.ping", "DESC")
			.cache(60000)
			.skip(offset)
			.take(limit)
			.getMany();
	}

	async searchCabildos(s: Search, limit: number = 20, offset: number = 0) {
		return await getRepository(Cabildo)
			.createQueryBuilder()
			.select("cabildo")
			.from(Cabildo, "cabildo")
			.where('cabildo.name like :q', {q: `%${s.query}%`})
			.orWhere('cabildo.desc like :q', {q: `%${s.query}%`})
			.cache(60000)
			.skip(offset)
			.take(limit)
			.getMany();
	}
}
