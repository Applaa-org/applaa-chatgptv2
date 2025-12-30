import { useState, useEffect } from 'react';
import { getMessages, createMessage, type Message } from '../lib/api';

export function useMessages(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  async function loadMessages(convId: number) {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(convId);
      setMessages(data);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(content: string) {
    if (!conversationId || !content.trim()) return;

    try {
      // Add user message
      const userMessage = await createMessage(conversationId, 'user', content);
      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiResponse = await createMessage(
        conversationId, 
        'assistant', 
        generateMockResponse(content)
      );
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setIsTyping(false);
      throw err;
    }
  }

  return { messages, loading, error, isTyping, sendMessage, refresh: () => conversationId && loadMessages(conversationId) };
}

// Mock AI response generator
function generateMockResponse(userMessage: string): string {
  const responses = [
    "I'm a ChatGPT clone! I can help you with various tasks. What would you like to know?",
    "That's an interesting question! Let me help you with that.",
    "I understand what you're asking. Here's my response based on the information provided.",
    "Great question! I'd be happy to help you explore this topic further.",
    "I appreciate your curiosity! Let me break this down for you.",
  ];
  
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    return "Hello! I'm here to help. How can I assist you today?";
  }
  
  return responses[Math.floor(Math.random() * responses.length)] + 
    `\n\nYou asked: "${userMessage}"\n\nThis is a demo response. In a production app, this would be powered by an actual AI model like GPT-4.`;
}