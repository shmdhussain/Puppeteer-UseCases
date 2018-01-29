// node --inspect cms-minification-toggle.js <domain-no-from-domainList.js>
// node --inspect cms-minification-toggle.js <domain-no-from-domainList.js>
// break on first line
// node --debug-brk --inspect cms-minification-toggle.js <domain-no-from-domainList.js> 

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');



/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain     = domainList[domainItem].cmsDomain;
/*END: Domain Name From CommandLine argument*/



// /*START: Enable == 1 , Disable == 0 (no min, default)*/
// // if (require.main === module) {
// //   printInFrame(process.argv[2], process.argv[3]);
// // } else {
// //   module.exports = printInFrame;
// // }
var minificationToggleValue = process.argv[3] || 0;
/*END: Enable == 1 , Disable == 0 (no min, default)*/



var delayInputType = 0;



var contentCreationPage = "/publisher/admin/system/sysconfig";

(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        ignoreHTTPSErrors: true,
        args: ["--window-size=2400,1239"]


    });


    const page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });

    /*START: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/
    await page.goto(domain + "/publisher/login", {
        waitUntil: 'load',

    });
    await page.type("#username", "sysadmin", {delay: delayInputType});
    await page.type("#password", "F00bar", {delay: delayInputType});
    await page.click("[value='Sign in']");

    await page.waitFor("#sidebar");
    /*END: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/

    /*START: Go to Content creation Page*/
    await page.goto(domain + contentCreationPage, {
        waitUntil: 'load'
    });
    /*END: Go to Content creation Page*/



    /*START: clicking the enable/disable minification based on the value passed from argument to this command*/

    await page.evaluate(function(minificationToggleValue) {
        if (minificationToggleValue == 0) {
            $("[name='systemAttributes[0].value']").prop("checked", true);
        } else {
            $("[name='systemAttributes[0].value']").prop("checked", false);
        }
    }, minificationToggleValue);

    /*END: clicking the enable/disable minification based on the value passed from argument to this command*/
 


    


    /*START: Click Approve and then publish*/
    await page.click('button[name="save"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    /*END: Click Approve and then publish*/


})();