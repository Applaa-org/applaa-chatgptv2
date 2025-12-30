import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { Loader2 } from 'lucide-react';
import type { Message } from '@/lib/api';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  currentConversationId: number | null;
}

export function ChatArea({ messages, isTyping, currentConversationId }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!currentConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            ChatGPT Clone
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Start a new conversation or select an existing one from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="min-h-full">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="w-full bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 py-6 flex gap-6">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-green-600 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}