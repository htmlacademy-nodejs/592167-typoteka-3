'use strict';

const express = require(`express`);
const {initializeRoutes} = require(`./routes/index`);

const app = express();
initializeRoutes(app);

const port = 8080;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
