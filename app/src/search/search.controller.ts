import {
	Controller,
	Post,
	Body,
	Get,
	UseGuards,
	NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';

import { Search } from './search.entity';
import { UserId } from '../users/users.decorator';

export enum SearchTypes {
	Activities = 1,
	Cabildos = 2,
	Users = 4
}

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
			throw new NotFoundException('Empty search.');
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
			throw new NotFoundException('Empty search.');
		}
		search.userId = userId;
		search.qtype = SearchTypes.Activities;
		await this.searchService.saveQuery(search);
		return this.searchService.searchActivities(search);
	}

	@Post('cabildos')
	async reqSearchCabildos(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		if (!search.query || search.query == "") {
			throw new NotFoundException('Empty search.');
		}
		search.userId = userId;
		search.qtype = SearchTypes.Cabildos;
		await this.searchService.saveQuery(search);
		return this.searchService.searchCabildos(search);
	}
}
