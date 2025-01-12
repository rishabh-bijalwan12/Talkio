import React, { useEffect, useRef } from 'react';


// Helper function to format dates
const formatDate = (date) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Helper function to group messages by date
const groupMessagesByDate = (messages) => {
  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt).toLocaleDateString();
    if (messageDate !== currentDate) {
      groupedMessages.push({ date: message.createdAt, messages: [] });
      currentDate = messageDate;
    }
    groupedMessages[groupedMessages.length - 1].messages.push(message);
  });

  return groupedMessages;
};

export function Chats({ messages, selectedUserId }) {
  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null); // Ref for the last message

  useEffect(() => {
    // Scroll to the bottom whenever new messages arrive
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling for better UX
        block: 'end', // Aligns the last message at the bottom
      });
    }
  }, [messages]); // Trigger this whenever messages change

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={chatContainerRef}
      className="min-h-screen w-full space-y-6 overflow-y-auto p-4 bg-white rounded-xl shadow-xl scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200"
    >
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="text-center text-gray-400 text-sm py-3">
            {/* Display date header */}
            {formatDate(group.date)}
          </div>
          {group.messages.map((message, msgIndex) => (
            <div
              key={msgIndex}
              className={`flex ${message.senderId === selectedUserId ? 'justify-start' : 'justify-end'}`}
            >
              <div className="max-w-[80%]"> {/* Add max-width to avoid full width */}
                <p className={`mt-3 py-1 px-1 break-words border-2 rounded-lg shadow-md text-md text-center ${
                  message.senderId === selectedUserId
                    ? 'bg-gray-100 text-gray-800 border-gray-300'
                    : 'bg-blue-600 text-white border-blue-500'
                }`}>{message.message}</p>
                <div
                  className={`text-xs opacity-70 ${message.senderId === selectedUserId ? 'text-left' : 'text-right'}`}
                >
                  {/* Timestamp aligned based on sender */}
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              {/* Attach ref to the last message of each group */}
              {msgIndex === group.messages.length - 1 && (
                <div ref={lastMessageRef} /> // Attach ref to the last message in the group
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
