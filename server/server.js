
const socket = require('socket.io');

const io = new socket.Server(19255);

let users = [];
let messages = [];

console.log(`Server has been created`);

io.on('connection', (socket) => {
  
  socket.emit('message', JSON.stringify({
    action: 'userList',
    users: users,
    messages: messages,
    timestamp: Date.now(),
  }))

  socket.on('disconnect', () => {
    const user = users.find((user) => user.id === socket.id);

    console.log(`${user.name} disconnected (${socket.id})`);
    io.emit('message', JSON.stringify({ action: 'userLeft', user: socket.id, name: user.name, timestamp: Date.now() }));

    users = users.filter((user) => user.id !== socket.id);
  });

  socket.on('message', (msg) => {
    let message = msg;
    
    try { message = JSON.parse(msg); } catch (error) {}

    if (!message.action) return;

    switch (message.action) {
      case "newUser":
        console.log(`${message.name} joined the chat (${socket.id})`);
        users.push({
          id: socket.id,
          name: message.name,
        });
        io.emit('message', JSON.stringify({ action: 'newUser', user: socket.id, name: message.name, timestamp: Date.now() }));
        break;

      case "newMessage":
        messages.push(message.message);
        io.emit('message', JSON.stringify({ action: 'newMessage', message: message.message, user: socket.id, name: message.name, timestamp: Date.now() }));
        break;
    }
  });
});