
const socket = require('socket.io-client');

async function runClient(options) {
  
  const { server, name, readline } = options;

  const io = socket(server);

  readline.on('line', (input) => {
    io.emit('message', {
      action: "newMessage",
      name: name,
      message: input
    });
  });

  io.on('connect', () => {
    
    const time = new Date();

    io.emit('message', {
      action: "newUser",
      name: name
    });

    function writeMessage(time, user, content) {
      console.log(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} | ${user}: ${content}`)
    }

    io.on('message', (msg) => {
      let message = msg;
      
      try { message = JSON.parse(msg); } catch (error) {}

      if (!message.action) return;

      switch (message.action) {
        case "userList":
          console.log(`Session Start: ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
          console.log(`*** INFO: Connected to ${server} *** ${message.users.length} connected users ***`);


          break;
        case "newUser":
          console.log(`${message.name} joined the chat`);
          break;
        case "newMessage":
          console.log(`${message.name}: ${message.message}`);
          break;
        case "userLeft":
          console.log(`${message.name} left the chat`);
          break;
        default:
          console.log(`Unknown action: ${message.action}`);
          break;
      }
    });
  });
}

module.exports = runClient;