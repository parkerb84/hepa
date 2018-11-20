require('dotenv').config();
const bunyan = require('bunyan');

const log = {
  development: () => {
    return bunyan.createLogger({name: 'HEPA-development', level: 'debug'});
  },
  production: () => {
    return bunyan.createLogger({name: 'HEPA-production', level: 'info'});
  },
  test: () => {
    return bunyan.createLogger({name: 'HEPA-test', level: 'fatal'});
  }
};

module.exports = {
  witToken: process.env.WIT_TOKEN,
  slackToken: process.env.SLACK_TOKEN,
  slackLogLevel: 'info',
  serviceTimeout: 30,
  log: (env) => {
    if(env) return log[env]();
    return log[process.env.NODE_ENV || 'development']();
  }
};