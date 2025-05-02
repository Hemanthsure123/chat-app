import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';

const RoomList = () => {
  const { rooms, fetchChatData, joinChat } = useContext(ChatContext);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]); // Add fetchChatData to dependencies

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    await fetch(`${process.env.REACT_APP_API_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ name: newRoomName }),
    });
    setNewRoomName('');
    fetchChatData();
  };

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Public Rooms</h3>
      <form onSubmit={handleCreateRoom} className="mb-4">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
          className="mr-2"
        />
        <button type="submit">Create Room</button>
      </form>
      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => joinChat('room', room.id)}
          className="cursor-pointer p-2 hover:bg-gray-100"
        >
          {room.name}
        </div>
      ))}
    </div>
  );
};
export default RoomList;