
# Installer for the server

git clone https://github.com/zNotChill/irc.git irc

apt install npm
npm install pm2 -g

cd irc/server
npm install

pm2 start server.js --name irc