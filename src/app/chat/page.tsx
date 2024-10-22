'use client';
import React from 'react';
import ChatRoom from '@/components/Chat/ChatRoom';
import NabVar from '@/components/NabVar';
import Footer from '@/components/Footer';

const ChatPage = () => {
  return (
    <main className="w-[90%] m-auto">
      <NabVar />
      <div className="my-8">
        <ChatRoom />
      </div>
      <Footer />
    </main>
  );
};

export default ChatPage;