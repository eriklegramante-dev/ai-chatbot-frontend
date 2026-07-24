'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { sendMessageToBackend } from '@/services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ThemeToggle from './ThemeToggle';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('chat_session_id');
    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID();
      localStorage.setItem('chat_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const handleSendMessage = async (content: string) => {
    setErrorMessage(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const replyContent = await sendMessageToBackend(content, sessionId);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Falha ao conectar com o servidor.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-h-[750px] w-full max-w-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
            ✦
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-none">Math Assistant</h1>
            <span className="text-xs text-slate-400 font-medium">Powered by CrewAI & Groq</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => setMessages([])} 
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Limpar
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border-b border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-300 px-6 py-2.5 text-xs font-medium flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold text-sm hover:opacity-75">×</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center text-xl font-bold">
              ∑
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Olá! Como posso te ajudar com cálculos hoje?</p>
            <span className="text-xs text-slate-400 dark:text-slate-500">Ex: "Quanto é 15 * 4?" ou "Subtraia por 2"</span>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

    </div>
  );
}