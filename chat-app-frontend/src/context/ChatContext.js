import { createContext, useState, useEffect, useContext,useCallback } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (user && token) {
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token },
      });
      setSocket(socketInstance);

      socketInstance.emit('join', { userId: user.id, token });

      socketInstance.on('userStatus', ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });

      socketInstance.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socketInstance.on('messageEdited', (message) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === message.id ? message : msg))
        );
      });

      socketInstance.on('messageDeleted', (messageId) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, deleted: true } : msg
          )
        );
      });

      socketInstance.on('typing', ({ userId }) => {
        setTypingUsers((prev) => [...new Set([...prev, userId])]);
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((id) => id !== userId));
        }, 3000);
      });

      socketInstance.on('messageRead', ({ messageId, userId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, readBy: [...(msg.readBy || []), userId] }
              : msg
          )
        );
      });

      socketInstance.on('mention', ({ from, roomId, conversationId }) => {
        alert(`You were mentioned by user ${from} in ${roomId || conversationId}`);
      });

      return () => socketInstance.disconnect();
    }
  }, [user, token]);

  const fetchChatData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat-data`);
      setRooms(res.data.rooms);
      setConversations(res.data.conversations);
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to fetch chat data.');
      }
    }
  }, []);

  const fetchMessages = async (type, id) => {
    const url =
      type === 'room'
        ? `${process.env.REACT_APP_API_URL}/api/rooms/${id}/messages`
        : `${process.env.REACT_APP_API_URL}/api/conversations/${id}/messages`;
    const res = await axios.get(url);
    setMessages(res.data);
  };

  const joinChat = (type, id) => {
    setCurrentChat({ type, id });
    fetchMessages(type, id);
    if (type === 'room') {
      socket.emit('joinRoom', { roomId: id });
    } else {
      socket.emit('joinConversation', { conversationId: id });
    }
  };

  const sendMessage = (content, type = 'text') => {
    if (!currentChat) return;
    socket.emit('sendMessage', {
      roomId: currentChat.type === 'room' ? currentChat.id : null,
      conversationId: currentChat.type === 'conversation' ? currentChat.id : null,
      content,
      type,
    });
  };

  const editMessage = (messageId, content) => {
    socket.emit('editMessage', { messageId, content });
  };

  const deleteMessage = (messageId) => {
    socket.emit('deleteMessage', { messageId });
  };

  const typing = () => {
    if (!currentChat) return;
    socket.emit('typing', {
      roomId: currentChat.type === 'room' ? currentChat.id : null,
      conversationId: currentChat.type === 'conversation' ? currentChat.id : null,
    });
  };

  const markMessageAsRead = (messageId) => {
    if (currentChat?.type === 'conversation') {
      socket.emit('readMessage', {
        messageId,
        conversationId: currentChat.id,
      });
    }
  };

  const mentionUser = (userId) => {
    socket.emit('mention', {
      userId,
      roomId: currentChat.type === 'room' ? currentChat.id : null,
      conversationId: currentChat.type === 'conversation' ? currentChat.id : null,
    });
  };

  return (
    <ChatContext.Provider
  value={{
    rooms,
    conversations,
    messages,
    onlineUsers,
    typingUsers,
    currentChat,
    fetchChatData,
    joinChat, // This is available
    sendMessage,
    editMessage,
    deleteMessage,
    typing,
    markMessageAsRead,
    mentionUser,
  }}
>
  {children}
</ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };