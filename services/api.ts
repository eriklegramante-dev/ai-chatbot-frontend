import { ChatRequestPayload, ChatResponsePayload } from '@/types/chat';

export async function sendMessageToBackend(
  message: string,
  sessionId: string
): Promise<string> {
  const payload: ChatRequestPayload = {
    session_id: sessionId,
    message,
  };

  const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }

  const data: ChatResponsePayload = await response.json();
  return data.response;
}