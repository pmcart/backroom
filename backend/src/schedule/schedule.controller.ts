import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /** GET /schedule?weekStart=YYYY-MM-DD */
  @Get()
  getByWeek(@Query('weekStart') weekStart: string, @Request() req: any) {
    return this.scheduleService.getByWeek(weekStart, req.user.clubId);
  }

  @Post()
  create(@Body() dto: CreateScheduleEntryDto, @Request() req: any) {
    return this.scheduleService.create(dto, req.user.clubId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.delete(id, req.user.clubId);
  }
}
