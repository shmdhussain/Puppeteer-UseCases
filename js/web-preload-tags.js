const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPad = devices['iPad'];
const del = require('del');




var domain = "http://webdevtest.skynewsarabia.com";

/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/pageSpeedInsight-urls').paths;
/*END: Paths to be tested coming from the JSON*/


(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var pageUrl;
    var loadMorePresent;

    var allPagesData = [];


    /*START: Open page with certain viewport*/
    var page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });
    /*END: Open page with certain viewport*/


    for (var i = 0; i < paths.length; i++) {

        var pageItemData = { title: paths[i].title, preLoadTags: [], preFetchTags: [], preConnectTags: [] }



        await page.goto(domain + paths[i].url, {
            timeout: 0,
        });

        /*START: Print Page Url*/
        pageUrl = page.url();
        // console.log("Page url is : " + pageUrl);
        /*END: Print Page Url*/


        /*START: My task: get the preload tags*/

        await page.waitFor(2000);


        /*START: Getting unoptimized Images For Mobile Layout*/

        pageItemData.preLoadTags = await page.evaluate(() => {

            var itemArr = [];


            $('[rel="preload"]').each(function(i, el) {
                itemArr.push($(this).attr("href"));
            });

            return Promise.resolve(itemArr);


        });
        pageItemData.preFetchTags = await page.evaluate(() => {

            var itemArr = [];


            $('[rel="prefetch"]').each(function(i, el) {
                itemArr.push($(this).attr("href"));
            });

            return Promise.resolve(itemArr);


        });
        pageItemData.preConnectTags = await page.evaluate(() => {

            var itemArr = [];


            $('[rel="preconnect"]').each(function(i, el) {
                itemArr.push($(this).attr("href"));
            });

            return Promise.resolve(itemArr);


        });


        /*END: Getting unoptimized Images For Mobile Layout*/


        /*END: My task: get the unoptimized images*/

        console.log("Page speed Insight for the Page: " + paths[i].title);
        console.log(pageItemData);
        allPagesData.push(pageItemData);


    }

    console.log(allPagesData);
    // await browser.close();
})();