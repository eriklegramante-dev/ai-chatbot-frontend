export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequestPayload {
  session_id: string; 
  message: string;
}

export interface ChatResponsePayload {
  response: string;
}