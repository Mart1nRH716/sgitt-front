import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Message {
  id: number;
  content: string;
  sender_email: string;
  sender_name: string;
  timestamp: string;
  read_by: Array<{ id: number; email: string }>;
  conversation_id: number;
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
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [wsRetries, setWsRetries] = useState(0);
  const MAX_RETRIES = 5;

  const markMessageAsRead = async (messageId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/messages/${messageId}/mark_as_read/`,
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

  const handleNewMessage = useCallback((newMessage: Message) => {
    if (!conversation || newMessage.conversation_id !== conversation.id) return;
  
    setMessages(prevMessages => {
      // Verificar si el mensaje ya existe
      const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
      if (!messageExists) {
        // Si el mensaje es de otro usuario y la ventana está visible, márcalo como leído
        if (newMessage.sender_email !== currentUserEmail && 
            document.visibilityState === 'visible') {
          markMessageAsRead(newMessage.id);
        }
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });
  }, [conversation, currentUserEmail]);

  const connectWebSocket = useCallback(() => {
    if (!conversation || wsRef.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversation.id}/?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWs(ws);
      setWsRetries(0);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        const newMessage = data.message;
        setMessages(prevMessages => {
          // Verificar si el mensaje ya existe
          const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
          if (!messageExists) {
            // Si el mensaje es de otro usuario y la ventana está visible, márcalo como leído
            if (newMessage.sender_email !== currentUserEmail && 
                document.visibilityState === 'visible') {
              markMessageAsRead(newMessage.id);
            }
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setWs(null);
      
      // Intentar reconectar si no hemos excedido el máximo de intentos
      if (wsRetries < MAX_RETRIES) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          setWsRetries(prev => prev + 1);
          connectWebSocket();
        }, Math.min(1000 * Math.pow(2, wsRetries), 10000)); // Backoff exponencial
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [conversation, router, handleNewMessage, wsRetries]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) return;
      
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/messages/?conversation_id=${conversation.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
        await markAllMessagesAsRead(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [conversation, connectWebSocket]);

  

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (messages.length > 0) {
          markAllMessagesAsRead(messages);
        }
        // Reconectar WebSocket si es necesario
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          connectWebSocket();
        }
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [messages, ws, connectWebSocket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;
  
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
  
      // Primero guardar el mensaje en la base de datos
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/messages/`,
        {
          content: newMessage,
          conversation_id: conversation.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // Añadir el mensaje al estado local inmediatamente
      setMessages(prevMessages => [...prevMessages, response.data]);
  
      // Enviar mensaje a través de WebSocket si está conectado
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          message: newMessage,
          user_id: userId
        }));
      } else {
        console.log('WebSocket not connected, reconnecting...');
        connectWebSocket();
      }
  
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
                .filter(p => p.email !== currentUserEmail)
                .map(p => `${p.first_name} ${p.last_name}`)
                .join(', ')}
        </h2>
        <p className="text-sm text-gray-500">
          {conversation.participants.length} participantes
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => {
          const isCurrentUser = message.sender_email === currentUserEmail;
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