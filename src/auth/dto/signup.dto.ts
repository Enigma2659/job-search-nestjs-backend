import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsOptional()
  @IsString()
  Firstname?: string;

  @IsOptional()
  @IsString()
  Lname?: string;

  @IsOptional()
  @IsDateString()
  DoB?: string;

  @IsOptional()
  @IsString()
  name?: string; // for company

  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email' })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
