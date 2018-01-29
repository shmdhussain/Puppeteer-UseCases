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

    for (var i = 0; i < paths.length; i++) {

        let pageItemData = { title: paths[i].title, unoptimizedImageDataMobile: [], unoptimizedImageDataDesktop: [], 
                             desktopScore:"" , mobileScore:"", desktopRank:"" , mobileRank:"" }

        /*START: Open new tab for each path*/
        var page = await browser.newPage(); 
        await page.setViewport({ width: 2300, height: 1239 });
        /*END: Open new tab for each path*/

        await page.goto("https://developers.google.com/speed/pagespeed/insights/", {
            timeout: 0,
        });

        pageUrl = page.url();
        console.log("Page url is : " + pageUrl);
        

        /*START: My task: get the unoptimized images*/

        await page.type('[name="url"]', domain + paths[i].url);
        await page.click('div.analyze');
        await page.waitForSelector(".result-group-title-card-mark");
        await page.waitFor(5000);
        await page.waitForSelector(".result-group-title-card-mark");


        /*START: Getting unoptimized Images For Mobile Layout*/
        
        pageItemData.unoptimizedImageDataMobile = await page.evaluate(() => {


            var pageItemImgData = [];

            var mobileResultCont =document.querySelectorAll(".result-container > div:first-child")
            var failedResults = mobileResultCont[0].querySelectorAll(".goog-control.rule-result.failed")
            let unOptimImage = [];

            for (var k = 0; k < failedResults.length; k++) {
                console.log(failedResults[k]);
                
                let unOptimImageList = [];
                if((failedResults[k].querySelectorAll("h4.rule-title")[0].innerHTML) == 'Optimize images'){
                    unOptimImageList = failedResults[k].querySelectorAll(".url-block ul li");
                    console.log(unOptimImageList);
                    for (var j = 0; j < unOptimImageList.length; j++) {

                        unOptimImage.push(unOptimImageList[j].querySelector(".url-external").getAttribute('data-title'));
                    }
                }
                
            }
            return Promise.resolve(unOptimImage);
        });

        /*END: Getting unoptimized Images For Mobile Layout*/
        /*START: Getting unoptimized Images For DESKTOP Layout*/
        pageItemData.unoptimizedImageDataDesktop = await page.evaluate(() => {


            var pageItemImgData = [];

            var mobileResultCont =document.querySelectorAll(".result-container > div:last-child")
            var failedResults = mobileResultCont[0].querySelectorAll(".goog-control.rule-result.failed")
            let unOptimImage = [];

            for (var k = 0; k < failedResults.length; k++) {
                console.log(failedResults[k]);
                
                let unOptimImageList = [];
                if((failedResults[k].querySelectorAll("h4.rule-title")[0].innerHTML) == 'Optimize images'){
                    unOptimImageList = failedResults[k].querySelectorAll(".url-block ul li");
                    console.log(unOptimImageList);
                    for (var j = 0; j < unOptimImageList.length; j++) {

                        unOptimImage.push(unOptimImageList[j].querySelector(".url-external").getAttribute('data-title'));
                    }
                }
                
            }
            return Promise.resolve(unOptimImage);
        });
        /*END: Getting unoptimized Images For DESKTOP Layout*/


        /*START: Get the Page Speed Rankings for the Mobile Page*/
        var mobileRankObj = await page.evaluate(() => {


            var rankObj = {};

            var mobileResultCont = document.querySelectorAll(".result-container > div:first-child")
            rankObj.score = mobileResultCont[0].querySelector(".result-group-title-card-score span").innerHTML;
            rankObj.rank = mobileResultCont[0].querySelector(".result-group-title-card-mark").innerHTML;
            
            return Promise.resolve(rankObj);
        });

        pageItemData.mobileRank = mobileRankObj.rank;
        pageItemData.mobileScore = mobileRankObj.score;


        /*END: Get the Page Speed Rankings for the Mobile Page*/

        /*START: Get the Page Speed Rankings for the Mobile Page*/
        var desktopRankObj = await page.evaluate(() => {


            var rankObj = {};

            var mobileResultCont =document.querySelectorAll(".result-container > div:last-child")
            rankObj.score = mobileResultCont[0].querySelector(".result-group-title-card-score span").innerHTML;
            rankObj.rank = mobileResultCont[0].querySelector(".result-group-title-card-mark").innerHTML;
            
            return Promise.resolve(rankObj);
        });

        pageItemData.desktopRank = desktopRankObj.rank;
        pageItemData.desktopScore = desktopRankObj.score;


        /*END: Get the Page Speed Rankings for the Mobile Page*/



        /*END: My task: get the unoptimized images*/

        console.log("%c Page speed Insight for the Page--->%c %s" , "color:blue", "color:brown", paths[i].title);
        console.log("Page speed Insight for the URL--->%c %s" , "color:brown", paths[i].url);

        console.log("Desktop UnOptimized Images");
        console.table(pageItemData.unoptimizedImageDataDesktop);
        if(pageItemData.desktopRank.toLowerCase() == 'poor'){
            console.log("rank of the desktop page ----> %c %s", "color:red", pageItemData.desktopRank);
            console.log("score of the desktop page ----> %c %s", "color:red",pageItemData.desktopScore);
        }else{
            console.log("rank of the desktop page ----> %c %s", "color:green", pageItemData.desktopRank);
            console.log("score of the desktop page ----> %c %s", "color:green",pageItemData.desktopScore);

        }

        console.log("Mobile UnOptimized Images");
        console.table(pageItemData.unoptimizedImageDataMobile);
        if(pageItemData.mobileRank.toLowerCase() == 'poor'){
            console.log("rank of the mobile page ----> %c %s",  "color:red", pageItemData.mobileRank);
            console.log("score of the mobile page ----> %c %s", "color:red", pageItemData.mobileScore);
        }else{
            console.log("rank of the mobile page ----> %c %s",  "color:green", pageItemData.mobileRank);
            console.log("score of the mobile page ----> %c %s", "color:green", pageItemData.mobileScore);
        }


        allPagesData.push(pageItemData);
        

    }

    console.log(allPagesData);
    // await browser.close();
})();