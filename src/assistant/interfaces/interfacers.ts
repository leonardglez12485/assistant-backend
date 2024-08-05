export interface OptionsCheckCompleteStatuas {
  threadId: string;
  runId: string;
}

export interface OptionsCreateRun {
  threadId: string;
  assitantId?: string;
}

export interface OptionsCreateMessage {
  threadId: string;
  question: string;
}

export interface OptionsMessageList {
  threadId: string;
}
