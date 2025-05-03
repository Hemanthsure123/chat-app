import { useState, useEffect, useRef, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import './ChatWindow.css'


const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const {
    messages,
    currentChat,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    typing,
    markMessageAsRead,
    mentionUser,
  } = useContext(ChatContext);
  const [content, setContent] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    messages.forEach((msg) => {
      if (currentChat?.type === 'conversation' && !msg.readBy?.includes(user.id)) {
        markMessageAsRead(msg.id);
      }
    });
  }, [messages, currentChat, user.id, markMessageAsRead]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (editingMessage) {
      editMessage(editingMessage.id, content);
      setEditingMessage(null);
    } else {
      sendMessage(content);
    }
    setContent('');
  };

  const handleTyping = (e) => {
    setContent(e.target.value);
    typing();
  };

  const handleMention = (userId) => {
    setContent((prev) => `${prev} @${userId} `);
    mentionUser(userId);
  };

  if (!currentChat) return (
  <div className="no-chatting-window">
    <p className='no-chat'>Select a chat to start messaging</p>
  </div>
  )

  return (
    <div className="chatting-window">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender.id === user.id ? 'self' : 'other'}`}
          >
            <div className="font-bold">{msg.sender.email}</div>
            {msg.deleted ? (
              <div className="italic text-gray-500">Message deleted</div>
            ) : (
              <>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                {msg.edited && <span className="text-xs text-gray-500">(Edited)</span>}
                {currentChat.type === 'conversation' && msg.sender.id !== user.id && (
                  <div className="text-xs text-gray-500">
                    {msg.readBy?.includes(user.id) ? 'Read' : 'Delivered'}
                  </div>
                )}
                {msg.sender.id === user.id && !msg.deleted && (
                  <div className="text-xs">
                    <button
                      onClick={() => {
                        setEditingMessage(msg);
                        setContent(msg.content);
                      }}
                      className="text-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="text-sm p-2">
        {typingUsers.map((userId) => (
          <span key={userId}>User {userId} is typing...</span>
        ))}
      </div>
      <form onSubmit={handleSend} className="input-container">
        <input
          type="text"
          value={content}
          onChange={handleTyping}
          placeholder="Type a message (use Markdown for formatting)"
          className="chatting-input"
        />
        <button type="submit">{editingMessage ? 'Update' : 'Send'}</button>
        {editingMessage && (
          <button
            type="button"
            onClick={() => {
              setEditingMessage(null);
              setContent('');
            }}
            className="bg-gray-500"
          >
            Cancel
          </button>
        )}
        {/* Add a button to mention a user (hardcoded userId for demo) */}
        <button
          type="button"
          onClick={() => handleMention('1')} // Replace '1' with a real userId in production
          className="bg-yellow-500 ml-2"
        >
          Mention User 1
        </button>
      </form>
    </div>
  );
};
export default ChatWindow;