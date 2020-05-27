import { createParamDecorator } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

function idFromToken(token: string) {
    if (!token)
        throw new ForbiddenException();
    const body = Buffer.from(token.split(' ')[1].split('.')[1], 'base64');
    const device_id = JSON.parse(body.toString('ascii')).device_id;
    return device_id as number;
}

export const DevId = createParamDecorator((data, req) => {
    return idFromToken(req.headers.authorization);
});
