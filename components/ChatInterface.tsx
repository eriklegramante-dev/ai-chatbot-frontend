"use client";

import React, { useState, useEffect, useRef } from "react";

function generateUUID(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface Message {
  sender: "user" | "assistant";
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [history, setHistory] = useState<ChatSession[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("chat_history_sessions");
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error("Erro ao carregar histórico", e);
        }
      }

      let storedSession = localStorage.getItem("chat_session_id");
      if (!storedSession) {
        storedSession = generateUUID();
        localStorage.setItem("chat_session_id", storedSession);
      }
      setSessionId(storedSession);
    }

    setMessages([
      {
        sender: "assistant",
        text: "📟 SYSTEM READY :: MATH_BOT v1.984\nHello! I am your retro-futuristic math assistant. What shall we calculate today?",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const updateHistory = (newMessages: Message[], activeSessionId: string) => {
    if (newMessages.length <= 1) return; 

    setHistory((prevHistory) => {
      const existingIndex = prevHistory.findIndex((s) => s.id === activeSessionId);
      const userFirstMsg = newMessages.find((m) => m.sender === "user")?.text || "Nova Conversa";
      const title = userFirstMsg.length > 22 ? `${userFirstMsg.slice(0, 22)}...` : userFirstMsg;

      let updated: ChatSession[];
      if (existingIndex >= 0) {
        updated = [...prevHistory];
        updated[existingIndex] = {
          ...updated[existingIndex],
          messages: newMessages,
        };
      } else {
        const newSession: ChatSession = {
          id: activeSessionId,
          title,
          messages: newMessages,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        updated = [newSession, ...prevHistory];
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("chat_history_sessions", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleNewChat = () => {
    const newId = generateUUID();
    setSessionId(newId);
    if (typeof window !== "undefined") {
      localStorage.setItem("chat_session_id", newId);
    }
    setMessages([
      {
        sender: "assistant",
        text: "📟 SYSTEM READY :: MATH_BOT v1.984\nNew session initialized. How can I help you?",
      },
    ]);
  };

  const handleSelectSession = (session: ChatSession) => {
    setSessionId(session.id);
    setMessages(session.messages);
    if (typeof window !== "undefined") {
      localStorage.setItem("chat_session_id", session.id);
    }
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter((s) => s.id !== idToDelete);
    setHistory(updatedHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("chat_history_sessions", JSON.stringify(updatedHistory));
    }

    if (idToDelete === sessionId) {
      handleNewChat();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // 1. Gera a string com o histórico ANTES da mensagem atual
    const historyString = messages
      .map((msg) => `${msg.sender === "user" ? "USER" : "ASSISTANT"}: ${msg.text}`)
      .join("\n");

    console.log("DEBUG FRONTEND HISTORY SENT:", historyString);

    // 2. Atualiza a lista local de mensagens
    const updatedMessages: Message[] = [
      ...messages,
      { sender: "user", text: userMessage },
    ];
    
    setMessages(updatedMessages);
    updateHistory(updatedMessages, sessionId);
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
          chat_history: historyString, // Passa o histórico correto
        }),
      });

      const data = await response.json();
      const finalMessages: Message[] = [
        ...updatedMessages,
        { sender: "assistant", text: data.response },
      ];
      setMessages(finalMessages);
      updateHistory(finalMessages, sessionId);
    } catch (error) {
      const errorMessages: Message[] = [
        ...updatedMessages,
        {
          sender: "assistant",
          text: "⚠️ CONNECTION ERROR :: Failed to communicate with core system.",
        },
      ];
      setMessages(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-pink-500 font-mono relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1f1a3a 1px, transparent 1px), linear-gradient(to bottom, #1f1a3a 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      <aside className="w-64 z-20 border-r-2 border-pink-500/40 bg-slate-900/90 backdrop-blur flex flex-col justify-between hidden md:flex">
        <div className="p-4 flex flex-col h-full overflow-hidden">
          <button
            onClick={handleNewChat}
            className="w-full mb-4 bg-pink-600/20 border-2 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-black font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
          >
            <span>+ NEW CHAT</span>
          </button>

          <div className="text-xs uppercase tracking-wider text-cyan-400 mb-2 border-b border-slate-800 pb-1">
            // HISTORY_LOGS
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-2">
                No past logs recorded...
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSession(item)}
                  className={`group p-2.5 rounded border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    item.id === sessionId
                      ? "bg-purple-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "bg-slate-950/50 border-pink-500/30 text-pink-400/80 hover:border-pink-500 hover:text-pink-300"
                  }`}
                >
                  <div className="truncate flex-1 mr-2">
                    <p className="font-bold truncate">{item.title}</p>
                    <span className="text-[10px] opacity-60">{item.createdAt}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-pink-500 hover:text-red-400 p-1 transition-opacity"
                    title="Delete Chat"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative z-10">
        <header className="flex items-center justify-between p-4 border-b-2 border-pink-500 bg-slate-900/80 backdrop-blur shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <h1 className="text-xl font-bold tracking-widest text-pink-500">
              SYNTH_MATH // 1984
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNewChat}
              className="text-xs bg-red-950/40 border border-red-500/60 text-red-400 hover:bg-red-600 hover:text-black px-3 py-1.5 rounded transition-all active:scale-95"
              title="Clear current screen"
            >
              CLEAR CHAT 🧹
            </button>

            <span className="text-xs text-cyan-400 border border-cyan-500/50 px-2 py-1 rounded bg-slate-950 hidden sm:inline-block">
              ID: {sessionId ? `${sessionId.slice(0, 8)}...` : "LOADING..."}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg border leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-cyan-950/40 border-cyan-500 text-cyan-300 rounded-br-none shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "bg-purple-950/40 border-pink-500 text-pink-300 rounded-bl-none shadow-[0_0_10px_rgba(236,72,153,0.15)]"
                }`}
              >
                <div className="text-[10px] uppercase opacity-60 mb-1 tracking-widest">
                  {msg.sender === "user" ? "SYSTEM_USER >" : "SYNTH_AI >"}
                </div>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-purple-950/40 border border-pink-500/50 p-3 rounded-lg text-pink-400 animate-pulse">
                <span>PROCESSING CALCULATION</span>
                <span className="inline-block animate-ping ml-1">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 bg-slate-900/90 border-t-2 border-cyan-500">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your calculation or question..."
              className="flex-1 bg-slate-950 border border-cyan-500/60 rounded-md px-4 py-3 text-cyan-300 placeholder-cyan-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-500 text-black font-bold px-6 py-3 rounded-md transition-all active:scale-95 disabled:opacity-50"
            >
              SEND ▶
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}