import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <ChatInterface />
    </main>
  );
}