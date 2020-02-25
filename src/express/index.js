'use strict';

const express = require(`express`);
const {responseContext} = require(`./routes/index`);

const app = express();
responseContext(app);

const port = 8080;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
