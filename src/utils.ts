import { NotFoundException } from '@nestjs/common';

export function Callback(err: any, data: any) {
    if (err) {
        console.error(`Error: ${err}`);
    } else {
        //console.log(`Success: ${data}`);
    }
}

export async function validateId(id: string) {
    if (id.length == 24)
        return;
    throw new NotFoundException('Could not find entity');
}
