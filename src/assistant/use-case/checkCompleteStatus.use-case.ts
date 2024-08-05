import OpenAI from 'openai';
import { OptionsCheckCompleteStatuas } from '../interfaces/interfacers';

interface OpenAIWithHeaders extends OpenAI {
  headers: {
    [key: string]: string;
  };
}

// interface Options {
//   threadId: string;
//   runId: string;
// }

export const checkCompleteStatusUseCase = async (
  openai: OpenAIWithHeaders,
  options: OptionsCheckCompleteStatuas,
) => {
  const { threadId, runId } = options;
  openai.headers = {
    ...openai.headers,
    'OpenAI-Beta': 'assistants=v2',
  };
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  console.log({ status: runStatus.status });
  if (runStatus.status === 'completed') {
    return runStatus;
  } // else ---- manejado de los estados... ej: fail= not action, send questions again
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await checkCompleteStatusUseCase(openai, options);
};
