import OpenAI from 'openai';
import { OptionsMessageList } from '../interfaces/interfacers';

interface OpenAIWithHeaders extends OpenAI {
  headers: {
    [key: string]: string;
  };
}

// interface Options {
//   threadId: string;
// }

export const getMessageListUseCase = async (
  openai: OpenAIWithHeaders,
  options: OptionsMessageList,
) => {
  openai.headers = {
    ...openai.headers,
    'OpenAI-Beta': 'assistants=v2',
  };
  const { threadId } = options;
  const messageList = await openai.beta.threads.messages.list(threadId);
  const messages = messageList.data.map((message) => ({
    role: message.role,
    content: message.content.map((content) => (content as any).text.value),
  }));
  return messages;
};
