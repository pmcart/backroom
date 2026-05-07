import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { SuperadminService } from './superadmin.service';
import { ProvisionService } from '../provision/provision.service';
import { AdminInputDto, OrgInputDto } from '../provision/dto/provision.dto';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

class CreateOrgDto {
  @ValidateNested() @Type(() => OrgInputDto) organization: OrgInputDto;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => AdminInputDto) admins: AdminInputDto[];
}

@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SuperAdmin)
export class SuperadminController {
  constructor(
    private readonly superadminService: SuperadminService,
    private readonly provisionService: ProvisionService,
  ) {}

  @Get('clubs')
  getAllClubs() {
    return this.superadminService.getAllClubs();
  }

  @Post('impersonate')
  impersonateClub(@Body('clubId') clubId: string) {
    return this.superadminService.impersonateClub(clubId);
  }

  @Post('provision')
  provisionClub(@Body() dto: CreateOrgDto) {
    return this.provisionService.createOrganization(dto);
  }
}
