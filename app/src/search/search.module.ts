import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Search } from './search.entity';
import { Tag } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Search,
            Tag,
        ]),
    ],
    controllers: [SearchController],
    providers: [
        SearchService,
        TagService,
    ],
    exports: [
        SearchService,
        TagService,
        TypeOrmModule
    ],
})
export class SearchModule {}
