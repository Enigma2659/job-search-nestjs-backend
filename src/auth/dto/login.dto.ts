import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email' })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
