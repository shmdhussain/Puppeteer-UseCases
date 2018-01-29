const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');

/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain     = domainList[domainItem].cmsDomain;
/*END: Domain Name From CommandLine argument*/



var contentCreationPage = "/publisher/editor/imageset";

(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        ignoreHTTPSErrors: true,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var fileName;
    var pageUrl;
    var pathName;


    const page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });

    /*START: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/
    await page.goto(domain + "/publisher/login", {
        waitUntil: 'load',

    });
    await page.type("#username", "sysadmin", {delay: 250});
    await page.type("#password", "F00bar", {delay: 250});
    await page.click("[value='Sign in']");

    await page.waitFor("#sidebar");
    /*END: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/


    await page.goto(domain + contentCreationPage, {
        waitUntil: 'load'
    });

    /*START: Populating the content creation pages with values*/
    var imagesetFile = await page.$('#uploadFile');
    await imagesetFile.uploadFile("/Users/Mohamed_Hussain_SH/dump/dummy-images/test_Images/InfoGraphic/set1/info-1.jpg")
    await page.click('[name="UPLOAD"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    await page.select('#sourceTemp', 'Reuters');
    await page.select('#type', 'IMAGE_SET');
    await page.type("#description", "test caption", {delay: 250});
    /*END: Populating the content creation pages with values*/


    /*START: Click Approve and then publish*/
    await page.click('[value="APPROVE"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    await page.click('[value="PUBLISH"]');

    /*END: Click Approve and then publish*/


})();