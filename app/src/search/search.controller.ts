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

	@Get()
	async emptySearch() {
		return "NO SEARCH REQUESTED";
	}
	@Get(':userQuery/:flags')
	async reqSearch(
		//@Headers() headers: any,
		@Param('userQuery') userQuery: string,
		@Param('flags') flags: number,
	) {
		
		return this.searchService.getSearchResults(userQuery, flags);
	}
}
