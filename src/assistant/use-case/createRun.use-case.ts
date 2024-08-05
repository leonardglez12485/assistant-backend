import { OpenAI } from 'openai';
import { OptionsCreateRun } from '../interfaces/interfacers';

// interface Options {
//   threadId: string;
//   assitantId?: string;
// }

interface OpenAIWithHeaders extends OpenAI {
  headers: {
    [key: string]: string;
  };
}

export const createRunUseCase = async (
  openai: OpenAIWithHeaders,
  options: OptionsCreateRun,
) => {
  openai.headers = {
    'OpenAI-Beta': 'assistants=v2',
  };
  const { threadId, assitantId } = options;
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assitantId,
  });
  return run;
};
