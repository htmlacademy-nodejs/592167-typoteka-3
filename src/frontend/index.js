'use strict';

const express = require(`express`);
require(`dotenv`).config();

const {initializeRoutes} = require(`./routes/index`);

const app = express();

app.set(`views`, `${__dirname}/templates`);
app.set(`view engine`, `pug`);

app.use(express.urlencoded({extended: false}));
app.use(express.static(`${__dirname}/../static`));

initializeRoutes(app);

const port = process.env.FRONT_SERVER_PORT;
app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
