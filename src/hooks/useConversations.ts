import { useState, useEffect } from 'react';
import { getConversations, createConversation, updateConversation, deleteConversation, type Conversation } from '../lib/api';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations();
      setConversations(data.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ));
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }

  async function addConversation(title: string = 'New Conversation') {
    try {
      const newConv = await createConversation(title);
      setConversations([newConv, ...conversations]);
      return newConv;
    } catch (err: any) {
      console.error('Failed to create conversation:', err);
      throw err;
    }
  }

  async function editConversation(id: number, title: string) {
    try {
      const updated = await updateConversation(id, title);
      setConversations(conversations.map(c => c.id === id ? updated : c));
    } catch (err: any) {
      console.error('Failed to update conversation:', err);
      throw err;
    }
  }

  async function removeConversation(id: number) {
    try {
      await deleteConversation(id);
      setConversations(conversations.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Failed to delete conversation:', err);
      throw err;
    }
  }

  return { 
    conversations, 
    loading, 
    error, 
    addConversation, 
    editConversation, 
    removeConversation, 
    refresh: loadConversations 
  };
}