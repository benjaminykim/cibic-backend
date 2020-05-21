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

export class SearchService {
	async getSearchResults(userQuery: string) {
		const response = await getRepository(Activity)
			.find(
				{text: Like(`%${userQuery}%`) }
			);
		/*
		const response = await getRepository(Activity)
			.createQueryBuilder("activity")
			.where("activity.text like :query", {query: `%${userQuery}%`});
			.getMany();
		*/
		return response;
	}
}
