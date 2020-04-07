import { NotFoundException } from '@nestjs/common';

export async function validateId(id: string) {
    if (id.length == 24)
        return;
    throw new NotFoundException('Could not find entity');
}
