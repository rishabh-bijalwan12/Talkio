import React, { useState, useEffect, useRef } from 'react';
import { UserList } from '../components/UserList';
import { Chats } from '../components/Chats';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import defaultProfilePicture from '../images/default profile picture.png'


export function Home() {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingSendMsg, setLoadingSendMsg] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const [isSelected, setIsSelected] = useState(false);
  const [createdAt, setCreatedAt] = useState();


  const navigate = useNavigate();
  const socket = useRef();

  const currUser = localStorage.getItem('_id');

  // Establishing socket connection
  useEffect(() => {
    if (currUser) {
      socket.current = io('https://talkio-cy0z.onrender.com');
      socket.current.emit('add-user', currUser);
    }
  }, [currUser]);

  // Responsive design: Adjust screen size
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth < 768 ? 'small' : 'large');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setLoadingUser(true);
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://talkio-cy0z.onrender.com/api/auth/users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chats for selected user
  const selectedUser = users.find((user) => user._id === selectedUserId);
  useEffect(() => {
    if (!selectedUserId) return;
    setLoadingChat(true);
    const fetchChats = async () => {
      try {
        const response = await fetch(`https://talkio-cy0z.onrender.com/api/message/getmessage/${selectedUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setChats(data.conversation?.messages || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoadingChat(false);
      }
    };
    fetchChats();
  }, [selectedUserId]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        setLoadingSendMsg(true);
        const response = await fetch(`https://talkio-cy0z.onrender.com/api/message/sendmessage/${selectedUserId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ message: newMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          setCreatedAt(data.createdAt);
          const newMessageObject = { message: newMessage, senderId: currUser, createdAt: data.createdAt };
          setChats((prevChats) => [...prevChats, newMessageObject]); // Add to chat

          // Emit the message to the socket
          socket.current.emit('send-msg', {
            to: selectedUserId,
            from: currUser,
            message: newMessage,
          });

          setNewMessage(''); // Clear the message input
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setLoadingSendMsg(false);
    }
  };


  // Listen for incoming messages via socket
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recived', (msg) => {
        setArrivalMsg(msg);
      });
    }
  }, []);

  // Update chat with new message arrival
  useEffect(() => {
    if (arrivalMsg) {
      setChats((prevChats) => [
        ...prevChats,
        { message: arrivalMsg.message, senderId: arrivalMsg.senderId, createdAt: arrivalMsg.createdAt }
      ]);
    }
  }, [arrivalMsg]);

  const handleProfileClick = () => {
    navigate('/userprofile');
  }

  return (
    <div style={{backgroundColor:"#2c2c2c"}} className="flex flex-row justify-center items-center ">
      <div className=" rounded-lg shadow-md w-full max-w-5xl">
        <div className="h-screen flex flex-row">
          {/* Left Sidebar - User List */}
          <div style={{backgroundColor:"#EFF3EA"}}
            className={
              isSelected && screenSize === "small"
                ? "hidden"
                : "w-full md:w-2/5 lg:w-2/6 border-b lg:border-r flex flex-col h-5/6 mt-12"
            }
          >
            {/* Header */}
            <div className="p-4 border-b border-FFE2E2 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            </div>

            {/* User List or Loading State */}
            {loadingUser ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Loading...
              </div>
            ) : (
              <UserList
                users={users}
                onSelectUser={(userId) => {
                  setSelectedUserId(userId);
                  setIsSelected(true);
                }}
              />
            )}

            {/* Footer */}
            <div
             className="mt-auto p-4 flex items-center space-x-4">
              <button
                onClick={handleProfileClick}
                style={{backgroundColor:"#3D3D3D"}}
                className="bg-black-800 w-96 text-white px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Profile
              </button>
            </div>
          </div>

          {/* Right Side - Chat Area */}
          <div style={{backgroundColor:"#F8FAFC"}}
            className={
              screenSize === "small" && !isSelected
                ? "hidden"
                : "w-full md:w-4/5 lg:w-3/4 flex-1 flex flex-col h-5/6 mt-12"
            }
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-FFE2E2 flex items-center justify-between bg-FFFDEC">
                  <div className="flex items-center">
                    {/* Profile Images */}
                    <img
                      src={defaultProfilePicture} // Use default image if no profile picture
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">
                      {selectedUser.name}
                    </h3>
                  </div>
                  {screenSize === "small" && (
                    <button
                      onClick={() => setIsSelected(false)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    >
                      Back
                    </button>
                  )}
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-auto bg-F5EFFF">
                  {loadingChat ? (
                    <div className="text-center text-gray-500">Loading Chats...</div>
                  ) : chats.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet</p>
                  ) : (
                    <Chats messages={chats} selectedUserId={selectedUserId} />
                  )}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-FFE2E2 bg-FFFDEC"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message"
                      className="flex-1 px-4 py-2 border border-FFCFCF rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      className={`p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500  `}
                    >
                      {!loadingSendMsg ? 'Send' : 'wait...'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-F5EFFF">
                <p className="text-gray-500">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
