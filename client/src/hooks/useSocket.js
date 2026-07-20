import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (user) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [liveSession, setLiveSession] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Connect to socket
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setConnected(true);
      socketRef.current.emit('user_join', {
        id: user._id,
        name: user.name,
        role: user.role
      });
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for notifications
    socketRef.current.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 20));
    });

    // Listen for active users
    socketRef.current.on('active_users', (users) => {
      setActiveUsers(users);
    });

    // Listen for live sessions
    socketRef.current.on('live_session_started', (session) => {
      setLiveSession(session);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'live',
        message: `🔴 Live session started by ${session.instructor.name}!`,
        time: new Date().toISOString()
      }, ...prev].slice(0, 20));
    });

    socketRef.current.on('live_session_ended', () => {
      setLiveSession(null);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  const joinCourseRoom = (courseId) => {
    socketRef.current?.emit('join_course_room', { courseId, user });
  };

  const leaveCourseRoom = (courseId) => {
    socketRef.current?.emit('leave_course_room', { courseId, user });
  };

  const sendMessage = (courseId, text) => {
    socketRef.current?.emit('send_message', {
      courseId,
      message: {
        senderId: user._id,
        senderName: user.name,
        senderRole: user.role,
        text
      }
    });
  };

  const sendTyping = (courseId) => {
    socketRef.current?.emit('typing', { courseId, user });
  };

  const stopTyping = (courseId) => {
    socketRef.current?.emit('stop_typing', { courseId });
  };

  const startLiveSession = (courseId) => {
    socketRef.current?.emit('start_live_session', {
      courseId,
      instructor: { id: user._id, name: user.name }
    });
  };

  const endLiveSession = (courseId) => {
    socketRef.current?.emit('end_live_session', { courseId });
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    socket: socketRef.current,
    connected,
    notifications,
    activeUsers,
    liveSession,
    joinCourseRoom,
    leaveCourseRoom,
    sendMessage,
    sendTyping,
    stopTyping,
    startLiveSession,
    endLiveSession,
    clearNotification,
    clearAllNotifications
  };
};