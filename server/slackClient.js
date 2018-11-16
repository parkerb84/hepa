'use strict';

const { RTMClient } = require('@slack/client');


class SlackClient {
  constructor(token, logLevel, nlp, registry) {
    this._rtm = new RTMClient(token, {logLevel: logLevel});
    this._nlp = nlp;
    this._registry = registry;

    this._addAuthenticatedHandler(this._handleOnAuthenticated);
    this._rtm.on('message', this._handleOnMessage.bind(this));
  }

  _handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  }

  _addAuthenticatedHandler(handler) {
    this._rtm.on('authenticated', handler.bind(this));
  }

  _handleOnMessage(message) {
    if(message.text.toLowerCase().includes('hepa')) {
      this._nlp.ask(message.text, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        try {
          if(!res.intent || !res.intent[0] || !res.intent[0].value) {
            throw new Error('Could not extract intent.');       
          }
          const intent = require('./intents/' + res.intent[0].value + 'Intent');
  
          intent.process(res, this._registry, (error, response) => {
            if(error) {
              console.log(error.message);
              return;
            }
            return this._rtm.sendMessage(response, message.channel);
          });
        } catch(err) {
          console.log(err);
          console.log(res);
          this._rtm.sendMessage('Sorry, I don\'t know what you are talking about.', message.channel);
        }
      });
    }
  }

  start(handler) {
    this._addAuthenticatedHandler(handler);
    this._rtm.start();
  }

}

module.exports = SlackClient;