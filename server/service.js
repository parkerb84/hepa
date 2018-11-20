'use strict';

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');

module.exports = (config) => {
  const serviceRegistry = new ServiceRegistry(config.serviceTimeout, config.log());
  service.set('serviceRegistry', serviceRegistry);

  service.put('/service/:intent/:port', (req, res) => {

    if(req.get('X-HEPA-API-TOKEN') !== config.hepaApiToken) {
      return res.sendStatus(403);
    }

    if(!req.get('X-HEPA-SERVICE-TOKEN')) {
      return res.sendStatus(400);
    }

    const serviceIntent = req.params.intent;
    const servicePort = req.params.port;
    
    const serviceIp = req.connection.remoteAddress.includes('::')
      ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    serviceRegistry.add(serviceIntent, serviceIp, servicePort, req.get('X-HEPA-SERVICE-TOKEN'));
    res.json({result: `${serviceIntent} at ${serviceIp}:${servicePort}`});
  });

  return service;
};