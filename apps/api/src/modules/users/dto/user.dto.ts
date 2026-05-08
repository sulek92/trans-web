import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['admin', 'customer', 'superadmin'])
  @IsOptional()
  role?: 'admin' | 'customer' | 'superadmin';

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}

export class BulkUpdateUserStatusDto {
  @IsString({ each: true })
  ids: string[];

  @IsEnum(['ACTIVE', 'PENDING', 'BLOCKED'])
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
}
