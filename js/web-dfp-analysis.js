// node --inspect web-dfp-analysis.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node --inspect web-dfp-analysis.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// break on first line
// node --debug-brk --inspect web-dfp-analysis.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node  --inspect web-dfp-analysis.js 1 1

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const iPad = devices['iPad'];
const iPhone = devices['iPhone 6'];


const del = require('del');




/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain = domainList[domainItem].webDomain;
/*END: Domain Name From CommandLine argument*/



/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/dfp-pages').paths;
// var paths = require('./paths/Web-Urls/section-urls').paths;
/*END: Paths to be tested coming from the JSON*/

/*START: Select Devices Based on the command line param*/
var deviceTypeCode = process.argv[3] || "0"; //set default as desktop
var deviceType = "DESKTOP"; //set default as desktop

switch (deviceTypeCode) {
    case "1":
        deviceType = "MOBILE"
        break;

    case "2":
        deviceType = "TABLET"
        break;

    default:
        deviceType = "DESKTOP"
        break;
}

/*END: Select Devices Based on the command line param*/

(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ["--window-size=2400,1239"],
        userDataDir: "/Users/Mohamed_Hussain_SH/Library/Application Support/Google/Chrome/Default"


    });
    var pageUrl;
    var loadMorePresent;

    var allPagesData = [];




    for (var i = 0; i < paths.length; i++) {


        /*START: Open new tab for each path*/
        var page = await browser.newPage();
        /*END: Open new tab for each path*/


        /*START: Emulate devices either desktop, mobile or tablet*/
        if (deviceType == "MOBILE") {
            await page.emulate(iPhone);
        } else if (deviceType == "TABLET") {
            await page.emulate(iPhone);
        } else {
            await page.setViewport({ width: 2300, height: 1239 });
        }
        /*END: Emulate devices either desktop, mobile or tablet*/



        var pageItemData = { title: paths[i].title, pageTitle: "", dfpConfigObj: [] }

        await page.goto(domain + paths[i].url, {
            timeout: 0,
        });




        /*START: My task: get the ad related configs for all the pages*/

        await page.waitFor(10000);



        pageItemData.pageTitle = await page.evaluate(() => {
            var dfpConfig = $("[data-dfp-ad-unit]").data('dfp-ad-unit');
            return Promise.resolve(dfpConfig.page);
        });

        pageItemData.dfpConfigObj = await page.evaluate(() => {
            var dfpConfig = $("[data-dfp-ad-unit]").data('dfp-ad-unit');
            return Promise.resolve(dfpConfig);
        });

        /*END: My task: get the ad related configs for all the pages*/



        console.log("Page speed Insight for the Page: " + paths[i].title);
        console.log(`DFP Page Name From BE: ${pageItemData.pageTitle}`);
        console.log(`DFP Obj: ${pageItemData.dfpConfigObj}`);
        allPagesData.push(pageItemData);


    }

    console.log(allPagesData);
    // await browser.close();
})();