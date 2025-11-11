const handleSocketConnection = (socket, io) => {
  console.log('Socket connected:', socket.id);

  // Handle chat messages
  socket.on('chat-message', (data) => {
    console.log('Chat message:', data);
    io.emit('chat-message', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
};

module.exports = { handleSocketConnection };
