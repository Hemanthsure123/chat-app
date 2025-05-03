import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import "./RoomList.css"

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
    <div className="public-rooms">
      <h3 className="public-heading">Public Rooms</h3>
      <form onSubmit={handleCreateRoom} className="public-form">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
          className="public-input"
        />
        <button type="submit" className='room-btn'>Create Room</button>
      </form>
      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => joinChat('room', room.id)}
          className="all-rooms"
        >
          <p className='all-room-names' >{room.name}</p>
        </div>
      ))}
    </div>
  );
};
export default RoomList;