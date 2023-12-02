
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  readline.question("Server address: ", (server) => {
    readline.question("Name: ", (name) => {
      require('./client')({
        server,
        name,
        readline
      });
    });
  });
})();