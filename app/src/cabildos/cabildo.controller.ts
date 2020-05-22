import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Delete,
    UseGuards,
} from '@nestjs/common';

import { Cabildo } from './cabildo.entity';
import { CabildoService } from './cabildo.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../users/users.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cabildo') // http://localhost:3000/cabildo
export class CabildoController {
    constructor(private readonly cabildoService: CabildoService) {}

    @Post() // http://localhost:3000/cabildo
    async addCabildo(
        @UserId() userId: number,
        @Body('cabildo') cabildo: Cabildo,
    ) {
        cabildo.adminId = userId;
        const generatedId = await this.cabildoService.insertCabildo(cabildo);
        return { id: generatedId };
    }

    @Get() // http://localhost:3000/cabildo
    async getAllCabildos() {
        return await this.cabildoService.getAllCabildos();
    }

    @Get('check/:cabildoName') // http://localhost:3000/cabildo/check/:name
    async checkCabildoName(
        @Param('cabildoName') cabildoName: string,
    ) {
        if (await this.cabildoService.checkCabildoName(cabildoName))
            return cabildoName
        return "Could not find ${cabildoName}";
    }

    @Get('feed/:cabildoId') // http://localhost:3000/cabildo/feed/:id
    async getCabildoFeed(
        @UserId() userId: number,
        @Param('cabildoId') cabildoId: number,
    ) {
        return this.cabildoService.getCabildoFeed(cabildoId, userId);
    }

    @Get('profile/:cabildoId') // http://localhost:3000/cabildo/:id
    async getCabildoProfile(
        @Param('cabildoId') cabildoId: number,
    ) {
        return this.cabildoService.getCabildoProfile(cabildoId);
    }

    @Delete(':cabildoId') // http://localhost:3000/cabildo/:id
    async deleteCabildo(
        @UserId() userId: number,
        @Param('cabildoId') cabildoId: number,
    ) {
        // We'll have to pull other data, like this id from other lists, and transfer activities to global maybe
        // Big design choice here
        await this.cabildoService.exists(cabildoId);
        await this.cabildoService.verifyCabildoAdmin(cabildoId, userId)
        await this.cabildoService.deleteCabildo(cabildoId);
    }
}
