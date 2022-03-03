const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');

const { server, io } = require('./app');
const DB = process.env.MONGO_URL;
const PORT = process.env.PORT || 8081;
const connectToDb = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('DB connection successfull');
    console.log(mongoose.connection.db.databaseName)
    io.on('connection', (socket) => {
      console.log('Client connected');
      socket.on('disconnect', () => {
        console.log('Client disconnected');
        socket.emit('receive', 0);
      });
      socket.emit('connection', null);
    });
  } catch (err) {
    console.log(err);
  }
}

const serverProcess = server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}...`)
  await connectToDb();
});

process.on('uncaughtException', err => {
  console.log('UnCAUGHT EXCEPTION  Shutting down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION Shutting down ...', err);
  serverProcess.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log(' SIGTERM RECIVED. Shutting down gracefully');
  serverProcess.close(() => {
    console.log(' Process terminated');
  });
});

module.exports = { 'mongoose': mongoose, 'server': server }