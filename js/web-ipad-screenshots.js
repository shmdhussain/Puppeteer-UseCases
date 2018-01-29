const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPad = devices['iPad'];
const del = require('del');



/*START: Delete the all screen shots for the current device*/
del(['iPad-screenshots/*.jpg']).then(paths => {
    console.log("Deleted the files");
});
/*END: Delete the all screen shots for the current device*/

var domain = "http://10.64.161.22:8282";

/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/allUrl').paths;
/*END: Paths to be tested coming from the JSON*/


(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var fileName;
    var pageUrl;
    var pathName;
    const page = await browser.newPage();
    // await page.setViewport({width: 2300, height:1239});
    await page.emulate(iPad);

    for (var i = 0; i < paths.length; i++) {
        await page.goto(domain + paths[i].url, {
            timeout: 0
        });
        pageUrl = page.url();


        console.log("Page url is : " + pageUrl);
        await page.waitFor(20000);
        await page.screenshot({
            path: "iPad-screenshots/" + paths[i].title + ".jpg",
            fullPage: true
        });
    }

    await browser.close();
})();