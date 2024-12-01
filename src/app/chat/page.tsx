'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationList from '@/components/Chat/ConversationList';
import ChatRoom from '@/components/Chat/ChatRoom';
import CreateChatDialog from '@/components/Chat/CreateChatDialog';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import Layout from '@/components/Layout';

interface Conversation {
  id: number;
  name: string;
  participants: any[];
  is_group: boolean;
  last_message: string;
  unread_count: number;
}

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState(false);
  const router = useRouter();

  const handleConversationCreated = (newConversation: Conversation) => {
    setIsCreateDialogOpen(false);
    setSelectedConversation(newConversation);
    setShouldRefreshList(true);
  };


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const handleAutoSelect = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const conversationId = searchParams.get('conversation');
      
      if (conversationId) {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await axios.get(
            `http://localhost:8000/api/chat/conversations/${conversationId}/`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setSelectedConversation(response.data);
        } catch (error) {
          console.error('Error al cargar la conversación:', error);
        }
      }
    };
  
    handleAutoSelect();
  }, []);

  return (

    <Layout>
    <div className="flex h-[calc(90vh-90px)]">
      {/* Chat Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Sidebar Header */}
          

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
              key={shouldRefreshList ? 'refresh' : 'normal'}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex">
          {selectedConversation ? (
            <ChatRoom conversation={selectedConversation} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <h2 className="text-xl font-semibold mb-2">Bienvenido al chat</h2>
                <p>Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Chat Dialog */}
      <CreateChatDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConversationCreated={(conversation) => {
          const fullConversation: Conversation = {
            ...conversation,
            last_message: '',
            unread_count: 0
          };
          setIsCreateDialogOpen(false);
          setSelectedConversation(fullConversation);
          setShouldRefreshList(true);
          // Aquí podrías actualizar la lista de conversaciones
        }}
      />

      {/* Footer */}
    </div>
    </Layout>
  );

};

export default ChatPage;