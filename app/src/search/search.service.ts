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

export enum SearchTypes {
	Activities = 1,
	Cabildos = 2,
	Users = 4
}

@Injectable()
export class SearchService {

	async searchUsers(userQuery: string) {
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

	async searchActivities(userQuery: string) {
		return await getRepository(Activity)
			.createQueryBuilder()
			.select("activity")
			.from(Activity, "activity")
			.where('activity.title like :q', {q: `%${userQuery}%`})
			.orWhere('activity.text like :q', {q: `%${userQuery}%`})
			.cache(60000)
			.getMany();
	}

	async searchCabildos(userQuery: string) {
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
