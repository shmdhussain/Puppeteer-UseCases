const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');

/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain     = domainList[domainItem].cmsDomain;
/*END: Domain Name From CommandLine argument*/

var delayInputType = 0;



var contentCreationPage = "/publisher/editor/imagegallery";

(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        ignoreHTTPSErrors: true,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    var fileName;
    var pageUrl;
    var pathName;
    var mainmediaAssetBoundingBox;
    var mainmediaAssetEl;

    const page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });

    /*START: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/
    await page.goto(domain + "/publisher/login", {
        waitUntil: 'load',

    });
    await page.type("#username", "sysadmin", {delay: delayInputType});
    await page.type("#password", "F00bar", {delay: delayInputType});
    await page.click("[value='Sign in']");

    await page.waitFor("#sidebar");
    /*END: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/


    await page.goto(domain + contentCreationPage, {
        waitUntil: 'load'
    });

    /*START: Populating the content creation pages with values*/
 


    //select default section
    await page.select('#defaultSectionId', '2'); 

    //topics
    await page.$$eval("#termInputs", function(tagTermInputs) {
        $("#termInputs").html('<li>أخبار إيران&nbsp;&nbsp;<a href="javascript:void(0)" data-item-index="0">x</a><input id="terms0" type="hidden" name="topics[0].contentId" value="781269"></li>');
    });

    //tags
    await page.$$eval("#tagTermInputs", function(tagTermInputs) {
        $("#tagTermInputs").html('<li> test&nbsp; <input value="15886" type="hidden" name="terms[0].id" id="terms0.id"><a id="terms[0].remove" href="javascript:void(0)">×</a> </li>'
                                 +'<li>إنفوغرافيك&nbsp; <input id="terms1.id" name="terms[1].id" type="hidden" value="96802"><a id="terms[1].remove" href="javascript:void(0)">×</a></li>');
    });

    //select whehter normal image or vertical image set
    await page.select('select#type', 'IMAGE_GALLERY'); 


    //headline
    await page.type("#headline", "test headline", {delay: delayInputType});


    //description
    await page.type("#summary", "test description", {delay: delayInputType});

    //metaDescription
    await page.type("#metaDescription", "test meta description", {delay: delayInputType});


    //Get Images from the sidebar and put it in drag and drop field


    const searchTabInSidebar = await page.$('dt#search a');
    await searchTabInSidebar.click();
    await page.click('#advanced_search');
    await page.click('input[value="IMAGE_SET"]');
    await page.click('input[value="PUBLISHED"][name="statuses"]');
    await page.click('#searchForm #search_button');

    await page.waitForSelector('#searchResults li.cf.enabled ');


    



    // Drag elemnts from the sidebar and place it in main media asset drag and drop field

    mainmediaAssetEl = await page.$('#Urelated');
    mainmediaAssetBoundingBox = await mainmediaAssetEl.boundingBox();


    const e = await page.$('#searchResults li.cf.enabled ');

    const box = await e.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    // await page.mouse.move(100, 200); // move to (100, 200) coordinates
    await page.mouse.move(mainmediaAssetBoundingBox.x + mainmediaAssetBoundingBox.width / 2, mainmediaAssetBoundingBox.y + mainmediaAssetBoundingBox.height / 2);
    await page.mouse.up();

    /*START: Click Approve and then publish*/
    await page.click('[value="APPROVE"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    await page.click('[value="PUBLISH"]');

    /*END: Click Approve and then publish*/


    /*END: Populating the content creation pages with values*/


    /*START: Click Approve and then publish*/
    // await page.click('[value="APPROVE"]');
    // await page.waitForNavigation({
    //     waitUntil: 'load',

    // });
    // await page.click('[value="PUBLISH"]');

    /*END: Click Approve and then publish*/


})();