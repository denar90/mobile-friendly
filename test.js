'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const MobileFriendly = require('./');

const config = {
  url: 'http://example.com',
  flags: {
    json: true,
    requestScreenshot: true,
    apiKey: '1234'
  }
};

const fixtures = {
  "testStatus": {
    "status": "PAGE_UNREACHABLE"
  }
};

describe('MobileFriendly', () => {
  describe('constructor', () => {
    it('should set default values', () => {
      const mobileFriendly = new MobileFriendly();

      expect(mobileFriendly.url).to.be.undefined;
      expect(mobileFriendly.json).to.be.false;
      expect(mobileFriendly.requestScreenshot).to.be.false;
      expect(mobileFriendly.apiKey).to.be.undefined;
    });

    it('should set values due to config', () => {
      const mobileFriendly = new MobileFriendly(config.url, config.flags);

      expect(mobileFriendly.url).to.be.equal(config.url);
      expect(mobileFriendly.json).to.be.true;
      expect(mobileFriendly.requestScreenshot).to.be.true;
      expect(mobileFriendly.apiKey).to.be.equal(config.flags.apiKey);
    });
  });

  describe('run', () => {
    // @todo
  });
});