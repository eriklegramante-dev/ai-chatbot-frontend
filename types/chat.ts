export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequestPayload {
  message: string;
}

export interface ChatResponsePayload {
  response: string;
}