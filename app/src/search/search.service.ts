import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, Like } from 'typeorm';
import { Search } from './search.entity'
import { User } from '../users/users.entity';
import { Activity } from '../activities/activity.entity';
import { Cabildo } from '../cabildos/cabildo.entity';
import { Tag } from '../activities/tag/tag.entity';

@Injectable()
export class SearchService {
    constructor(@InjectRepository(Search) private readonly repository: Repository<Search>) {}

    async saveQuery(s: Search) {
        return await this.repository.save(s);
    }

    async searchByTags(tags: Tag[]) {
        let ids = tags.map(({ id }) => id);
        const ret = await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity");
    }

    async searchHistory(userId: number, limit: number = 20, offset: number = 0) {
        return await getRepository(Search)
            .createQueryBuilder()
            .select("search")
            .from(Search, "search")
            .where('search.userId = :id')
            .orderBy("search.date", "DESC")
            .cache(60000)
            .skip(offset)
            .take(limit)
            .setParameter("id", userId)
            .getMany();
    }

    async searchUsers(s: Search, limit: number = 20, offset: number = 0) {
        return await getRepository(User)
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where({firstName: Like(`%${s.query}%`)})
            .cache(60000)
            .skip(offset)
            .take(limit)
            .setParameter("q", s.query)
            .printSql()
            .getMany();
    }

    async searchActivities(s: Search,  limit: number = 20, offset: number = 0) {
        return await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
        //.where('activity.title like :q')
        //.orWhere('activity.text like :q')
            .where("to_tsvector(activity.text) @@ to_tsquery(concat(quote_literal(quote_literal(:q)), ':*'))")
            .orWhere("to_tsvector(activity.title) @@ to_tsquery(concat(quote_literal(quote_literal(:q)), ':*'))")
            .leftJoinAndSelect("activity.user", "auser")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.comments", "comments")
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :userId")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId")
            .leftJoinAndSelect("comments.user", "cuser")
            .leftJoinAndSelect("comments.replies", "replies")
            .leftJoinAndSelect("comments.votes", "cvotes", "cvotes.userId = :userId")
            .leftJoinAndSelect("replies.user", "ruser")
            .leftJoinAndSelect("replies.votes", "rvotes", "rvotes.userId = :userId")
            .orderBy("activity.ping", "DESC")
            .cache(60000)
            .skip(offset)
            .take(limit)
        //.setParameter("q", `%${s.query}%`)
            .setParameter("q", s.query)
            .setParameter("userId", s.userId)
            .getMany();
    }

    async searchCabildos(s: Search, limit: number = 20, offset: number = 0) {
        return await getRepository(Cabildo)
            .createQueryBuilder()
            .select("cabildo")
            .from(Cabildo, "cabildo")
        //.where('cabildo.name like :q')
        //.orWhere('cabildo.desc like :q')
            .where("to_tsvector(cabildo.desc) @@ to_tsquery(concat(quote_literal(quote_literal(:tq)), ':*'))")
            .orWhere("to_tsvector(cabildo.name) @@ to_tsquery(concat(quote_literal(quote_literal(:tq)), ':*'))")
            .cache(60000)
            .skip(offset)
            .take(limit)
        //.setParameter("q", `%${s.query}%`)
            .setParameter("tq", s.query)
            .getMany();
    }
}
