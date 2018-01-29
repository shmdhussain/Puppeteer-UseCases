const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPad = devices['iPad'];
const iPhone = devices['iPhone 6'];
const del = require('del');





var domain = "https://www.skynewsarabia.com";

/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/image-analysis').paths;
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
    await page.setViewport({width: 2300, height:1239});
    // await page.emulate(iPad);

    var allPagesData = [];



    for (var i = 0; i < paths.length; i++) {


        let pageItemData = { title: paths[i].title, imageData: [] }


        await page.goto(domain + paths[i].url, {
            timeout: 0
        });
        pageUrl = page.url();


        console.log("Page url is : " + pageUrl);
        await page.waitFor(20000);


        pageItemData.imageData = await page.evaluate(() => {
            var pageItemImgData = [];
            $("img[data-ng-src^='/web/images/']").each(function(index, el) {
                var item = { naturalWidth: this.naturalWidth, naturalHeight: this.naturalHeight, actualWidth: this.width, actualHeight: this.height, differenceWidth: this.naturalWidth - this.width, differenceHeight: this.naturalHeight - this.height , imageUrl: this.src };
                pageItemImgData.push(item);
            });
            return Promise.resolve(pageItemImgData);
        });
        console.log("page title: ---->" + paths[i].title);
        console.table(pageItemData.imageData);

        allPagesData.push(pageItemData);
    }
    console.log("All Pages Data");
    console.log(allPagesData);
    console.log()
    //await browser.close();
})();