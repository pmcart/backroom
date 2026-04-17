import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpsertMethodologyDto } from './dto/upsert-methodology.dto';
import { MethodologyService } from './methodology.service';

@Controller('methodology')
@UseGuards(JwtAuthGuard)
export class MethodologyController {
  constructor(private readonly methodologyService: MethodologyService) {}

  @Get()
  get(@Request() req: any) {
    return this.methodologyService.get(req.user.clubId);
  }

  @Put()
  upsert(@Body() dto: UpsertMethodologyDto, @Request() req: any) {
    return this.methodologyService.upsert(dto, req.user.clubId);
  }
}
