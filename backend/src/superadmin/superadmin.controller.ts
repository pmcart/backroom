import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { SuperadminService } from './superadmin.service';

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Get('clubs')
  getAllClubs() {
    return this.superadminService.getAllClubs();
  }

  @Post('impersonate')
  impersonateClub(@Body('clubId') clubId: string) {
    return this.superadminService.impersonateClub(clubId);
  }
}
