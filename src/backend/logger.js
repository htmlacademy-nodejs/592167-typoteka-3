'use strict';

const logger = require(`pino`)({
  name: `typo-teka`,
  level: process.env.LOG_LEVEL || `info`,
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
