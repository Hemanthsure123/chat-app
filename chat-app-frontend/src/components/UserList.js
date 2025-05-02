import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const UserList = () => {
  const { onlineUsers } = useContext(ChatContext);

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Online Users</h3>
      {Object.entries(onlineUsers).map(([userId, status]) => (
        <div key={userId} className="flex items-center mb-2">
          <span className={`w-3 h-3 rounded-full mr-2 ${status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span>User {userId}</span>
        </div>
      ))}
    </div>
  );
};
export default UserList;