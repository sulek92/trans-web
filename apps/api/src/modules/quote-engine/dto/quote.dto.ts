import {
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsString,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DimensionsDto {
  @IsNumber()
  @Min(1)
  @Max(300)
  length: number;

  @IsNumber()
  @Min(1)
  @Max(300)
  width: number;

  @IsNumber()
  @Min(1)
  @Max(250)
  height: number;
}

export class LocationDto {
  @IsString()
  @Matches(/^(\d{2}-\d{3}|\d{5})$/)
  postalCode: string;

  @IsEnum(['PL', 'DE'])
  country: 'PL' | 'DE';
}

export class QuoteOptionsDto {
  @IsOptional()
  @IsBoolean()
  stackable?: boolean;

  @IsOptional()
  @IsBoolean()
  fragile?: boolean;

  @IsOptional()
  @IsBoolean()
  adr?: boolean;

  @IsOptional()
  @IsBoolean()
  senderPrivate?: boolean;

  @IsOptional()
  @IsBoolean()
  recipientPrivate?: boolean;
}

export class QuoteRequestDto {
  @IsEnum(['euro', 'semi_euro', 'industrial', 'semi_industrial', 'custom'])
  palletType:
    | 'euro'
    | 'semi_euro'
    | 'industrial'
    | 'semi_industrial'
    | 'custom';

  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @IsNumber()
  @Min(1)
  @Max(1500)
  weight: number;

  @ValidateNested()
  @Type(() => LocationDto)
  sender: LocationDto;

  @ValidateNested()
  @Type(() => LocationDto)
  recipient: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => QuoteOptionsDto)
  options?: QuoteOptionsDto;
}
