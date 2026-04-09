import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSessionPlanDto } from './dto/create-session-plan.dto';
import { UpdateSessionPlanDto } from './dto/update-session-plan.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.sessionsService.findAll(req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.sessionsService.findOne(id, req.user.clubId);
  }

  @Post()
  create(@Body() dto: CreateSessionPlanDto, @Request() req: any) {
    return this.sessionsService.create(dto, req.user.id, req.user.clubId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSessionPlanDto, @Request() req: any) {
    return this.sessionsService.update(id, dto, req.user.clubId);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string, @Request() req: any) {
    return this.sessionsService.archive(id, req.user.clubId);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @Request() req: any) {
    return this.sessionsService.duplicate(id, req.user.id, req.user.clubId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.sessionsService.delete(id, req.user.clubId);
  }
}
