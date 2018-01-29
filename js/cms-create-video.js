// node --inspect cms-create-video.js 
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

/*START: Get Page Data*/
var contentData = require('./cms-data/video').data;
/*END: Get Page Data*/

var contentCreationPage = "/publisher/editor/video/multiple/upload";

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
    var pagesList;
    
    var page = await browser.newPage();
    await page.setViewport({ width: 2300, height: 1239 });

    /*START: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/
    await page.goto(domain + "/publisher/login", {
        waitUntil: 'load',

    });
    await page.type("#username", contentData.userName, {delay: delayInputType});
    await page.type("#password", contentData.password, {delay: delayInputType});
    await page.click("[value='Sign in']");

    await page.waitFor("#sidebar");
    /*END: Go to Login Page and Login and wait until the logged in page came by checking sidebar*/


    await page.goto(domain + contentCreationPage, {
        waitUntil: 'load'
    });




    /*START: Get Frames and get video frame, Upload the video file*/


    var mainFrame = await page.mainFrame();
    var childFrames = await page.frames();
    var videoCreatedUrl;
    var videoCreatedAnchorEl;
    for (let i = 0; i < childFrames.length; i++) {
        if ( childFrames[i]._url.search(/\/publisher\/page\/multiUpload\.jsp/ig) > -1) {
            let multiUploadVideoFrame = childFrames[i];

            await multiUploadVideoFrame.waitForSelector('input[name="uploadFile"]');
            let videoFile = await multiUploadVideoFrame.$('input[name="uploadFile"]');


            await videoFile.uploadFile("/Users/Mohamed_Hussain_SH/dump/dummy-images/test_Images/test_video/Wildlife.mp4");

            await page.waitFor(60000); 
            await multiUploadVideoFrame.waitForFunction(function() {
                if($(".scroll-pane .files  td:nth-child(3) span").length > 0 &&
                   $(".scroll-pane .files td:nth-child(3) span").html() == 'COMPLETE'){
                    $('.scroll-pane .files  td:nth-child(4) a').click();
                    console.log("wooo");
                    console.log($('.scroll-pane .files  td:nth-child(4) a').length);
                    console.log($('.scroll-pane .files  td:nth-child(4) a'));
                    console.log($('.scroll-pane .files  td:nth-child(4) a').attr("href"));
                    return true;
                }


            }, {polling : "mutation"});

            videoCreatedUrl = await multiUploadVideoFrame.evaluate(function() {
                
                return $('.scroll-pane .files  td:nth-child(4) a').attr("href");
            })
            console.log("video created url: "+ videoCreatedUrl);

            
            var myelement = await multiUploadVideoFrame.$('.scroll-pane .files  td:nth-child(4) a');
            await myelement.click();
            


        }
    }

    
    // await page.waitForNavigation({
    //     waitUntil: 'load',

    // });


    /*END: Get Frames and get video frame, Upload the video file*/


    await page.waitFor(2000);
    /*START: Go to the Created Video and Fill the Data*/


    pagesList = await browser.pages();

    for (let x = 0; x < pagesList.length; x++) {
        if(x==2){

           page = pagesList[x];
        }
    }
    
await page.setViewport({ width: 2300, height: 1239 });


    /*END: Go to the Created Video and Fill the Data*/



    /*START: Populating the content creation pages with values*/
    



    //select default section
    await page.select('#defaultSectionId', contentData.sectionId.toString()); 

    //topics
    var topicHTML = "";
    for (let i = 0; i < contentData.topics.length; i++) {
        topicHTML += '<li>' + contentData.topics[i].name + '&nbsp;&nbsp;<a href="javascript:void(0)" data-item-index="'+ i +'">x</a><input id="terms'+ i +'" type="hidden" name="topics['+ i +'].contentId" value="'+ contentData.topics[i].id +'"></li>';
    }
    await page.evaluate(function(topicHTML) {
        $("#termInputs").html(topicHTML);
        return true;
    }, topicHTML);



    //tags
    var tagHTML = "";
    for (let i = 0; i < contentData.tags.length; i++) {
        tagHTML += '<li> ' + contentData.tags[i].name + ' &nbsp; <input value="' + contentData.tags[i].id + '" type="hidden" name="terms[' + i + '].id" id="terms' + i + '.id"><a id="terms[' + i + '].remove" href="javascript:void(0)">×</a> </li>';
    }
    await page.evaluate(function(tagHTML) {
        $("#tagTermInputs").html(tagHTML);
        return true;
    }, tagHTML);
  

    //select whehter normal video or vertical video
    await page.select('select#type', 'VIDEO'); 


    //headline
    await page.type("#headline", contentData.headline, {delay: delayInputType});


    //description
    await page.type("#summary", contentData.description, {delay: delayInputType});

    //metaDescription
    await page.type("#metaDescription", contentData.metaDescription, {delay: delayInputType});


    /*START: Get Image set  from the sidebar*/
    
    searchTabInSidebar = await page.$('dt#search a');
    await searchTabInSidebar.click();
    await page.click('#advanced_search');
    await page.click('input[value="IMAGE_SET"]');
    await page.click('input[value="PUBLISHED"][name="statuses"]');
    await page.click('#searchForm #search_button');

    await page.waitForSelector('#searchResults li.cf.enabled ')
    /*END: Get Image set  from the sidebar*/




    

    /*START: Drag Image from the sidebar and place it in main media asset drag and drop field*/
    mainmediaAssetEl = await page.$('#Urelated');
    mainmediaAssetBoundingBox = await mainmediaAssetEl.boundingBox();


    draggedEl = await page.$('#searchResults li.cf.enabled ');
    draggedElBoundingBox = await draggedEl.boundingBox();

    await page.mouse.move(draggedElBoundingBox.x + draggedElBoundingBox.width / 2, draggedElBoundingBox.y + draggedElBoundingBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(mainmediaAssetBoundingBox.x + mainmediaAssetBoundingBox.width / 2, mainmediaAssetBoundingBox.y + mainmediaAssetBoundingBox.height / 2);
    await page.mouse.up();
    /*END: Drag Image from the sidebar and place it in main media asset drag and drop field*/

    

    /*START: Fill Location Info for the content*/
    
    await page.type("#geocomplete", contentData.location.placeName, {delay: delayInputType});
    await page.click('#find');
    await page.waitFor(5000);
    /*END: Fill Location Info for the content*/



    /*START: Click Approve and then publish*/
    await page.click('[value="APPROVE"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    await page.click('[value="PUBLISH"]');

    /*END: Click Approve and then publish*/




    /*END: Populating the content creation pages with values*/


   


})();