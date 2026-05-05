import {
  IsString,
  IsObject,
  IsOptional,
  ValidateNested,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @IsString()
  @IsNotEmpty()
  carrierOfferId: string;

  @ValidateNested()
  @Type(() => AddressDto)
  senderData: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  recipientData: AddressDto;

  @IsOptional()
  @IsObject()
  additionalServices?: Record<string, unknown>;

  @IsString()
  @IsNotEmpty()
  pickupDate: string;
}
