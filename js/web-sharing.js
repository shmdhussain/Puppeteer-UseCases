// node --inspect web-sharing.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node --inspect web-sharing.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// break on first line
// node --debug-brk --inspect web-sharing.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node  --inspect web-sharing.js 0 1


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
var paths = require('./paths/Web-Urls/sharing-url.js').paths;
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
        // executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ["--window-size=2400,1239", "--user-data-dir=/Users/Mohamed_Hussain_SH/Library/Application Support/Google/Chrome/Default"]


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



        var pageItemData = { title: paths[i].title, sharingUrl: {facebook: "", twitter: "", gplus: "", email: "", whatsapp: "" } }

        await page.goto(domain + paths[i].url, {
            timeout: 0,
        });




        /*START: My task: get the sharing urls from the page*/

        await page.waitFor(5000);



        pageItemData.sharingUrl = await page.evaluate(() => {



            var sharingObj = {facebook: "", twitter: "", gplus: "", email: "", whatsapp: "" };


            sharingObj.facebook = $("sna-share").find(".facebook a").prop("href");
            sharingObj.twitter = $("sna-share").find(".twitter a").prop("href");
            sharingObj.gplus = $("sna-share").find(".google-plus a").prop("href");
            sharingObj.wassup = $("sna-share").find(".whatsapp a").prop("href");
            sharingObj.email = $("sna-share").find(".email a").prop("href");



            return Promise.resolve(sharingObj);



        });

        

        /*END: My task: get the sharing urls from the page*/


        var css = "font-size: 12px;color:green; font-weight:bold;";



        console.log(`%csharing urls for the Page:   ${paths[i].title}`, css);
        console.log(pageItemData.sharingUrl);
        allPagesData.push(pageItemData);


    }


    console.log(allPagesData);
    // await browser.close();
})();