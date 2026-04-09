import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { UpdatePlayerDto } from '../players/dto/update-player.dto';
import { CreateSquadDto } from './dto/create-squad.dto';
import { SquadsService } from './squads.service';

@Controller('squads')
@UseGuards(JwtAuthGuard)
export class SquadsController {
  constructor(private readonly squadsService: SquadsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.squadsService.findAll(req.user.clubId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  create(@Body() dto: CreateSquadDto, @Request() req: any) {
    return this.squadsService.create(dto, req.user.clubId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.squadsService.findOne(id, req.user.clubId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  deleteSquad(@Param('id') id: string, @Request() req: any) {
    return this.squadsService.deleteSquad(id, req.user.clubId);
  }

  // ── Players ────────────────────────────────────────────────────────────────

  @Get(':id/available-players')
  getAvailablePlayers(@Param('id') id: string, @Request() req: any) {
    return this.squadsService.getAvailablePlayers(id, req.user.clubId);
  }

  @Post(':id/players')
  addPlayer(@Param('id') id: string, @Body() dto: CreatePlayerDto, @Request() req: any) {
    return this.squadsService.addPlayer(id, dto, req.user.clubId);
  }

  @Post(':id/assign-player')
  assignPlayer(
    @Param('id') id: string,
    @Body() body: { playerId: string },
    @Request() req: any,
  ) {
    return this.squadsService.assignPlayer(id, body.playerId, req.user.clubId);
  }

  @Patch(':id/players/:playerId')
  updatePlayer(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
    @Body() dto: UpdatePlayerDto,
    @Request() req: any,
  ) {
    return this.squadsService.updatePlayer(id, playerId, dto, req.user.clubId);
  }

  @Delete(':id/players/:playerId')
  removePlayer(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
    @Request() req: any,
  ) {
    return this.squadsService.removePlayer(id, playerId, req.user.clubId);
  }

  @Post(':id/import')
  importPlayers(
    @Param('id') id: string,
    @Body() body: { players: CreatePlayerDto[] },
    @Request() req: any,
  ) {
    return this.squadsService.importPlayers(id, body.players, req.user.clubId);
  }

  // ── Coaches ────────────────────────────────────────────────────────────────

  @Get(':id/available-coaches')
  getAvailableCoaches(@Param('id') id: string, @Request() req: any) {
    return this.squadsService.getAvailableCoaches(id, req.user.clubId);
  }

  @Post(':id/coaches')
  addCoach(
    @Param('id') id: string,
    @Body() body: { userId: string },
    @Request() req: any,
  ) {
    return this.squadsService.addCoach(id, body.userId, req.user.clubId);
  }

  @Post(':id/coaches/new')
  createCoach(
    @Param('id') id: string,
    @Body() body: { firstName: string; lastName: string; email: string },
    @Request() req: any,
  ) {
    return this.squadsService.createCoach(id, body, req.user.clubId);
  }

  @Delete(':id/coaches/:assignmentId')
  removeCoach(
    @Param('id') id: string,
    @Param('assignmentId') assignmentId: string,
    @Request() req: any,
  ) {
    return this.squadsService.removeCoach(id, assignmentId, req.user.clubId);
  }
}
