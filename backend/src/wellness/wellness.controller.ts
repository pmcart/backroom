import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { WellnessService } from './wellness.service';

@Controller('wellness')
@UseGuards(JwtAuthGuard)
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Post('checkin')
  create(@Body() dto: CreateCheckinDto, @Request() req: any) {
    return this.wellnessService.create(dto, req.user.id, req.user.clubId);
  }

  @Get('streak')
  getStreak(@Request() req: any) {
    return this.wellnessService.getStreak(req.user.id, req.user.clubId);
  }

  @Get('checkins')
  findByClub(@Request() req: any) {
    return this.wellnessService.findByClub(req.user.clubId);
  }
}
