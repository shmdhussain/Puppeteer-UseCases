const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');



/*START: Delete the all screen shots for the current device*/
del(['iPhone-screenshots/*.jpg']).then(paths => {
    console.log("Deleted the files");
});
/*END: Delete the all screen shots for the current device*/

var domain = "https://www.skynewsarabia.com";

/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/allUrl').paths;
/*END: Paths to be tested coming from the JSON*/


(async() => {
    const browser = await puppeteer.launch({

        headless: true,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var fileName;
    var pageUrl;
    var pathName;
    const page = await browser.newPage();
    // await page.setViewport({width: 2300, height:1239});
    await page.emulate(iPhone);

    for (var i = 0; i < paths.length; i++) {
        await page.goto(domain + paths[i].url, {
            timeout: 10000,
        });
        pageUrl = page.url();

        // pathName = await page.evaluate(function() {
        //     return Promise.resolve(location.pathname);
        // })
        // fileName = getFileNameFromPath(pathName);

        console.log("Page url is : " + pageUrl);
        await page.screenshot({
            path: "iPhone-screenshots/" + paths[i].title + ".jpg",
            fullPage: true
        });
    }

    await browser.close();
})();