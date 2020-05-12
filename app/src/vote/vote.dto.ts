
import { ApiProperty } from '@nestjs/swagger';
import { ActivityVote } from './vote.entity';

export class ActivityVoteDTO implements Readonly<ActivityVoteDTO> {
    @ApiProperty({ required: true })
    id: number;

    @ApiProperty({ required: true })
    value: number;

    @ApiProperty({ required: true })
    userId: number;

    @ApiProperty({ required: true })
    activityId: number;


    public static from(dto: Partial<ActivityVoteDTO>) {
        const it = new ActivityVoteDTO();
        it.id = dto.id;
        it.value = dto.value;
        it.userId = dto.userId;
        it.activityId = dto.activityId;
        return it;
    }

    public static fromEntity(entity: ActivityVote) {
        return this.from({
            id: entity.id,
            value: entity.value,
            userId: entity.userId,
            activityId: entity.activityId,
        });
    }

    public toEntity() {
        const it = new ActivityVote();
        it.id = this.id;
        it.value = this.value;
        it.userId = this.userId;
        it.activityId = this.activityId;
        return it;
    }
}
