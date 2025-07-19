import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString({ message: 'Subject name must be a string' })
  @IsNotEmpty({ message: 'Subject name cannot be empty' })
  @Length(2, 100, {
    message: 'Subject name must be between 2 and 100 characters',
  })
  name?: string;

  @IsString({ message: 'Subject description must be a string' })
  @IsOptional({ message: 'Subject description is optional' })
  description?: string;
}
