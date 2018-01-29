const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPad = devices['iPad'];
const del = require('del');



/*START: Se the domain against which the test to be run for*/
var domain = "http://webdevtest.skynewsarabia.com";
console.log("DOMAIN : "+ domain);
/*END: Se the domain against which the test to be run for*/



/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/section-urls').paths;
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

        var pageItemData = { title: paths[i].title, MainComponents: [], sidebarComponents: [] }



        await page.goto(domain + paths[i].url, {
            timeout: 0,
        });

        /*START: Print Page Url*/
        pageUrl = page.url();
        // console.log("Page url is : " + pageUrl);
        /*END: Print Page Url*/


        /*START: My task: get the preload tags*/

        /*START: Enable the debug mode of angular*/
        
        var debugEnabled = await page.evaluate(() => {

            angular.reloadWithDebugInfo()
            return Promise.resolve("done");


        });
        /*END: Enable the debug mode of angular*/


        await page.waitFor(10000);


        /*START: Getting components present in the section pages*/
        pageItemData.MainComponents = await page.evaluate(() => {

            var itemArr = [];
            $('[data-ng-repeat*="component in components"]').each(function(index, el) {
                var componentName = $(el).scope().component.componentType;
                itemArr.push(componentName);
            });
            return Promise.resolve(itemArr);


        });
        pageItemData.sidebarComponents = await page.evaluate(() => {

            var itemArr = [];
            $('[data-ng-repeat*="component in sidebarComponents"]').each(function(index, el) {
                var componentName = $(el).scope().component.componentType
                itemArr.push(componentName);
            });
            return Promise.resolve(itemArr);


        });
        /*END: Getting components present in the section pages*/


        /*END: My task: get the unoptimized images*/

        console.log("Page Title: " + paths[i].title);
        console.log("Page URL: " + paths[i].url);
        console.log(pageItemData);
        allPagesData.push(pageItemData);


    }

    console.log(allPagesData);
    // await browser.close();
})();