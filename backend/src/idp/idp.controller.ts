import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IdpEmailService } from './idp-email.service';
import { IdpPdfService } from './idp-pdf.service';
import { AddProgressNoteDto } from './dto/add-progress-note.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { CreateIdpDto } from './dto/create-idp.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { UpdateEliteDto } from './dto/update-elite.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateSwotDto } from './dto/update-swot.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { IdpStatus } from './entities/idp.entity';
import { IdpService } from './idp.service';

@Controller('idps')
@UseGuards(JwtAuthGuard)
export class IdpController {
  constructor(
    private readonly idpService: IdpService,
    private readonly pdfService: IdpPdfService,
    private readonly emailService: IdpEmailService,
  ) {}

  // ── IDP CRUD ──────────────────────────────────────────────────────────────

  @Get()
  findAll(@Request() req: any) {
    return this.idpService.findAll(req.user.clubId);
  }

  @Get('mine')
  findMine(@Request() req: any) {
    return this.idpService.findMine(req.user.id, req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.idpService.findOne(id, req.user.clubId);
  }

  @Post()
  create(@Body() dto: CreateIdpDto, @Request() req: any) {
    return this.idpService.create(dto, req.user.clubId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.idpService.delete(id, req.user.clubId);
  }

  // ── Status ────────────────────────────────────────────────────────────────

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: IdpStatus },
    @Request() req: any,
  ) {
    return this.idpService.updateStatus(id, body.status, req.user.clubId);
  }

  // ── Goals ─────────────────────────────────────────────────────────────────

  @Post(':id/goals')
  addGoal(@Param('id') id: string, @Body() dto: CreateGoalDto, @Request() req: any) {
    return this.idpService.addGoal(id, dto, req.user.clubId);
  }

  @Patch(':id/goals/:goalId')
  updateGoal(
    @Param('id') id: string,
    @Param('goalId') goalId: string,
    @Body() dto: UpdateGoalDto,
    @Request() req: any,
  ) {
    return this.idpService.updateGoal(id, goalId, dto, req.user.clubId);
  }

  @Delete(':id/goals/:goalId')
  deleteGoal(
    @Param('id') id: string,
    @Param('goalId') goalId: string,
    @Request() req: any,
  ) {
    return this.idpService.deleteGoal(id, goalId, req.user.clubId);
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  @Patch(':id/comments')
  updateComments(@Param('id') id: string, @Body() dto: UpdateCommentsDto, @Request() req: any) {
    return this.idpService.updateComments(id, dto, req.user.clubId);
  }

  // ── Progress Notes ────────────────────────────────────────────────────────

  @Post(':id/notes')
  addProgressNote(@Param('id') id: string, @Body() dto: AddProgressNoteDto, @Request() req: any) {
    return this.idpService.addProgressNote(id, dto, req.user.clubId);
  }

  // ── Timeline ──────────────────────────────────────────────────────────────

  @Patch(':id/timeline')
  updateTimeline(@Param('id') id: string, @Body() dto: UpdateTimelineDto, @Request() req: any) {
    return this.idpService.updateTimeline(id, dto, req.user.clubId);
  }

  // ── SWOT ──────────────────────────────────────────────────────────────────

  @Patch(':id/swot')
  updateSwot(@Param('id') id: string, @Body() dto: UpdateSwotDto, @Request() req: any) {
    return this.idpService.updateSwot(id, dto, req.user.clubId);
  }

  // ── Elite fields ──────────────────────────────────────────────────────────

  @Patch(':id/elite')
  updateElite(@Param('id') id: string, @Body() dto: UpdateEliteDto, @Request() req: any) {
    return this.idpService.updateElite(id, dto, req.user.clubId);
  }

  // ── PDF ───────────────────────────────────────────────────────────────────

  @Get(':id/pdf')
  async downloadPdf(
    @Param('id') id: string,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const idp = await this.idpService.findOne(id, req.user.clubId);
    const buffer = await this.pdfService.generate(idp);
    const playerName = `${idp.player?.firstName ?? 'idp'}-${idp.player?.lastName ?? id}`
      .toLowerCase().replace(/\s+/g, '-');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${playerName}-idp.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  // ── Email ─────────────────────────────────────────────────────────────────

  @Post(':id/send-email')
  async sendEmail(
    @Param('id') id: string,
    @Body() body: { email: string },
    @Request() req: any,
  ) {
    const idp = await this.idpService.findOne(id, req.user.clubId);
    await this.emailService.sendIdpEmail(idp, body.email);
    return { success: true, message: `IDP sent to ${body.email}` };
  }
}
