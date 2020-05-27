import {
	Controller,
	Post,
	Body,
	Get,
	UseGuards,
	NotFoundException,
	HttpStatus,
	HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';

import { Search } from './search.entity';
import { UserId } from '../users/users.decorator';
import { Response } from 'express';

export enum SearchTypes {
	Activities = 1,
	Cabildos = 2,
	Users = 4
}

/*class NoContentException extends HttpException {
	constructor (
		objectOrError?: string | object | any,
		description = 'No Content',
	) {
		super(
			HttpException.createBody(
				objectOrError,
				description,
				HttpStatus.NO_CONTENT,
			),
			HttpStatus.NO_CONTENT,
		);
	}
}*/

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Post('users')
	async reqSearchUsers(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		if (!search.query || search.query == "") {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
		}
		search.userId = userId;
		search.qtype = SearchTypes.Users;
		await this.searchService.saveQuery(search);
		return this.searchService.searchUsers(search);
	}

	@Post('activities')
	async reqSearchActivities(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		if (!search.query || search.query == "") {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
		}
		search.userId = userId;
		search.qtype = SearchTypes.Activities;
		await this.searchService.saveQuery(search);
		const ret = await this.searchService.searchActivities(search);
		if (ret.length < 1)
			return ret;
		else
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
	}

	@Post('cabildos')
	async reqSearchCabildos(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		if (!search.query || search.query == "") {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
		}
		search.userId = userId;
		search.qtype = SearchTypes.Cabildos;
		await this.searchService.saveQuery(search);
		return this.searchService.searchCabildos(search);
	}
}
