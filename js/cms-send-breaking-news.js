// node --inspect cms-send-breaking-news.js <domain-no-from-domainList.js> <section-id-else-default-home-section-id-i-e-1>
// node --inspect cms-send-breaking-news.js <domain-no-from-domainList.js> <section-id-else-default-home-section-id-i-e-1>
// break on first line
// node --debug-brk --inspect cms-send-breaking-news.js <domain-no-from-domainList.js> <section-id-else-default-home-section-id-i-e-1>




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




    /*START: Go to the breaking news create page and type the news */
    await page.click(".create_breaking_news_btn");
    // await page.waitForNavigation({
    //     waitUntil: 'load',
    // });
    await page.waitFor("#sidebar");

    await page.type("#text", "test breaking news please read it carefully", { delay: delayInputType });

    /*END: Go to the breaking news create page and type the news */


    /*START: Click craete and then publish*/
    await page.click('button[value="CREATE"]');
    
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    await page.click('button[value="PUBLISH"]');

    /*END: Click craete and then publish*/


})();