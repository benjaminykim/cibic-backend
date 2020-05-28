//TODO: make tsvector column in activities and create it at activity
//      at post time, so that we dont have to convert text to tsvector
//      during query

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

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	async reqSearchHistory(
		@UserId() userId: number,
	) {
		const ret = await this.searchService.searchHistory(userId);
		if (ret.length >= 1)
			return (ret);
		else
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
	}

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
		const ret = await this.searchService.searchUsers(search);
		if (ret.length >= 1)
			return ret;
		else
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
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
		if (ret.length >= 1)
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
		const ret = await this.searchService.searchCabildos(search);
		if (ret.length >= 1)
			return ret;
		else
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
	}
}
