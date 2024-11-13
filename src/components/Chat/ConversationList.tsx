import React, { useState, useEffect } from 'react';
import { UserCircle2, Users } from 'lucide-react';
import axios from 'axios';
import AuthService from '@/app/utils/authService';

interface Conversation {
  id: number;
  name: string;
  participants: any[];
  last_message: any;
  unread_count: number;
  is_group: boolean;
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation: Conversation | null;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  onSelectConversation, 
  selectedConversation 
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsNotifications, setWsNotifications] = useState<WebSocket | null>(null);

  const fetchConversations = async () => {
    try {
      const token = await AuthService.getValidToken();
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/conversations/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Error al cargar las conversaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversations = async () => {
    try {
      const token = await AuthService.getValidToken();
      if (!token) return;
  
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/conversations/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setConversations(response.data);
    } catch (error) {
      console.error('Error updating conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
    updateConversations();

    // Configurar WebSocket para notificaciones
    const wsUrl = `ws://localhost:8000/ws/notifications/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to notifications WebSocket');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'unread_count_update') {
        updateConversations();
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === data.conversation_id
              ? { ...conv, unread_count: data.unread_count }
              : conv
          )
        );
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWsNotifications(ws);

    // Actualizar conversaciones periódicamente cuando la ventana está activa
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchConversations();
      }
    }, 30000); // cada 30 segundos

    // Listener para cambios de visibilidad
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchConversations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (wsNotifications) {
        wsNotifications.close();
      }
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Actualizar contadores cuando se selecciona una conversación
  useEffect(() => {
    if (selectedConversation) {
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    }
  }, [selectedConversation]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Mensajes</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay conversaciones aún
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {conversation.is_group ? (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100">
                    <UserCircle2 className="w-8 h-8 text-purple-600" />
                  </div>
                )}
              </div>

              {/* Información de la conversación */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold truncate">
                    {conversation.is_group 
                      ? conversation.name 
                      : conversation.participants
                          .filter(p => p.email !== localStorage.getItem('userEmail'))
                          .map(p => `${p.first_name} ${p.last_name}`)
                          .join(', ')}
                  </h3>
                  {conversation.last_message && (
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.last_message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                {conversation.last_message && (
                  <p className="text-sm text-gray-500 truncate">
                    <span className="text-xs text-gray-400 mr-1">
                      {conversation.last_message.sender_email === localStorage.getItem('userEmail') 
                        ? 'Tú:' 
                        : ''}
                    </span>
                    {conversation.last_message.content}
                  </p>
                )}
              </div>

              {/* Indicador de mensajes no leídos */}
              {conversation.unread_count > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unread_count}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;