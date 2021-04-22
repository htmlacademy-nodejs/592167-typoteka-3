'use strict';

const express = require(`express`);
const http = require(`http`);
const expressSession = require(`express-session`);
const RedisStorage = require(`connect-redis`)(expressSession);
const redis = require(`redis`);
const client = redis.createClient();
const axios = require(`axios`);
require(`dotenv`).config();

const {generateDate} = require(`../utils`);
const {BACKEND_URL, REDIS_HOST, REDIS_PORT} = require(`../constants`);

const {initializeRoutes} = require(`./routes/index`);

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(`${__dirname}/../static`));
app.use(expressSession({
  store: new RedisStorage({
    host: REDIS_HOST,
    port: REDIS_PORT,
    client,
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  name: `session_id`,
}));

initializeRoutes(app);

const server = http.createServer(app);
const io = require(`socket.io`)(server);

io.on(`connection`, (socket) => {
  const {address: ip} = socket.handshake;
  console.log(`Новое подключение: ${ip}`);

  socket.on(`message`, async (clientMessage) => {
    const {username, comment, articleUrl} = JSON.parse(clientMessage);
    const ResUserInfo = await axios.get(`${BACKEND_URL}/api/users/info?email=${username}`);
    const userInfo = ResUserInfo.data;
    const commentInfo = {
      user: `${userInfo.firstName} ${userInfo.lastName}`,
      avatar: userInfo.avatar,
      createdAt: generateDate(null, null),
      comment,
      articleUrl,
    };
    socket.broadcast.emit(`message`, JSON.stringify(commentInfo));
  });

  socket.on(`disconnect`, () => {
    console.log(`Клиент отключён: ${ip}`);
  });

});

const port = process.env.FRONT_SERVER_PORT;
server.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
