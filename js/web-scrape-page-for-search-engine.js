// node --inspect web-scrape-page-for-search-engine.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node --inspect web-scrape-page-for-search-engine.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// break on first line
// node --debug-brk web-scrape-page-for-search-engine.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node  --inspect web-scrape-page-for-search-engine.js 0 1
// node  --debug-brk --inspect web-scrape-page-for-search-engine.js 0 1


const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const iPad = devices['iPad'];
const iPhone = devices['iPhone 6'];


const del = require('del');
const fs = require('fs');




/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain = domainList[domainItem].webDomain;
/*END: Domain Name From CommandLine argument*/

/*START: Domain Name for Asset*/
var assetDomainItem = process.argv[4] || 0;
var assetDomainList = require('./domains/domainList').domainList;

var assetDomain = assetDomainList[assetDomainItem].webDomain;
/*END: Domain Name for Asset*/


/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/scrape-web-page-url.js').paths;
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
        args: ["--window-size=2400,1239"]


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




        await page.goto(domain + paths[i].url, {
            timeout: 0,
        });




        /*START: My task: get the sharing urls from the page*/

        await page.waitFor(15000);

        var pageHTML;


        pageHTML = await page.evaluate((assetDomain) => {

            $("link").each(function(i) {

                var linkHref = $(this).attr("href");
                var regExp = /^\//ig
                if (regExp.test(linkHref)) {

                    $(this).attr("href", `${assetDomain}/${linkHref}`);
                    console.log(`${assetDomain}/${linkHref}`)
                }
            });

            $("img").each(function(i) {

                var linkHref = $(this).attr("src");
                var regExp = /^\//ig
                if (regExp.test(linkHref)) {

                    $(this).attr("src", `${assetDomain}/${linkHref}`);
                    console.log(`${assetDomain}/${linkHref}`)
                }
            });

            
            var pageHTML = $("html")[0].outerHTML;


            return Promise.resolve(pageHTML);
        }, assetDomain);



        /*END: My task: get the sharing urls from the page*/



        // /*START: console output beautifier*/
        // var css = "font-size: 12px;color:green; font-weight:bold;";
        // console.log(`%csharing urls for the Page:   ${paths[i].title}`, css);
        // console.log(pageItemData.sharingUrl);
        // /*END: console output beautifier*/

        del.sync([
            `./html-scrape/*.html`,
        ], { force: true });


        if (!fs.existsSync('./html-scrape')) fs.mkdirSync('./html-scrape');

        fs.writeFile(`./html-scrape/${paths[i].title}.html`, pageHTML, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });



    }


    console.log(allPagesData);
    // await browser.close();
})();