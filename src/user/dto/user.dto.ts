import { IsNotEmpty, IsEmail, MinLength, IsDateString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  Firstname: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  @IsDateString()
  DoB: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  Firstname?: string;

  @IsOptional()
  @IsNotEmpty()
  surname?: string;

  @IsOptional()
  @IsDateString()
  DoB?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
