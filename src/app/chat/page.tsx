'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationList from '@/components/Chat/ConversationList';
import ChatRoom from '@/components/Chat/ChatRoom';
import CreateChatDialog from '@/components/Chat/CreateChatDialog';
import { Plus, ArrowLeft } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Lista de conversaciones */}
          <div 
            className={`${
              isMobile && selectedConversation ? 'hidden' : 'w-full md:w-80'
            } bg-white border-r`}
          >
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
              key={shouldRefreshList ? 'refresh' : 'normal'}
            />
          </div>
  
          {/* Área del chat */}
          <div 
            className={`${
              isMobile && !selectedConversation ? 'hidden' : 'flex-1'
            } flex flex-col overflow-hidden`}
          >
            {selectedConversation ? (
              <>
                {isMobile && (
                  <div className="p-4 bg-white border-b">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Volver a chats
                    </button>
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <ChatRoom conversation={selectedConversation} />
                </div>
              </>
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
          }}
        />
      </div>
    </Layout>
  );
};

export default ChatPage;