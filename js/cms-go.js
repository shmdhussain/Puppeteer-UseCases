// node --inspect cms-go.js <domain-no-from-domainList.js> 
// node --inspect cms-go.js <domain-no-from-domainList.js> 
// break on first line
// node --debug-brk --inspect cms-go.js <domain-no-from-domainList.js> 

//for example node --inspect cms-go.js 0 


const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const iPhone = devices['iPhone 6'];
const iPad = devices['iPad'];


const del = require('del');

/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain = domainList[domainItem].cmsDomain;
/*END: Domain Name From CommandLine argument*/

/*START: Get Section Id from the user from command line*/
var sectionID = process.argv[3] || 1;
/*END: Get Section Id from the user from command line*/

var delayInputType = 0;



var sectionPages = [
    "/publisher/editor/section/" + sectionID,
    "/publisher/editor/sectionLayout/" + sectionID,
    "/publisher/editor/sectionconfiguration/" + sectionID,
    "/publisher/editor/section/" + sectionID + "/sidebar",


];

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
    var mainmediaAssetBoundingBox;
    var mainmediaAssetEl;

    var draggedElBoundingBox;
    var draggedEl;

    const page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });

    /*START: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/
    await page.goto(domain + "/publisher/login", {
        waitUntil: 'load',

    });
    await page.type("#username", "sysadmin", { delay: delayInputType });
    await page.type("#password", "F00bar", { delay: delayInputType });
    await page.click("[value='Sign in']");

    await page.waitFor("#sidebar");
    /*END: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/


    



})();