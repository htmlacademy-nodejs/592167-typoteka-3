'use strict';

const port = 8080;

const express = require(`express`);
const {responseContext} = require(`./routes/index`);

const app = express();
responseContext(app);

app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
