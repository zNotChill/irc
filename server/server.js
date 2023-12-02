
const socket = require('socket.io');

const io = new socket.Server(19255);

let users = [];
let messages = [];

console.log(`Server has been created`);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.emit('message', JSON.stringify({
    action: 'userList',
    users: users,
    messages: messages,
    timestamp: new Date(),
  }))

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('message', JSON.stringify({ action: 'userLeft', user: socket.id, timestamp: new Date() }));

    users = users.filter((user) => user.id !== socket.id);
  });

  socket.on('message', (msg) => {
    let message = msg;
    
    try { message = JSON.parse(msg); } catch (error) {}

    if (!message.action) return;

    switch (message.action) {
      case "newUser":
        users.push({
          id: socket.id,
          name: message.name,
        });
        io.emit('message', JSON.stringify({ action: 'newUser', user: socket.id, name: message.name, timestamp: new Date() }));
        break;

      case "newMessage":
        messages.push(message.message);
        io.emit('message', JSON.stringify({ action: 'newMessage', message: message.message, user: socket.id, name: message.name, timestamp: new Date() }));
        break;
    }
  });
});