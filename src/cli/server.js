'use strict';

const app = require(`../backend/app`);
const DEFAULT_PORT = 3000;

const startServer = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  app.listen(port, () => {
    console.log(`Server start on: ${port}`);
  });
};

module.exports = {
  name: `--server`,
  async run(args) {
    startServer(args);
  }
};
