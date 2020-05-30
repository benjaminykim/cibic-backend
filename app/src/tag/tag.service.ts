import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

import { Tag } from './tag.entity';
import { Activity } from '../activities/activity.entity';

@Injectable()
export class TagService {
	constructor (
		@InjectRepository(Tag) private readonly repository: Repository<Tag>,
	) {}

	async matchTag(partial: string) {
		return await this.repository
			.createQueryBuilder()
			.select("tag")
			.from(Tag, "tag")
			.where("tag.label ilike :q", {q: partial})
			.getOne()
	}

        async registerActivity(activityId: number, tagIds: number[]) {
            //console.log(tagIds);
            return await getRepository(Activity)
                .createQueryBuilder()
                .relation(Activity, "tags")
                .of(activityId)
                .add(tagIds);
        }

        async incrementTagCount(ids: number[]) {
            if (!ids || ids.length < 1)
                return 0;
            await getRepository(Tag)
                .createQueryBuilder()
                .update(Tag)
                .set({ count: () => 'count + 1' })
                .where("tag.id IN (:...list)", { list: ids })
                .execute();
        }

        async decrementTagCount(ids: number[]) {
            if (!ids || ids.length < 1)
                return 0;
            await getRepository(Tag)
                .createQueryBuilder()
                .update(Tag)
                .set({ count: () => 'count - 1' })
                .where("tag.id IN (:...list)", { list: ids })
                .execute();
        }

        async possibleTags(partial: string) {
		return await this.repository
			.createQueryBuilder()
			.select("tag")
			.from(Tag, "tag")
			.where("tag.label ilike :q", {q: `${partial}%`})
                        .limit(10)
                        .orderBy("tag.count", "DESC")
			.getMany()
        }

	async newTag(userTag: Tag) {
		await this.repository.save(userTag);
		return (userTag);
	}

        async constructTag(label: string) {
            let n = new Tag();
            n.label = label;
            n.count = 1;
            await this.newTag(n);
            let ret = this.matchTag(label);
            return ret;
        }

        async matchTagArray(partials: string[]) {
            let ret = [];
            var self = this;
            if (partials) {
                partials.forEach(async function(value) {
                    const tag = await self.matchTag(value);
                    if (tag) {
                        ret.push(tag.id);
                    } else {
                        let n = new Tag();
                        n.label = value;
                        n.count = 0;
                        await self.newTag(n);
                        const ntag = await self.matchTag(value);
                        ret.push(ntag.id);
                    }
                });
            }
            return (ret)
        }
}
