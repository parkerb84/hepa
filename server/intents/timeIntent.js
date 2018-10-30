'use strict';

module.exports.process = function process(intentData, cb) {
  if (intentData.intent[0].value !== 'time') {
    return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
  }
  if(!intentData.location) return cb(new Error('Missing location in time intent'));
  return cb(false, `I don't yet know the time in ${intentData.location[0].value}`);
}