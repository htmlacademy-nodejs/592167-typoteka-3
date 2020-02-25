'use strict';

const port = 8080;

const express = require(`express`);
const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);

const app = express();

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.get(`/`, (req, res) => {
  res.send(req.url);
});
app.get(`/register`, (req, res) => {
  res.send(req.url);
});
app.get(`/login`, (req, res) => {
  res.send(req.url);
});
app.get(`/search`, (req, res) => {
  res.send(req.url);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});
