const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');



var domain = "https://www.skynewsarabia.com";
var testEnvName = "local-seo2-branch";

var paths = require('./paths/Web-Urls/allUrl').paths;


(async() => {

    // launch browser
    const browser = await puppeteer.launch({

        headless: true,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var fileName;
    var pageUrl;
    var pathName;

    // start page
    const page = await browser.newPage();


    /*START: emulate the size of the page or emulate Any Device*/
    await page.setViewport({ width: 2300, height: 1239 });
    // await page.emulate(iPhone);
    /*END: emulate the size of the page or emulate Any Device*/

    /*START: Run through the list of pages in the website as in the paths array and do the task*/
    
    for (var i = 0; i < paths.length; i++) {
        /*START: Our Custom Task*/
        await page.tracing.start({path: testEnvName + '-traces/' + paths[i].title + '.json'});

        await page.goto(domain + paths[i].url, {
            timeout: 15000,
        });
        pageUrl = page.url();

        console.log("Page url is : " + pageUrl);
        await page.tracing.stop();
        /*END: Our Custom Task*/
    }
    /*END: Run through the list of pages in the website as in the paths array and do the task*/

    await browser.close();
})();