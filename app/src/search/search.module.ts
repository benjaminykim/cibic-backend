import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activities/activity.entity'

import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Search } from './search.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Search]),
	],
	controllers: [SearchController],
	providers: [SearchService],
	exports: [SearchService, TypeOrmModule],
})
export class SearchModule {}
