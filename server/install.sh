#! /bin/bash

# Installer for the server

git clone https://github.com/zNotChill/irc.git irc

apt install npm -y
npm install pm2 -g 

cd irc
git pull
cd server
npm install

pm2 start server.js --name irc