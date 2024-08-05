import { IsString } from '@nestjs/class-validator';

export class IssueIAQuestionDto {
  @IsString()
  readonly threadId: string;

  @IsString()
  readonly question: string;
}
