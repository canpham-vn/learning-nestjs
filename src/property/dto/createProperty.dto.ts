import {
  IsInt,
  IsNegative,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @Length(2, 10, { message: 'error on length!' })
  name: string;

  // the groups doesn't work on global validation
  // just the first one will be applied
  @IsString()
  // @Length(2, 10, { groups: ['create'] })
  // @Length(1, 15, { groups: ['update'] })
  description: string;

  @IsInt()
  @IsPositive()
  // @IsOptional()
  price: number;
}
