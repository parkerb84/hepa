'use strict';

require('dotenv').config();
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);
const slackClient = require('../server/slackClient');

const slackToken = process.env.SLACK_TOKEN;
const slackLogLevel = 'info';

const rtm = slackClient.init(slackToken, slackLogLevel);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => {
  server.listen(3000);
});

server.on('listening', function () {
  console.log(`HePa is listening on ${server.address().port} in ${service.get('env')} mode.`);
});