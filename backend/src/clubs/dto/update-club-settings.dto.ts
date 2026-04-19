import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

class CoachPermissionsDto {
  @IsBoolean() @IsOptional() canCreateSingleSession?:  boolean;
  @IsBoolean() @IsOptional() canCreateWeeklyPlan?:     boolean;
  @IsBoolean() @IsOptional() canCreateMultiWeekBlock?: boolean;
  @IsBoolean() @IsOptional() canCreateSeasonPlan?:     boolean;
  @IsBoolean() @IsOptional() canEditAdminPlans?:       boolean;
  @IsBoolean() @IsOptional() canDeleteOwnPlans?:       boolean;
}

export class UpdateClubSettingsDto {
  @ValidateNested()
  @Type(() => CoachPermissionsDto)
  coachPermissions: CoachPermissionsDto;
}
