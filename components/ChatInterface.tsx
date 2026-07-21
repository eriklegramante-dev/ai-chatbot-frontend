'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';
import { sendMessageToBackend } from '@/services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    setErrorMessage(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const replyContent = await sendMessageToBackend(content);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to reach the AI server.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      <header className="bg-gray-900 text-white p-4 font-bold text-lg">
        AI Assistant Chatbot
      </header>

      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}