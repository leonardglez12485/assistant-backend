import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import { IssueIAQuestionDto } from './dto/assistant.dto';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-case';

interface OpenAIWithHeaders extends OpenAI {
  headers: {
    [key: string]: string;
  };
}

Injectable();
export class AssistantService {
  constructor() {} //private readonly issueFunctionService: IssueFunctionService, //@InjectModel(Issue.name) private readonly issueModel: Model<IssueDocument>,
  private openai: OpenAIWithHeaders = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // headers: {
    //   'OpenAI-Beta': 'assistants=v2',
    // },
  }) as OpenAIWithHeaders;

  async createAssistant() {
    let assistant: OpenAI.Beta.Assistant;
    const assistantFilePath = './assistant.json';
    if (fs.existsSync(assistantFilePath)) {
      assistant = JSON.parse(fs.readFileSync(assistantFilePath, 'utf8'));
      // assistantId = assistant.id;
    } else {
      assistant = await this.openai.beta.assistants.create(
        {
          name: 'Issue Assistant',
          instructions: 'Yor name is Max, be cordial',
          tools: [],
          model: 'gpt-4o',
        },
        {
          headers: {
            'OpenAI-Beta': 'assistants=v2',
          },
        },
      );
      fs.writeFile(
        assistantFilePath,
        JSON.stringify(assistant, null, 2),
        (err) => {
          if (err) {
            throw new Error(err.message);
          }
        },
      );
    }
    return assistant;
  }

  async createThread(): Promise<{ id: string }> {
    return await createThreadUseCase(this.openai);
  }
  async userQuestion(questionDto: IssueIAQuestionDto): Promise<any> {
    // {
    //   role: 'user' | 'assistant';
    //   content: any[];
    // }[]
    const { question } = questionDto;
    const assistant = await this.createAssistant();
    const assitantId = assistant.id;
    const { threadId } = questionDto;
    const message = await createMessageUseCase(this.openai, {
      threadId,
      question,
    });
    const run = await createRunUseCase(this.openai, { threadId, assitantId });
    await checkCompleteStatusUseCase(this.openai, {
      threadId: threadId,
      runId: run.id,
    });
    const messages = await getMessageListUseCase(this.openai, { threadId });
    return messages.reverse();
  }
}
