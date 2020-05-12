import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Delete,
    UseGuards,
    Headers,
    ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { idFromToken } from '../utils';
import { Cabildo } from './cabildo.entity';
import { CabildoService } from './cabildo.service';

@UseGuards(JwtAuthGuard)
@Controller('cabildo') // http://localhost:3000/cabildo
export class CabildoController {
    constructor(private readonly cabildoService: CabildoService) {}

    @Post() // http://localhost:3000/cabildo
    async addCabildo(
        @Headers() headers: any,
        @Body('cabildo') cabildo: Cabildo,
    ) {
        const userId = idFromToken(headers.authorization);
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
        @Headers() headers: any,
        @Param('cabildoId') cabildoId: number,
    ) {
        const userId = idFromToken(headers.authorization);
        return this.cabildoService.getCabildoFeed(cabildoId, userId);
    }

    @Get('profile/:cabildoId') // http://localhost:3000/cabildo/:id
    async getCabildoProfile(
        @Param('cabildoId') cabildoId: number,
    ) {
        return this.cabildoService.getCabildoProfile(cabildoId);
    }

    @Delete() // http://localhost:3000/cabildo/:id
    async deleteCabildo(
        @Headers() headers: any,
        @Body('cabildoId') cabildoId: number,
    ) {
        // We'll have to pull other data, like this id from other lists, and transfer activities to global maybe
        // Big design choice here
        const userId = idFromToken(headers.authorization);
        const idAdmin = (await this.cabildoService.getCabildoAdmin(cabildoId)).admin.id;
        console.error(userId);
        console.error(idAdmin);
        if (userId !== idAdmin)
            throw new ForbiddenException('You are not the admin of this cabildo');
        await this.cabildoService.deleteCabildo(cabildoId);
    }
}
