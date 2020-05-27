import {
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';		//'@nestjs/typeorm' & 'typeorm' difference?
import { Repository, getRepository } from 'typeorm';
import { Search } from './search.entity'
import { User } from '../users/users.entity';
import { Activity } from '../activities/activity.entity';
import { Cabildo } from '../cabildos/cabildo.entity';

@Injectable()
export class SearchService {
	constructor(@InjectRepository(Search) private readonly repository: Repository<Search>) {}

	async saveQuery(s: Search) {
		return await this.repository.save(s);
	}

	async searchHistory(userId: number, limit: number = 20, offset: number = 0) {
		return await getRepository(Search)
			.createQueryBuilder()
			.select("search")
			.from(Search, "search")
			.where('search.userId = :id', {id: userId})
			.orderBy("search.date", "DESC")
			.cache(60000)
			.skip(offset)
			.take(limit)
			.getMany();
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
			.leftJoinAndSelect("activity.user", "auser")
			.leftJoinAndSelect("activity.cabildo", "cabildo")
			.leftJoinAndSelect("activity.comments", "comments")
			.leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :userId", { userId: s.userId })
			.leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId", { userId: s.userId })
			.leftJoinAndSelect("comments.user", "cuser")
			.leftJoinAndSelect("comments.replies", "replies")
			.leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId", { userId: s.userId })
			.leftJoinAndSelect("replies.user", "ruser")
			.leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId", { userId: s.userId })
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
