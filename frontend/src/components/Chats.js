import React, { useEffect, useRef } from 'react';

export function Chats({ messages, selectedUserId }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Smooth scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="space-y-4 overflow-y-auto h-full scroll-smooth">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.senderId === selectedUserId ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === selectedUserId
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-600 text-white'
            }`}
          >
            <p>{message.message}</p>
            <p className="text-xs mt-1">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
