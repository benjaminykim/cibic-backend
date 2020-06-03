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
import { Tag } from '../tag/tag.entity';
import { configService } from '../config/config.service';

@Injectable()
export class SearchService {
    constructor(@InjectRepository(Search) private readonly repository: Repository<Search>) {}

    async saveQuery(s: Search) {
        return await this.repository.save(s);
    }

    async searchByTag(tag: Tag, userId: number, offset: number) {
        if (!tag.activityIds)
            return [] as number[];
        return await getRepository(Activity)
            .createQueryBuilder()
            .select("activity")
            .from(Activity, "activity")
            .where("activity.id IN (:...ids)", { ids: tag.activityIds })
            .leftJoinAndSelect("activity.user", "auser")
            .leftJoinAndSelect("activity.cabildo", "cabildo")
            .leftJoinAndSelect("activity.tags", "tags")
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :userId")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId")
            .orderBy("activity.ping", "DESC")
            .cache(60000)
            .skip(offset)
            .take(configService.getFeedLimit())
            .setParameter("q", tag.label)
            .setParameter("userId", userId)
            .getMany();
    }

    async searchHistory(userId: number, offset: number) {
        return await getRepository(Search)
            .createQueryBuilder()
            .select("search")
            .from(Search, "search")
            .where('search.userId = :id')
            .orderBy("search.date", "DESC")
            .cache(60000)
            .skip(offset)
            .take(configService.getFeedLimit())
            .setParameter("id", userId)
            .getMany();
    }

    async searchUsers(s: Search, offset: number) {
        return await getRepository(User)
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.firstName ilike :q")
            .orWhere("user.lastName ilike :q")
            .cache(60000)
            .skip(offset)
            .take(configService.getFeedLimit())
            .setParameter("q", `%${s.query}%`)
            .printSql()
            .getMany();
    }

    async searchActivities(s: Search, offset: number) {
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
            .leftJoinAndSelect("activity.tags", "tags")
            .leftJoinAndSelect("activity.reactions", "reactions", "reactions.user = :userId")
            .leftJoinAndSelect("activity.votes", "votes", "votes.userId = :userId")
            .orderBy("activity.ping", "DESC")
            .cache(60000)
            .skip(offset)
            .take(configService.getFeedLimit())
        //.setParameter("q", `%${s.query}%`)
            .setParameter("q", s.query)
            .setParameter("userId", s.userId)
            .getMany();
    }

    async searchCabildos(s: Search, offset: number) {
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
            .take(configService.getFeedLimit())
        //.setParameter("q", `%${s.query}%`)
            .setParameter("tq", s.query)
            .getMany();
    }
}
