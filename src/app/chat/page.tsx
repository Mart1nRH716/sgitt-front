'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationList from '@/components/Chat/ConversationList';
import ChatRoom from '@/components/Chat/ChatRoom';
import CreateChatDialog from '@/components/Chat/CreateChatDialog';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  id: number;
  name: string;
  participants: any[];
  is_group: boolean;
}

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center bg-white">
            <Link href="/home" className="flex items-center gap-2 hover:opacity-80">
              <h1 className="text-xl font-bold text-oscure">
                SGI<span className="text-secondary">TT</span>
              </h1>
            </Link>
            <h1 className="text-xl font-semibold ml-2">| Chat</h1>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Nueva conversación"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
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
        onConversationCreated={() => {
          setIsCreateDialogOpen(false);
          // Aquí podrías actualizar la lista de conversaciones
        }}
      />

      {/* Footer */}
      <div className="bg-white border-t py-2 px-4 text-center text-sm text-gray-500">
        © 2024 SGITT. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default ChatPage;