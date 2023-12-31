
const socket = require('socket.io-client');

async function runClient(options) {
  
  const { server, name, readline } = options;

  const io = socket(server);

  let users = [];
  let messages = [];

  readline.on('line', (input) => {
    if(input.startsWith('/')) return commandParser(input);

    io.emit('message', {
      action: "newMessage",
      name: name,
      message: input
    });
  });

  let fails = 0;
  io.on('connect_error', (error) => {
    fails++;
    console.log(`*** ERROR: Failed to connect to ${server} ***`);
    if (fails > 5) {
      console.log(`*** ERROR: Failed 5 times. Exiting ***`);
      process.exit(1);
    }
  });

  io.on('connect', () => {
    
    const time = new Date();

    io.emit('message', {
      action: "newUser",
      name: name
    });

    function writeMessage(timestamp, user, content) {
      const time = new Date(timestamp);
      
      console.log(`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')} | ${user}: ${content}`)
    }

    io.on('message', (msg) => {
      let message = msg;
      
      try { message = JSON.parse(msg); } catch (error) {}

      if (!message.action) return;

      switch (message.action) {
        case "userList":
          if(users.length === 0) {
            console.log(`Session Start: ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
            console.log(`*** INFO: Connected to ${server} *** ${message.users.length} connected users ***`);
          }

          users = message.users;
          break;
        case "newUser":
          console.log(`${message.name} joined the chat`);

          users.push({
            id: message.user,
            name: message.name,
          });
          break;
        case "newMessage":
          writeMessage(message.timestamp, message.name, message.message);
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

  function sysLog(message) {
    console.log(`*** ${message} ***`);
  }

  function commandParser(input) {
    const args = input.split(' ');
    const command = args[0].substr(1);
    args.shift();

    switch (command) {
      case "exit":
        sysLog("Exiting");
        process.exit(0);
        break;

      case "users":
        sysLog(`> ${users.length} connected users`);
        break;

      default:
        sysLog(`Unknown command: ${command}`);
        break;
    }
  }
}

module.exports = runClient;