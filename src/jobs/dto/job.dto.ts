import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function isValidDdMmYyyyDate(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const match = /^([0-2]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/.exec(value);
  if (!match) {
    return false;
  }

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function IsDdMmYyyy(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDdMmYyyy',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isValidDdMmYyyyDate(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in dd/mm/yyyy format`;
        },
      },
    });
  };
}

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsDdMmYyyy({ message: 'dueDate must be dd/mm/yyyy' })
  dueDate: string;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsDdMmYyyy({ message: 'dueDate must be dd/mm/yyyy' })
  dueDate?: string;
}