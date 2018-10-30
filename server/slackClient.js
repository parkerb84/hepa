'use strict';

const { RTMClient } = require('@slack/client');
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
  if(message.text.toLowerCase().includes('hepa')) {
    nlp.ask(message.text, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      try {
        if(!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not extract intent.");       
        }
        const intent = require('./intents/' + res.intent[0].value + 'Intent');

        intent.process(res, function(error, response) {
          if(error) {
            console.log(error.message);
            return;
          }
          return rtm.sendMessage(response, message.channel);
        })
      } catch(err) {
        console.log(err);
        console.log(res);
        rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel);
      }
    });
  }
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