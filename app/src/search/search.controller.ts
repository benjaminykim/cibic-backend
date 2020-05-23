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
import { idFromToken } from '../utils';
import { SearchService } from './search.service';

//@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Post('users')
	async reqSearchUsers(
		@Headers() header: any,
		@Body('query') query: string,
	) {
		return this.searchService.searchUsers(query);
	}

	@Post('activities')
	async reqSearchActivities(
		@Headers() header: any,
		@Body('query') query: string,
	) {
		return this.searchService.searchActivities(query);
	}

	@Post('cabildos')
	async reqSearchCabildos(
		@Headers() header: any,
		@Body('query') query: string,
	) {
		return this.searchService.searchCabildos(query);
	}

	/*@Get(':userQuery/:flags')
	async reqSearch(
		//@Headers() headers: any,
		@Param('userQuery') userQuery: string,
		@Param('flags') flags: number,
	) {
		
		return this.searchService.getSearchResults(userQuery, flags);
	}*/
}
