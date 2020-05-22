import { createParamDecorator } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

export function idFromToken(token: string) {
    if (!token)
        throw new ForbiddenException();
    const body = Buffer.from(token.split(' ')[1].split('.')[1], 'base64');
    const userId = JSON.parse(body.toString('ascii')).id;
    return userId as number;
}

export const UserId = createParamDecorator((data, req) => {
    return idFromToken(req.headers.authorization);
});
