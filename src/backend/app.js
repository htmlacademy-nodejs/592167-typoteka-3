'use strict';

const express = require(`express`);
const {initializeRoutes} = require(`./routes/index`);

const app = express();

app.use(express.json());
initializeRoutes(app);
app.use((req, res) => res.status(404).send({code: 404, message: `Page not found`}));

module.exports = app;
