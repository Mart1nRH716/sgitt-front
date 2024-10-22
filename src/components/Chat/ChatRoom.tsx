// src/components/Chat/ChatRoom.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  content: string;
  user_email: string;
  timestamp: string;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Conectar al WebSocket
    const websocket = new WebSocket(`ws://localhost:8000/ws/chat/general/`);
    
    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws) return;

    const userId = localStorage.getItem('userId');
    ws.send(JSON.stringify({
      message: newMessage,
      user_id: userId
    }));

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500">{message.user_email}</p>
                <div className="bg-gray-100 rounded-lg p-3 mt-1">
                  <p className="text-gray-800">{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-4 border-t">
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