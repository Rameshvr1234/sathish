const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import database connection
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const branchRoutes = require('./routes/branchRoutes');
const branchAdminRoutes = require('./routes/branchAdminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const legalRoutes = require('./routes/legalRoutes');
const constructionRoutes = require('./routes/constructionRoutes');
const financeRoutes = require('./routes/financeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const leadRoutes = require('./routes/leadRoutes');
const reportRoutes = require('./routes/reportRoutes');
const offersNewsRoutes = require('./routes/offersNewsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const valuationRoutes = require('./routes/valuationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const builderRoutes = require('./routes/builderRoutes');
const projectRoutes = require('./routes/projectRoutes');
const alertRoutes = require('./routes/alertRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const recentlyViewedRoutes = require('./routes/recentlyViewedRoutes');
const shortlistRoutes = require('./routes/shortlistRoutes');
const localityInsightsRoutes = require('./routes/localityInsightsRoutes');
const priceTrendsRoutes = require('./routes/priceTrendsRoutes');

// Phase 8 Routes
const virtualTourRoutes = require('./routes/virtualTourRoutes');
const videoCallTourRoutes = require('./routes/videoCallTourRoutes');
const aiRecommendationRoutes = require('./routes/aiRecommendationRoutes');
const homeLoanRoutes = require('./routes/homeLoanRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/branch-admin', branchAdminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/services/survey', surveyRoutes);
app.use('/api/services/legal', legalRoutes);
app.use('/api/services/construction', constructionRoutes);
app.use('/api/services/finance', financeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/offers-news', offersNewsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/calculators', calculatorRoutes);
app.use('/api/valuation', valuationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/builders', builderRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/shortlist', shortlistRoutes);
app.use('/api/localities', localityInsightsRoutes);
app.use('/api/price-trends', priceTrendsRoutes);

// Phase 8 API Routes
app.use('/api/virtual-tours', virtualTourRoutes);
app.use('/api/video-call-tours', videoCallTourRoutes);
app.use('/api/ai-recommendations', aiRecommendationRoutes);
app.use('/api/home-loans', homeLoanRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-chat', (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('send-message', (data) => {
    io.to(`chat_${data.chatId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync database models (use { force: true } to drop and recreate tables)
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized');

    // Start server
    server.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      console.log(`✓ API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = { app, io };
