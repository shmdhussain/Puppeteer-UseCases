const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');

/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain     = domainList[domainItem].cmsDomain;
/*END: Domain Name From CommandLine argument*/

var contentCreationPage = "/publisher/editor/customhtml";

(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var fileName;
    var pageUrl;
    var pathName;
    const page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });

    await page.goto(domain + "/publisher/login", {
        waitUntil: 'load',

    });
    await page.type("#username", "sysadmin", {delay: 250});
    await page.type("#password", "F00bar", {delay: 250});
    await page.click("[value='Sign in']");

    await page.waitFor("#sidebar");


    await page.goto(domain + contentCreationPage, {
        waitUntil: 'load'
    });
    await page.type("#freeText", "test", {delay: 250});
    await page.$$eval("#tagTermInputs", function(tagTermInputs) {
        $("#tagTermInputs").html('<li> test&nbsp; <input value="15886" type="hidden" name="terms[0].id" id="terms0.id"><a id="terms[0].remove" href="javascript:void(0)">×</a> </li>');
    });
    await page.click('[value="APPROVE"]');

    await page.waitForNavigation({
        waitUntil: 'load',

    });

    await page.click('[value="PUBLISH"]');

    // await browser.close();
})();