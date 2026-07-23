import { ChatRequestPayload, ChatResponsePayload } from '../types/chat';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export async function sendMessageToBackend(message: string): Promise<string> {
  const payload: ChatRequestPayload = { message };

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }

  const data: ChatResponsePayload = await response.json();
  return data.response;
}