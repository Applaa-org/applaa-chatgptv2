import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { ChatInput } from '@/components/ChatInput';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { toast } from 'sonner';

const Index = () => {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const { conversations, loading: convLoading, addConversation, editConversation, removeConversation } = useConversations();
  const { messages, isTyping, sendMessage } = useMessages(currentConversationId);

  // Auto-select first conversation on load
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId]);

  const handleNewConversation = async () => {
    try {
      const newConv = await addConversation('New Conversation');
      setCurrentConversationId(newConv.id);
      toast.success('New conversation started');
    } catch (error) {
      toast.error('Failed to create conversation');
    }
  };

  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      await removeConversation(id);
      if (currentConversationId === id) {
        setCurrentConversationId(conversations.length > 1 ? conversations[0].id : null);
      }
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const handleRenameConversation = async (id: number, title: string) => {
    try {
      await editConversation(id, title);
      toast.success('Conversation renamed');
    } catch (error) {
      toast.error('Failed to rename conversation');
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (!currentConversationId) {
        // Create new conversation if none exists
        const newConv = await addConversation('New Conversation');
        setCurrentConversationId(newConv.id);
      }
      
      await sendMessage(content);
      
      // Update conversation title based on first message
      if (messages.length === 0 && currentConversationId) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await editConversation(currentConversationId, title);
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (convLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />
      <div className="flex-1 flex flex-col">
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          currentConversationId={currentConversationId}
        />
        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};

export default Index;