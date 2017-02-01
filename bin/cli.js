#!/usr/bin/env node

const MobileFriendly = require('../');

const argv = process.argv.slice(2);
const url = argv[0];
const flags = {};

argv
  .filter(f => f.startsWith('-'))
  .forEach(f => {
    var keyValue = f.split('=');
    const flagKey = keyValue[0].replace(/-*/, '');
    flags[flagKey] = keyValue[1] || true;
  });


argv.filter(f => !f.startsWith('-')).shift();

if (!url || flags.help) {
  console.error('Usage:');
  console.error('    mbfriendly http://example.com/ --apiKey=my_api_key');
  console.error('    mbfriendly http://example.com/ --requestScreenshot');
  console.error('    mbfriendly http://example.com/ --json');

  return;
}

const mobileFriendly = new MobileFriendly(url, flags);
mobileFriendly
  .run()
  .then(_ => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    return process.exit(1);
  });