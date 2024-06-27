import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateAnswerDto {
  @IsInt()
  @Min(1)
  @Max(18)
  questionId: number;

  @IsString()
  answer: string;

  @IsString()
  userId: string;
}
