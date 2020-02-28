'use strict';

const express = require(`express`);
const {initializeRoutes} = require(`./routes/index`);

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

initializeRoutes(app);

const port = 8080;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
