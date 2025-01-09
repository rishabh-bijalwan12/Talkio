import React from 'react';

export function UserList({ users, onSelectUser }) {
  
  const myUsername = localStorage.getItem('username');

  const filteredUsers = users.filter(user => user.username !== myUsername);

  return (
    <div className="h-full overflow-y-auto max-h-[550px]"> {/* Set max-height and overflow */}
      {filteredUsers.length === 0 ? (
        <p>No users available.</p>
      ) : (
        filteredUsers.map(user => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          >
            {/* Avatar with the first letter of the username */}
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-4">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Username (only visible on large screens) */}
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
