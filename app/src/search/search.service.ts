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

export class SearchService {
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
						{ username: Like(`%${userQuery}%`) },
						{ firstName: Like(`%${userQuery}%`) },
						{ middleName: Like(`${userQuery}%`) },
						{ lastName: Like(`${userQuery}%`) },
						{ desc: Like(`${userQuery}%`) },
					]
				});

		}
		/*
		const response = await getRepository(Activity)
			.createQueryBuilder("activity")
			.where("activity.text like :query", {query: `%${userQuery}%`});
			.getMany();
		*/
		return response;
	}
}
