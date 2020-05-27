import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './tag.entity';

@Injectable()
export class TagService {
	constructor (
		@InjectRepository(Tag) private readonly repository: Repository<Tag>,
	) {}

	async matchTag(partial: Tag) {
		return await this.repository
			.createQueryBuilder()
			.select("tag")
			.from(Tag, "tag")
			.where("tag.text like :q", {q: `${partial.text}%`})
			.getOne()
	}

	async newTag(userTag: Tag) {
		this.repository.save(userTag);
		return (userTag);
	}
}
