import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  addressLine: string;

  @IsString()
  city: string;

  @IsString()
  postalCode: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  isDefaultSender?: boolean;

  @IsBoolean()
  @IsOptional()
  isDefaultRecipient?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
