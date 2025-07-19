import { IsString, IsNotEmpty, Length, IsInt, Min, Max } from 'class-validator';

export class CreateCompetencyDto {
  @IsString({ message: 'Competency name must be a string' })
  @IsNotEmpty({ message: 'Competency name is required' })
  @Length(2, 100, {
    message: 'Competency name must be between 2 and 100 characters',
  })
  name: string;

  @IsInt({ message: 'Marks must be an integer' })
  @Min(0, { message: 'Marks cannot be negative' })
  @Max(10, { message: 'Marks cannot be more than 10' })
  marks: number;
}
