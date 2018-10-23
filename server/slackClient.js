'use strict';

const { RTMClient } = require('@slack/client');
let rtm = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
  console.log(message);
  rtm.sendMessage('*Beep Boop*', message.channel, function messageSent() {
    
  });
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', handler);
}

module.exports.init = function slackClient(token, logLevel) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, {logLevel: logLevel});
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on('message', handleOnMessage);
  return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;