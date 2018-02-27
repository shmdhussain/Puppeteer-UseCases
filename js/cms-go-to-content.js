// node --inspect cms-go-to-content.js <domain-no-from-domainList.js> <content-nickname-from-cms-contents-js file> <open-existing-content-id-optional>
// node --inspect cms-go-to-content.js <domain-no-from-domainList.js> <content-nickname-from-cms-contents-js file> <open-existing-content-id-optional>
// break on first line
// node --debug-brk --inspect cms-go-to-content.js <domain-no-from-domainList.js> <content-nickname-from-cms-contents-js file> <open-existing-content-id-optional>

//// node --inspect cms-go-to-content.js 7 a 1023020
//open cms article page 1023020 in leg7                                        

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

/*START: Get content type from the user from command line*/
var contentTypeNickName = process.argv[3] || "a"; //default to article
var contentList = require('./cms-contents/cms-contents').contentList;

var contentUrl = contentList.filter(function(contentItem) {
    if(contentItem.nickName == contentTypeNickName){
        return true;
    }
    return false;
});
contentUrl = contentUrl[0].contentUrl;

/*END: Get content type from the user from command line*/


/*START: Get content Id from the user from command line*/
var contentID = "/" + (process.argv[4] || ""); //no content means create that content
/*END: Get content Id from the user from command line*/

var delayInputType = 0;



var goToContentPageUrl = contentUrl + contentID;

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


    /*START: Go to ,the corresponding content url specified by user*/

        let newPage = await browser.newPage();

        await newPage.setViewport({ width: 2300, height: 1239 });

        await newPage.goto(domain + goToContentPageUrl, {
            waitUntil: 'load'
        });




    /*END: Go to ,the corresponding content url specified by user*/



})();