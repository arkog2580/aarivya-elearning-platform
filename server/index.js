const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Aarivya Learn API is running!' });
});

// ── SOCKET.IO REAL-TIME LOGIC ──
const activeUsers = new Map();
const chatMessages = new Map();
const notifications = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins with their info
  socket.on('user_join', (userData) => {
    activeUsers.set(socket.id, userData);
    io.emit('active_users', Array.from(activeUsers.values()));
    
    // Send welcome notification
    socket.emit('notification', {
      id: Date.now(),
      type: 'welcome',
      message: `Welcome back, ${userData.name}! 👋`,
      time: new Date().toISOString()
    });
  });

  // Join a course chat room
  socket.on('join_course_room', ({ courseId, user }) => {
    socket.join(`course_${courseId}`);
    
    // Send existing messages for this course
    const messages = chatMessages.get(courseId) || [];
    socket.emit('chat_history', messages);
    
    // Notify others
    socket.to(`course_${courseId}`).emit('notification', {
      id: Date.now(),
      type: 'info',
      message: `${user.name} joined the discussion`,
      time: new Date().toISOString()
    });
  });

  // Leave course room
  socket.on('leave_course_room', ({ courseId, user }) => {
    socket.leave(`course_${courseId}`);
    socket.to(`course_${courseId}`).emit('notification', {
      id: Date.now(),
      type: 'info',
      message: `${user.name} left the discussion`,
      time: new Date().toISOString()
    });
  });

  // Send chat message
  socket.on('send_message', ({ courseId, message }) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      time: new Date().toISOString()
    };
    // Delete message
  socket.on('delete_message', ({ courseId, messageId }) => {
    if (chatMessages.has(courseId)) {
      const messages = chatMessages.get(courseId);
      const filtered = messages.filter(m => m.id !== messageId);
      chatMessages.set(courseId, filtered);
    }
    io.to(`course_${courseId}`).emit('message_deleted', messageId);
  });

  // Edit message
  socket.on('edit_message', ({ courseId, messageId, newText }) => {
    if (chatMessages.has(courseId)) {
      const messages = chatMessages.get(courseId);
      const updated = messages.map(m =>
        m.id === messageId ? { ...m, text: newText, edited: true } : m
      );
      chatMessages.set(courseId, updated);
      const editedMessage = updated.find(m => m.id === messageId);
      io.to(`course_${courseId}`).emit('message_edited', editedMessage);
    }
  });

    // Store message
    if (!chatMessages.has(courseId)) {
      chatMessages.set(courseId, []);
    }
    const messages = chatMessages.get(courseId);
    messages.push(newMessage);
    if (messages.length > 100) messages.shift(); // Keep last 100

    // Broadcast to course room
    io.to(`course_${courseId}`).emit('new_message', newMessage);
  });

  // Typing indicator
  socket.on('typing', ({ courseId, user }) => {
    socket.to(`course_${courseId}`).emit('user_typing', user);
  });

  socket.on('stop_typing', ({ courseId }) => {
    socket.to(`course_${courseId}`).emit('user_stop_typing');
  });

  // Send notification to all
  socket.on('send_notification', (notification) => {
    io.emit('notification', {
      id: Date.now(),
      ...notification,
      time: new Date().toISOString()
    });
  });

  // Live classroom events
  socket.on('start_live_session', ({ courseId, instructor }) => {
    io.emit('live_session_started', {
      courseId,
      instructor,
      time: new Date().toISOString()
    });
    io.emit('notification', {
      id: Date.now(),
      type: 'live',
      message: `🔴 ${instructor.name} started a live session!`,
      time: new Date().toISOString()
    });
  });

  socket.on('end_live_session', ({ courseId }) => {
    io.to(`course_${courseId}`).emit('live_session_ended');
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    activeUsers.delete(socket.id);
    io.emit('active_users', Array.from(activeUsers.values()));
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});