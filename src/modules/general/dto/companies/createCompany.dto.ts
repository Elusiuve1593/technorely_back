import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  service_of_activity: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  number_of_employees: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(120)
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
