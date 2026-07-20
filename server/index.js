const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// ── SECURITY & PERFORMANCE MIDDLEWARE ──
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('dev'));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── ROUTES ──
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Aarivya Learn API is running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal server error'
  });
});

// ── SOCKET.IO REAL-TIME LOGIC ──
const activeUsers = new Map();
const chatMessages = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_join', (userData) => {
    activeUsers.set(socket.id, userData);
    io.emit('active_users', Array.from(activeUsers.values()));
    socket.emit('notification', {
      id: Date.now(),
      type: 'welcome',
      message: `Welcome back, ${userData.name}! 👋`,
      time: new Date().toISOString()
    });
  });

  socket.on('join_course_room', ({ courseId, user }) => {
    socket.join(`course_${courseId}`);
    const messages = chatMessages.get(courseId) || [];
    socket.emit('chat_history', messages);
    socket.to(`course_${courseId}`).emit('notification', {
      id: Date.now(),
      type: 'info',
      message: `${user.name} joined the discussion`,
      time: new Date().toISOString()
    });
  });

  socket.on('leave_course_room', ({ courseId, user }) => {
    socket.leave(`course_${courseId}`);
    socket.to(`course_${courseId}`).emit('notification', {
      id: Date.now(),
      type: 'info',
      message: `${user.name} left the discussion`,
      time: new Date().toISOString()
    });
  });

  socket.on('send_message', ({ courseId, message }) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      time: new Date().toISOString()
    };
    if (!chatMessages.has(courseId)) chatMessages.set(courseId, []);
    const messages = chatMessages.get(courseId);
    messages.push(newMessage);
    if (messages.length > 100) messages.shift();
    io.to(`course_${courseId}`).emit('new_message', newMessage);
  });

  socket.on('delete_message', ({ courseId, messageId }) => {
    if (chatMessages.has(courseId)) {
      const messages = chatMessages.get(courseId);
      const filtered = messages.filter(m => m.id !== messageId);
      chatMessages.set(courseId, filtered);
    }
    io.to(`course_${courseId}`).emit('message_deleted', messageId);
  });

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

  socket.on('typing', ({ courseId, user }) => {
    socket.to(`course_${courseId}`).emit('user_typing', user);
  });

  socket.on('stop_typing', ({ courseId }) => {
    socket.to(`course_${courseId}`).emit('user_stop_typing');
  });

  socket.on('start_live_session', ({ courseId, instructor }) => {
    io.emit('live_session_started', {
      courseId, instructor,
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

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('active_users', Array.from(activeUsers.values()));
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});