
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const yargs = require('yargs');

(async () => {
  const server = yargs.argv.server;
  const name = yargs.argv.name;

  if (server && name) {
    require('./client')({
      server,
      name,
      readline
    });
  } else {
    readline.question("Server address: ", (server) => {
      readline.question("Name: ", (name) => {
        require('./client')({
          server,
          name,
          readline
        });
      });
    });
  }
})();