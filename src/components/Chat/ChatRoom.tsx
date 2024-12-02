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
  const [isWindowActive, setIsWindowActive] = useState(document.visibilityState === 'visible');

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
    scrollToBottom();
  };

  const handleNewMessage = useCallback((newMessage: Message) => {
    if (!conversation || newMessage.conversation_id !== conversation.id) return;

    setMessages(prevMessages => {
      const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
      if (!messageExists) {
        if (newMessage.sender_email !== currentUserEmail && isWindowActive) {
          markMessageAsRead(newMessage.id);
          scrollToBottom();
        }
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });
  }, [conversation, currentUserEmail, isWindowActive]);

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
        handleNewMessage(data.message);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed');
      setWs(null);
      
      if (!event.wasClean && wsRetries < MAX_RETRIES) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          setWsRetries(prev => prev + 1);
          connectWebSocket();
        }, Math.min(1000 * Math.pow(2, wsRetries), 10000));
      }
    };

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, 'Component unmounting');
      }
    };
  }, [conversation, router, handleNewMessage, wsRetries]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      setIsWindowActive(isVisible);
      
      if (isVisible) {
        if (messages.length > 0) {
          markAllMessagesAsRead(messages);
        }
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => setIsWindowActive(true));
    window.addEventListener('blur', () => setIsWindowActive(false));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => setIsWindowActive(true));
      window.removeEventListener('blur', () => setIsWindowActive(false));
    };
  }, [messages, connectWebSocket]);

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
        if (isWindowActive) {
          await markAllMessagesAsRead(response.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [conversation, isWindowActive, connectWebSocket]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (isWindowActive) {
      scrollToBottom();
    }
  }, [messages, isWindowActive]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

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

      setMessages(prevMessages => [...prevMessages, response.data]);
      scrollToBottom();

      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          message: newMessage,
          user_id: userId
        }));
      } else {
        connectWebSocket();
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Rest of your render code remains the same...
  // (Component return statement with JSX)

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          {conversation?.is_group 
            ? conversation.name 
            : conversation?.participants
                .filter(p => p.email !== currentUserEmail)
                .map(p => `${p.first_name} ${p.last_name}`)
                .join(', ')}
        </h2>
        <p className="text-sm text-gray-500">
          {conversation?.participants.length} participantes
        </p>
      </div>

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