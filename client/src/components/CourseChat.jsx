import { useState, useEffect, useRef } from 'react';

function CourseChat({ courseId, courseName, user, socket, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Join course room
    socket.emit('join_course_room', { courseId, user });

    // Listen for chat history
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing
    socket.on('user_typing', (typingUser) => {
      setTypingUser(typingUser);
    });

    socket.on('user_stop_typing', () => {
      setTypingUser(null);
    });

    return () => {
      socket.emit('leave_course_room', { courseId, user });
      socket.off('chat_history');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    socket?.emit('send_message', {
      courseId,
      message: {
        senderId: user._id,
        senderName: user.name,
        senderRole: user.role,
        text: newMessage.trim()
      }
    });
    setNewMessage('');
    socket?.emit('stop_typing', { courseId });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('typing', { courseId, user });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('stop_typing', { courseId });
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'instructor': return '#48cfad';
      case 'admin': return '#f7b731';
      default: return '#6c63ff';
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: '360px', height: '500px',
      background: 'rgba(6,13,31,0.98)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(108,99,255,0.3)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      display: 'flex', flexDirection: 'column',
      zIndex: 9998
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(72,207,173,0.1))',
        borderRadius: '20px 20px 0 0'
      }}>
        <div>
          <h3 style={{ color: '#e0e6f0', fontSize: '14px', fontWeight: '700' }}>
            💬 {courseName}
          </h3>
          <p style={{ color: '#475569', fontSize: '12px' }}>
            Course Discussion
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(252,92,125,0.15)',
            border: '1px solid rgba(252,92,125,0.3)',
            color: '#fc5c7d', borderRadius: '8px',
            padding: '4px 10px', cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '15px',
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ fontSize: '30px', marginBottom: '10px' }}>💬</p>
            <p style={{ color: '#475569', fontSize: '13px' }}>
              No messages yet. Start the discussion!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.senderId === user._id;
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: isOwn ? 'row-reverse' : 'row',
                gap: '8px', alignItems: 'flex-end'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '30px', height: '30px',
                  background: `${getRoleColor(msg.senderRole)}33`,
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px', fontWeight: '800',
                  color: getRoleColor(msg.senderRole),
                  flexShrink: 0
                }}>
                  {msg.senderName?.charAt(0).toUpperCase()}
                </div>

                {/* Message Bubble */}
                <div style={{ maxWidth: '75%' }}>
                  {!isOwn && (
                    <p style={{
                      fontSize: '11px', color: getRoleColor(msg.senderRole),
                      fontWeight: '700', marginBottom: '3px',
                      textTransform: 'capitalize'
                    }}>
                      {msg.senderName} • {msg.senderRole}
                    </p>
                  )}
                  <div style={{
                    padding: '10px 14px',
                    background: isOwn
                      ? 'linear-gradient(135deg, #6c63ff, #48cfad)'
                      : 'rgba(255,255,255,0.06)',
                    borderRadius: isOwn
                      ? '14px 14px 4px 14px'
                      : '14px 14px 14px 4px',
                    border: isOwn ? 'none' : '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <p style={{
                      color: 'white', fontSize: '13px',
                      lineHeight: '1.5', wordBreak: 'break-word'
                    }}>
                      {msg.text}
                    </p>
                  </div>
                  <p style={{
                    fontSize: '10px', color: '#334155',
                    marginTop: '3px',
                    textAlign: isOwn ? 'right' : 'left'
                  }}>
                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {typingUser && typingUser.id !== user._id && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '30px', height: '30px',
              background: 'rgba(108,99,255,0.2)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px', fontWeight: '800', color: '#6c63ff'
            }}>
              {typingUser.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '14px 14px 14px 4px',
              display: 'flex', gap: '4px', alignItems: 'center'
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px',
                  background: '#6c63ff', borderRadius: '50%',
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`
                }} />
              ))}
              <style>{`
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-4px); }
                }
              `}</style>
            </div>
            <p style={{ color: '#475569', fontSize: '11px' }}>
              {typingUser.name} is typing...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 15px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: '8px', alignItems: 'center'
      }}>
        <input
          value={newMessage}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: '10px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: '10px', color: '#e0e6f0',
            fontSize: '13px', outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          style={{
            width: '38px', height: '38px',
            background: newMessage.trim()
              ? 'linear-gradient(135deg, #6c63ff, #48cfad)'
              : 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: '10px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CourseChat;