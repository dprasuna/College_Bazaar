// Importing required libraries
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Importing Environment Variables
require('dotenv').config();

// Initiating Connection to the MongoDB
require('./src/db/conn');

// Importing all routes
const all_listings = require('./src/routes/all_listings');
const register = require('./src/routes/register');
const add_item = require('./src/routes/add_item');
const profile = require('./src/routes/profile');
const delete_user = require('./src/routes/delete_user');
const signin = require('./src/routes/signin');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Setting Routes
app.use('/db', all_listings);
app.use('/add_data', add_item);
app.use('/register', register);
app.use('/signin', signin);
app.use('/del', delete_user);
app.use('/profilec', profile);

// Alloting Port Number
const port = process.env.PORT || 5000;

// Initialising Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Using Socket.io for chat purposes
io.on('connection', (socket) => {
  socket.on('join_room', (data) => {
    socket.join(data);
  });
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
  socket.on('disconnect', () => {});
});

// Listening on the required Port.
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
