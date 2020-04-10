import {
    NotFoundException,
    ForbiddenException
} from '@nestjs/common';

export async function validateId(id: string) {
    if (!id || id.length !== 24 || id.indexOf('/') !== -1)
        throw new NotFoundException('Could not find entity');
}
import {  } from '@nestjs/common';

export function idFromToken(token: string) {
    if (!token)
        throw new ForbiddenException();
    const body = Buffer.from(token.split(' ')[1].split('.')[1], 'base64');
    const idUser = JSON.parse(body.toString('ascii')).id;
    if (idUser.length != 24)
        throw new ForbiddenException();
    return idUser as string;
}
