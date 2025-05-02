import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RoomList from '../components/RoomList';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto">
      <div className="chat-container">
        <div className="sidebar">
          <RoomList />
          <ConversationList />
        </div>
        <ChatWindow />
      </div>
    </div>
  );
};
export default Dashboard;