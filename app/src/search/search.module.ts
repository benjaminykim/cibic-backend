import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activities/activity.entity'

import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Activity]),
	],
	controllers: [SearchController],
	providers: [SearchService],
	exports: [SearchService, TypeOrmModule],
})
export class SearchModule {}
