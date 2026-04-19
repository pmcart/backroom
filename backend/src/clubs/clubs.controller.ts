import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ClubsService } from './clubs.service';
import { UpdateClubSettingsDto } from './dto/update-club-settings.dto';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  // Both admin and coach can read settings (coach needs to know allowed plan types)
  @Get('settings')
  getSettings(@Request() req: any) {
    return this.clubsService.getSettings(req.user.clubId);
  }

  // Only admin can update settings
  @Patch('settings')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  updateSettings(@Body() dto: UpdateClubSettingsDto, @Request() req: any) {
    return this.clubsService.updateSettings(req.user.clubId, dto);
  }
}
