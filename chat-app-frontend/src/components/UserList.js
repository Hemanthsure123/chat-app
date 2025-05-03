import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import './UserList.css'

const UserList = () => {
  const { onlineUsers } = useContext(ChatContext);

  return (
    <div className="users-container">
      <h3 className="online-users-heading">Online Users</h3>
      {Object.entries(onlineUsers).map(([userId, status]) => (
        <div key={userId} className="flex items-center mb-2 each-online ">
          <span className={`w-3 h-3 rounded-full mr-2 ${status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className='online-users'>User {userId}</span>
        </div>
      ))}
    </div>
  );
};
export default UserList;