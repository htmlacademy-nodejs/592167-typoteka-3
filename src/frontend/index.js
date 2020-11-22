'use strict';

const express = require(`express`);
const formidableMiddleware = require(`express-formidable`);
require(`dotenv`).config();

const {initializeRoutes} = require(`./routes/index`);

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

app.use(express.static(`${__dirname}/../static`));

app.use(formidableMiddleware({
  encoding: `utf-8`,
  uploadDir: `${__dirname}/tmp`,
  multiple: false,
}));

initializeRoutes(app);

const port = process.env.FRONT_SERVER_PORT;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
