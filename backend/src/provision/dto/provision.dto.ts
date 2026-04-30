import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AdminInputDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() email: string;
}

export class OrgInputDto {
  @IsString() @IsNotEmpty() name: string;
}

export class ProvisionDto {
  @IsString() @IsNotEmpty() provisionKey: string;
  @ValidateNested() @Type(() => OrgInputDto) organization: OrgInputDto;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => AdminInputDto) admins: AdminInputDto[];
}
