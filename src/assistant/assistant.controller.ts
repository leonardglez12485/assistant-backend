import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { ApiBody, ApiTags } from '@nestjs/swagger/dist';
import { IssueIAQuestionDto } from './dto/assistant.dto';

@ApiTags('Assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('create-threads')
  async createThread() {
    return await this.assistantService.createThread();
  }

  @Post('make-question')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        threadId: { type: 'string' },
        question: { type: 'string' },
      },
    },
  })
  async makeQuestion(@Body() dto: IssueIAQuestionDto) {
    return await this.assistantService.userQuestion(dto);
  }
}
