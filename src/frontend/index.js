'use strict';

const express = require(`express`);
const expressSession = require(`express-session`);
require(`dotenv`).config();

const {initializeRoutes} = require(`./routes/index`);

const app = express();

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
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
