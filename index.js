'use strict';

const request = require('request');

const GREEN = '\x1B[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1B[31m';
const RESET = '\x1B[0m';

const greenify = str => `${GREEN}${str}${RESET}`;
const redify = str => `${RED}${str}${RESET}`;
const yellowify = str => `${YELLOW}${str}${RESET}`;

const GREEN_CHECK = greenify('✓');
const YELLOW_FLAG = yellowify('⚑');
const RED_X = redify('✘');

const messages = {
  TEST_STATUS_UNSPECIFIED: `  ${RED_X} Error: ${RED} Internal error when running this test. Please try running the test again. ${RESET}`,
  COMPLETE: `  ${GREEN_CHECK} Success: ${GREEN} Inspection has completed without errors. ${RESET}`,
  INTERNAL_ERROR: `  ${RED_X} Error: ${RED} Inspection terminated in an error state. This indicates a problem in Google\'s infrastructure, not a user error. Please try again later.${RESET}`,
  PAGE_UNREACHABLE: `  ${RED_X} Error: ${RED} Google cannot access the URL because of a user error such as a robots.txt blockage, a 403 or 500 code etc. Please make sure that the URL provided is accessible by Googlebot and is not password protected.${RESET}`,
  MOBILE_FRIENDLY_TEST_RESULT_UNSPECIFIED: `  ${RED_X} Error: ${RED} Internal error when running this test. Please try running the test again.${RESET}`,
  MOBILE_FRIENDLY: `  ${GREEN_CHECK} Success: ${GREEN} The page is mobile friendly.${RESET}`,
  NOT_MOBILE_FRIENDLY: `  ${YELLOW_FLAG} Warning: ${YELLOW} The page is not mobile friendly.${RESET}`,
  MOBILE_FRIENDLY_RULE_UNSPECIFIED: `  ${RED_X} Error: ${RED} Unknown rule. Sorry, we don't have any description for the rule that was broken.${RESET}`,
  USES_INCOMPATIBLE_PLUGINS: `  ${RED_X} Error: ${RED} Plugins incompatible with mobile devices are being used.${RESET}`,
  CONFIGURE_VIEWPORT: `  ${RED_X} Error: ${RED} Viewport is not specified using the meta viewport tag.${RESET}`,
  FIXED_WIDTH_VIEWPORT: `  ${RED_X} Error: ${RED} Viewport defined to a fixed width.${RESET}`,
  SIZE_CONTENT_TO_VIEWPORT: `  ${RED_X} Error: ${RED} Content not sized to viewport.${RESET}`,
  USE_LEGIBLE_FONT_SIZES: `  ${RED_X} Error: ${RED} Font size is too small for easy reading on a small screen.${RESET}`,
  TAP_TARGETS_TOO_CLOSE: `  ${RED_X} Error: ${RED} Touch elements are too closeto each other. ${RESET}`,
};

class MobileFriendly {
  constructor(url, options = {}) {
    this.url = url;
    this.json = options.json || false;
    this.requestScreenshot = options.requestScreenshot || false;
    this.apiKey = options.apiKey || process.env.API_KEY;
  }

  run() {
    return new Promise((resolve, reject) => {
      const options = {
        url: `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key=${this.apiKey}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Referer': "https://developers.google.com",
        },
        method: 'POST',
        body: JSON.stringify({
          url: this.url,
          requestScreenshot: this.requestScreenshot
        })
      };

      console.log(`Checking site ${this.url} ...`);

      request.post(options, (err, data) => {
        let body;
        try {
          body = JSON.parse(data.body);
        } catch (e) {
          if (!err) {
            err = e;
          }
        }

        if (err || body.error)
          return reject(err || new Error(body.error.message));

        if (this.json) {
          process.stdout.write(data.body);
        } else {
          this.showResults(body);
        }

        return resolve(body);
      });
    });
  }

  showResults(data) {
    this.showTestStatusMsg(data.testStatus.status);
    this.showMobileFriendlinessMsg(data.mobileFriendliness);
    this.showMobileFriendlyIssuesMsg(data.mobileFriendlyIssues);
    this.showResourceIssuesMsg(data.resourceIssues);
  }

  showTestStatusMsg(status) {
    console.log(messages[status]);
  }

  showMobileFriendlinessMsg(mobileFriendliness) {
    console.log(messages[mobileFriendliness]);
  }

  showResourceIssuesMsg(resourceIssues = []) {

    if (resourceIssues.length) console.log(`\n ${YELLOW} Blocked resources: ${RESET} \n`);

    resourceIssues.forEach(resource => {
      console.log(`  ${YELLOW_FLAG} ${resource.blockedResource.url}`);
    });
  }

  showMobileFriendlyIssuesMsg(mobileFriendlyIssues = []) {
    if (mobileFriendlyIssues.length) console.log(`\n ${RED} Mobile-friendly issues: ${RESET} \n`);

    mobileFriendlyIssues.forEach(issue => {
      console.log(messages[issue.rule]);
    });
  }
}

module.exports = MobileFriendly;
