'use strict';

const express = require(`express`);
const http = require(`http`);
const expressSession = require(`express-session`);
require(`dotenv`).config();

const {initializeRoutes} = require(`./routes/index`);

const app = express();
const server = http.createServer(app);
const io = require(`socket.io`)(server);

io.on(`connection`, (socket) => {
  const {address: ip} = socket.handshake;
  console.log(`Новое подключение: ${ip}`);

  socket.on(`message`, (clientMessage) => {
    socket.broadcast.emit(`message`, clientMessage);
  });

  socket.on(`disconnect`, () => {
    console.log(`Клиент отключён: ${ip}`);
  });

});

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

app.use(express.urlencoded({extended: false}));
app.use(express.static(`${__dirname}/../static`));
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  name: `session_id`,
}));

initializeRoutes(app);

const port = process.env.FRONT_SERVER_PORT;
server.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
