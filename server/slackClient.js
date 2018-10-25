'use strict';

const { RTMClient } = require('@slack/client');
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
  nlp.ask(message.text, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    try {
      if (!res.intent) {
        rtm.sendMessage('Sorry I don\'t understand.', message.channel, function messageSent() {
      
        });
      } else if(res.intent[0].value == 'time' && res.location[0].resolved.values[0].name) {
        rtm.sendMessage(`I don't know the time in ${res.location[0].resolved.values[0].name}`, message.channel, function messageSent() {
      
        });
      } else {
        console.log(res);
        rtm.sendMessage('Sorry I don\'t understand.', message.channel, function messageSent() {
      
        });
      }
    }
    catch(e) {
      console.log(res);
      rtm.sendMessage('Sorry I don\'t understand.', message.channel, function messageSent() {
      
      });
    }
  }); 
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', handler);
}

module.exports.init = function slackClient(token, logLevel, nlpClient) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, {logLevel: logLevel});
  nlp = nlpClient;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on('message', handleOnMessage);
  return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;