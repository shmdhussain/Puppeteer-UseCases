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


    for (var i = 0; i < paths.length; i++) {
        /*START: Open new tab for each path*/
        
        var page = await browser.newPage();
        await page.emulate(iPad);
        /*END: Open new tab for each path*/

        await page.goto(domain + paths[i].url, {
            timeout: 0,
        });
        pageUrl = page.url();
        console.log("Page url is : " + pageUrl);
        
        /*START: My task: check Load More is present*/

        var loadMorePresent = await page.evaluate(() => {

          var loadMorePresentLocal;  
          loadMorePresentLocal = lodash.get($("[data-sna-init]").data('sna-init'), "initData.showLoadMore", null);  
          console.log("Load More Present: "+loadMorePresentLocal);  
          return Promise.resolve(loadMorePresentLocal);


        });
        console.log("Load More Present in node: "+loadMorePresent)
        /*END: My task: check Load More is present*/
    }

    // await browser.close();
})();