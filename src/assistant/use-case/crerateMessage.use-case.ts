import OpenAI from 'openai';
import { OptionsCreateMessage } from '../interfaces/interfacers';

// interface Options {
//   threadId: string;
//   question: string;
// }

export const createMessageUseCase = async (
  openai: OpenAI,
  options: OptionsCreateMessage,
) => {
  const { threadId, question } = options;
  console.log(question);
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });
  return message;
};
