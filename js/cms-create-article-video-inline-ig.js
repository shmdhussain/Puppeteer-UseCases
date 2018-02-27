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



var contentCreationPage = "/publisher/editor/article";

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

    var draggedElBoundingBox;
    var draggedEl;

    var searchTabInSidebar;
    
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
        $("#tagTermInputs").html('<li> test&nbsp; <input value="15886" type="hidden" name="terms[0].id" id="terms0.id"><a id="terms[0].remove" href="javascript:void(0)">×</a> </li>');
    });

    //select whehter normal image or vertical image set
    // await page.select('select#type', 'IMAGE_GALLERY'); 


    //headline
    await page.type("#headline", "test headline", {delay: delayInputType});


    //description
    await page.type("#summary", "test description", {delay: delayInputType});

    //metaDescription
    await page.type("#metaDescription", "test meta description", {delay: delayInputType});


    /*START: Get videos from the sidebar*/
    
    searchTabInSidebar = await page.$('dt#search a');
    await searchTabInSidebar.click();
    await page.click('#advanced_search');
    await page.click('input[value="VIDEO"]');
    await page.click('input[value="PUBLISHED"][name="statuses"]');
    await page.click('#searchForm #search_button');

    await page.waitForSelector('#searchResults li.cf.enabled ')
    /*END: Get videos from the sidebar*/




    

    /*START: Drag VIDEO from the sidebar and place it in main media asset drag and drop field*/
    mainmediaAssetEl = await page.$('#Urelated');
    mainmediaAssetBoundingBox = await mainmediaAssetEl.boundingBox();


     draggedEl = await page.$('#searchResults li.cf.enabled ');
     draggedElBoundingBox = await draggedEl.boundingBox();

    await page.mouse.move(draggedElBoundingBox.x + draggedElBoundingBox.width / 2, draggedElBoundingBox.y + draggedElBoundingBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(mainmediaAssetBoundingBox.x + mainmediaAssetBoundingBox.width / 2, mainmediaAssetBoundingBox.y + mainmediaAssetBoundingBox.height / 2);
    await page.mouse.up();
    /*END: Drag VIDEO from the sidebar and place it in main media asset drag and drop field*/

    /*START: Put Inline Image Gallery in article body*/
    
        /*START: Get Image Gallery from the sidebar*/
        await page.waitFor(3000);
        searchTabInSidebar = await page.$('dt#search a');
        await searchTabInSidebar.click();
        await page.click('#advanced_search');
        await page.click('#search_data input[value="VIDEO"]');
        await page.click('#search_data input[value="IMAGE_GALLERY"]');
        await page.click('#search_data input[value="PUBLISHED"][name="statuses"]');
        await page.click('#searchForm #search_button');

        await page.waitForSelector('#searchResults li.cf.enabled ')
        /*END: Get Image Gallery from the sidebar*/

        /*START: Drag Image Gallery from the sidebar and place it in article body*/
        var articleBody = await page.$('#body_ifr');
        articleBodyBoundingBox = await articleBody.boundingBox();


        draggedEl = await page.$('#searchResults li.cf.enabled ');
        draggedElBoundingBox = await draggedEl.boundingBox();

        await page.mouse.move(draggedElBoundingBox.x + draggedElBoundingBox.width / 2, draggedElBoundingBox.y + draggedElBoundingBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(articleBodyBoundingBox.x + articleBodyBoundingBox.width / 2, articleBodyBoundingBox.y + articleBodyBoundingBox.height / 2);
        await page.mouse.up();
        /*END: Drag Image Gallery from the sidebar and place it in article body*/

    
    /*END: Put Inline Image Gallery in article body*/



    /*START: Put Content in article Body*/


    var iframeContent = await page.$eval("#body_ifr", function(iframeBodyEl) {
        
        $(iframeBodyEl).contents().find("body").append("<p>Test Article 1</p>");
        $(iframeBodyEl).contents().find("body").append("<p>Test Article 2</p>");
        $(iframeBodyEl).contents().find("body").append("<p>Test Article 3</p>");
        $(iframeBodyEl).contents().find("body").append("<p>Test Article 4</p>");
        return Promise.resolve("done")
    })


    /*END: Put Content in article Body*/


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