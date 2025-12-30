const API_URL = 'https://haix.ai/api';

// CRITICAL: Generate unique table name to avoid conflicts
const randomString = Math.random().toString(36).substring(2, 10);
const CONVERSATIONS_TABLE = `conversations_${randomString}`;
const MESSAGES_TABLE = `messages_${randomString}`;

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

// Conversations API
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_URL}/${CONVERSATIONS_TABLE}`);
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
}

export async function createConversation(title: string): Promise<Conversation> {
  const response = await fetch(`${API_URL}/${CONVERSATIONS_TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
}

export async function updateConversation(id: number, title: string): Promise<Conversation> {
  const response = await fetch(`${API_URL}/${CONVERSATIONS_TABLE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to update conversation');
  return response.json();
}

export async function deleteConversation(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${CONVERSATIONS_TABLE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete conversation');
}

// Messages API
export async function getMessages(conversationId: number): Promise<Message[]> {
  const response = await fetch(`${API_URL}/${MESSAGES_TABLE}?conversation_id=${conversationId}`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export async function createMessage(conversationId: number, role: 'user' | 'assistant', content: string): Promise<Message> {
  const response = await fetch(`${API_URL}/${MESSAGES_TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, role, content }),
  });
  if (!response.ok) throw new Error('Failed to create message');
  return response.json();
}

// Export table names for reference
export const TABLE_NAMES = {
  conversations: CONVERSATIONS_TABLE,
  messages: MESSAGES_TABLE,
};