'use strict';

const express = require(`express`);
const {getAppRoutes} = require(`./routes/index`);

const app = express();
getAppRoutes(app);

const port = 8080;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
