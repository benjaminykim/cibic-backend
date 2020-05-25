import {
	Controller,
	Post,
	Body,
	Param,
	Get,
	Delete,
	UseGuards,
	Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';

import { Search } from './search.entity';
import { UserId } from '../users/users.decorator';

//@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Post('users')
	async reqSearchUsers(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		search.userId = userId;
		search.qtype = 4;
		await this.searchService.saveQuery(search);
		return this.searchService.searchUsers(search);
	}

	@Post('activities')
	async reqSearchActivities(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		search.userId = userId;
		search.qtype = 1;
		await this.searchService.saveQuery(search);
		return this.searchService.searchActivities(search);
	}

	@Post('cabildos')
	async reqSearchCabildos(
		@UserId() userId: number,
		@Body('search') search: Search,
	) {
		search.userId = userId;
		search.qtype = 2;
		await this.searchService.saveQuery(search);
		return this.searchService.searchCabildos(search);
	}
}
