'use strict';

const config = require('../config');
const log = config.log();

const service = require('../server/service')(config);
const http = require('http');
const server = http.createServer(service);
const SlackClient = require('../server/slackClient');
const WitClient = require('../server/witClient');
const witClient = new WitClient(config.witToken);

const serviceRegistry = service.get('serviceRegistry');
const slackClient = new SlackClient(config.slackToken, config.slackLogLevel, witClient, serviceRegistry, log);

slackClient.start(() => {
  server.listen(3000);
});

server.on('listening', function () {
  log.info(`HePa is listening on ${server.address().port} in ${service.get('env')} mode.`);
});