import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import UserList from './UserList';
import { toast } from 'react-toastify';

const ConversationList = () => {
  const { conversations, fetchChatData, joinChat, onlineUsers } = useContext(ChatContext);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  const handleStartConversation = async (e) => {
    e.preventDefault();
    if (!selectedUserId || selectedUserId === '') {
      toast.error('Please select a user to start a conversation.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start conversation');
      }
      fetchChatData();
      setSelectedUserId('');
      toast.success('Conversation started successfully!');
    } catch (err) {
      console.error('Conversation error:', err);
      toast.error(err.message.includes('Validation') ? 'Invalid data for conversation' : err.message);
    }
  };
  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Private Conversations</h3>
      <form onSubmit={handleStartConversation} className="mb-4">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="mr-2 p-2 border rounded"
        >
          <option value="">Select a user</option>
          {Object.keys(onlineUsers).map((userId) => (
            <option key={userId} value={userId}>
              User {userId}
            </option>
          ))}
        </select>
        <button type="submit">Start Chat</button>
      </form>
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => joinChat('conversation', conv.id)}
          className="cursor-pointer p-2 hover:bg-gray-100"
        >
          Conversation with {conv.Users?.map((u) => u.email).join(', ')}
        </div>
      ))}
      <UserList />
    </div>
  );
};
export default ConversationList;