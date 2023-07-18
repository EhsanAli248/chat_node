const express = require('express');
const app = express();
const PORT = 40001;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());

let users=[];
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message',data=>{
      socketIO.emit('messageResponse',data);
      // console.log(data)
    });

    //Listens when a new user joins the server
    socket.on('newUser',data=>{
      //Adds the new user to the list of users
      users.push(data);
      //send the list of users to the client
      socketIO.emit('newUserResponse',users);
    
    });
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
       //Updates the list of users when a user disconnects from the server
       users=users.filter(user => user.socketID !== socket.id);
      //  console.log(users)
      //send the list of users to the client
      socketIO.emit('newUserResponse',users);
      socket.disconnect();
    });
});
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});









