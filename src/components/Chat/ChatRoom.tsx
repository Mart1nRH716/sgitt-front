import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCallback } from 'react';

interface Message {
  id: number;
  content: string;
  sender_email: string;
  sender_name: string;
  timestamp: string;
  read_by: Array<{ id: number; email: string }>;
}

interface ChatRoomProps {
  conversation: {
    id: number;
    name: string;
    participants: any[];
    is_group: boolean;
  } | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();
  const currentUserEmail = localStorage.getItem('userEmail');
  const messageQueue = useRef<Message[]>([]);

  // Función para procesar mensajes entrantes
  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages(prevMessages => {
      // Verificar si el mensaje ya existe
      const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
      if (!messageExists) {
        const updatedMessages = [...prevMessages, newMessage];
        return updatedMessages;
      }
      return prevMessages;
    });

    // Marcar como leído si es necesario
    if (newMessage.sender_email !== currentUserEmail && 
        document.visibilityState === 'visible') {
      markMessageAsRead(newMessage.id);
    }
  }, [currentUserEmail]);

  const markMessageAsRead = async (messageId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `http://localhost:8000/api/chat/messages/${messageId}/mark_as_read/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAllMessagesAsRead = async (messages: Message[]) => {
    const unreadMessages = messages.filter(message => 
      message.sender_email !== currentUserEmail &&
      !message.read_by.some(user => user.email === currentUserEmail)
    );

    for (const message of unreadMessages) {
      await markMessageAsRead(message.id);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) return;

      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:8000/api/chat/messages/?conversation_id=${conversation.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
        await markAllMessagesAsRead(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    
    // Configurar un intervalo para verificar y marcar mensajes como leídos
    const checkInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && messages.length > 0) {
        markAllMessagesAsRead(messages);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [conversation]);

  useEffect(() => {
    if (!conversation) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const websocket = new WebSocket(`ws://localhost:8000/ws/chat/${conversation.id}/`);
    
    websocket.onopen = () => {
      console.log('Connected to WebSocket');
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current.shift();
        if (message) {
          handleNewMessage(message);
        }
      }
    };

    websocket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
      const newMessage = data.message;
      // Usar una función de actualización para evitar problemas de concurrencia
      setMessages(prevMessages => {
        // Verificar si el mensaje ya existe
        const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
        if (!messageExists) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
      
      // Si el mensaje es de otro usuario y la ventana está visible, márcalo como leído
      if (newMessage.sender_email !== currentUserEmail && 
          document.visibilityState === 'visible') {
        await markMessageAsRead(newMessage.id);
      }
    }
  };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [conversation, router, currentUserEmail]);

  // Agregar listener para el evento de visibilidad del documento
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && messages.length > 0) {
        markAllMessagesAsRead(messages);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws || !conversation) return;

    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      // Enviar mensaje a través de WebSocket
      ws.send(JSON.stringify({
        message: newMessage,
        user_id: userId
      }));

      // Guardar en la base de datos y obtener la respuesta
      const response = await axios.post(
        'http://localhost:8000/api/chat/messages/',
        {
          content: newMessage,
          conversation_id: conversation.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Actualizar el estado local con el nuevo mensaje
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Selecciona una conversación para comenzar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          {conversation.is_group 
            ? conversation.name 
            : conversation.participants
                .filter(p => p.email !== localStorage.getItem('userEmail'))
                .map(p => `${p.first_name} ${p.last_name}`)
                .join(', ')}
        </h2>
        <p className="text-sm text-gray-500">
          {conversation.participants.length} participantes
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_email === localStorage.getItem('userEmail');
          return (
            <div key={message.id} className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                {!isCurrentUser && (
                  <p className="text-sm text-gray-500 mb-1">{message.sender_name}</p>
                )}
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe un mensaje..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;