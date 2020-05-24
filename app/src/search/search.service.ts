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

	async saveQuery(userQuery: string, userId: number, qtype: number) {
		const s = new Search();
		s.userId = userId;
		s.qtype = qtype;
		s.query = userQuery;
		return await this.repository.save(s);
	}

	async searchUsers(userQuery: string, userId: number) {
		const res = this.saveQuery(userQuery, userId, SearchTypes.Users);
		return await getRepository(User)
			.createQueryBuilder()
			.select("user")
			.from(User, "user")
			.where('user.firstName like :q', {q: `%${userQuery}%`})
			.orWhere('user.lastName like :q', {q: `%${userQuery}%`})
			.orWhere('user.desc like :q', {q: `%${userQuery}%`})
			.cache(60000)
			.getMany();
	}

	async searchActivities(userQuery: string, userId: number,  limit: number = 20, offset: number = 0) {
		const res = this.saveQuery(userQuery, userId, SearchTypes.Activities);
		return await getRepository(Activity)
			.createQueryBuilder()
			.select("activity")
			.from(Activity, "activity")
			.where('activity.title like :q', {q: `%${userQuery}%`})
			.orWhere('activity.text like :q', {q: `%${userQuery}%`})
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

	async searchCabildos(userQuery: string, userId: number) {
		const res = this.saveQuery(userQuery, userId, SearchTypes.Cabildos);
		return await getRepository(Cabildo)
			.createQueryBuilder()
			.select("cabildo")
			.from(Cabildo, "cabildo")
			.where('cabildo.name like :q', {q: `%${userQuery}%`})
			.orWhere('cabildo.desc like :q', {q: `%${userQuery}%`})
			.cache(60000)
			.getMany();
	}

	/*
	async getSearchResults(userQuery: string, flags: number) {
		let response;
		if ((flags & SearchTypes.Activities) == SearchTypes.Activities)
		{
			response = await getRepository(Activity)
				.find({
					where: [
						{ text: Like(`%${userQuery}%`) },
						{ title: Like(`%${userQuery}%`) },
					]
				});
		}
		else if ((flags & SearchTypes.Cabildos) == SearchTypes.Cabildos)
		{
			response = await getRepository(Cabildo)
				.find({
					where: [
						{ name: Like(`%${userQuery}%`) },
						{ location: Like(`%${userQuery}%`) },
						{ desc: Like(`${userQuery}%`) },
					]
				});
		}
		else if ((flags & SearchTypes.Users) == SearchTypes.Users)
		{
			response = await getRepository(User)
				.find({
					where: [
						{ firstName: Like(`%${userQuery}%`) },
						{ lastName: Like(`${userQuery}%`) },
						{ desc: Like(`${userQuery}%`) },
					]
				});

		}
		else
		{
			response = await getRepository(Activity)
				.createQueryBuilder()
				.select("activity")
				.from(Activity, "activity")
				.where('activity.text like :q OR activity.title like :q', {q: userQuery})
		}
	}
	*/
}
