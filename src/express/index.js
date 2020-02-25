'use strict';

const port = 8080;

const express = require(`express`);

const app = express();

app.get(`/`, (req, res) => {
  res.send(req.url);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
