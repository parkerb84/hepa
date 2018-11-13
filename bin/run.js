'use strict';

const config = require('../config');

const service = require('../server/service')(config);
const http = require('http');
const server = http.createServer(service);
const slackClient = require('../server/slackClient');
const witClient = require('../server/witClient')(config.witToken);

const slackToken = config.slackToken;
const slackLogLevel = 'info';

const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => {
  server.listen(3000);
});

server.on('listening', function () {
  console.log(`HePa is listening on ${server.address().port} in ${service.get('env')} mode.`);
});