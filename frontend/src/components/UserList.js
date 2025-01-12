import React from 'react';

import defaultProfilePicture from '../images/default profile picture.png'

export function UserList({ users, onSelectUser }) {

  const myUsername = localStorage.getItem('username');

  // Filter out the current user from the user list
  const filteredUsers = users.filter(user => user.username !== myUsername);

  return (
    <div className="h-full overflow-y-auto px-4 py-2">
      {/* If no users are available */}
      {filteredUsers.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-400 text-lg font-medium">
          No users available.
        </div>
      ) : (
        filteredUsers.map(user => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className="flex items-center p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          >
            {/* Avatar with a gradient background */}


            <img
              src={defaultProfilePicture} // Use default image if no profile picture
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            {/* User info */}
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-md text-gray-800 tracking-wide">{user.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{user.username}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
