// node --inspect cms-create-section.js <domain-no-from-domainList.js> <section-id-to be appeneded to the "test_section">
// node --inspect cms-create-section.js <domain-no-from-domainList.js> <section-id-to be appeneded to the "test_section">
// break on first line
// node --debug-brk --inspect cms-create-section.js <domain-no-from-domainList.js> <section-id-to be appeneded to the "test_section">
// node --inspect cms-create-section.js 0 12

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
const del = require('del');

/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain     = domainList[domainItem].cmsDomain;
/*END: Domain Name From CommandLine argument*/

/*START: get the section no to be appeneded to the "test_section"*/

var testSectionName = "test_section" + (process.argv[3] || "");


/*END: get the section no to be appeneded to the "test_section"*/

var delayInputType = 0;



var contentCreationPage = "/publisher/editor/sectionconfiguration";

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
 


    //select section or program
    await page.select('#sectionType', 'SUB_SECTION'); 

    //name
    await page.type("#name", testSectionName, {delay: delayInputType});


    //displayName
    await page.type("#displayName", testSectionName, {delay: delayInputType});

    //title
    await page.type("#title", testSectionName, {delay: delayInputType});

    //description
    await page.type("#description", testSectionName, {delay: delayInputType});


    //keywords
    await page.type("#keywords", testSectionName, {delay: delayInputType});


    //url
    await page.type("#url", testSectionName, {delay: delayInputType});

    //click the checkbox of loadMoreSectionNews
    await page.click('#loadMoreSectionNews');


    //click the checkbox of active
    await page.click('#active');


    /*START: Click the save button*/
    
    await page.click('[name="save"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    /*END: Click the save button*/


    /*START: Click the top add component*/


    await page.waitForSelector('.topregion .addComponent');
    await page.click('.topregion .addComponent');
    await page.type(".topregion #component-title", "my top", {delay: delayInputType});
    //1 --> featured, 1 --> mega, 25 --> STATIC CONTENT TOP, 50 --> sports featured, 
    await page.select('.topregion #viewTypeId', '1'); 
    await page.click('.topregion .confirm-add-component');

    /*END: Click the top add component*/




    /*START: Add all the sidebar components*/

    await page.click('.sidebar .addComponent');

    let sidebarComponentArray = await page.evaluate(() => {

        let mainComponents = [];
        $(".sidebar ol li:first-child #viewTypeId option").each(function(i, e) {
           let compData = {value: $(this).attr("value"), optionVal:$(this).html()}
           mainComponents.push(compData);
        });

        return Promise.resolve(mainComponents);

    });

    console.log("Components Array");
    console.table && console.table(sidebarComponentArray);


    /*START: Filter out the unneessary component*/
    sidebarComponentArray = sidebarComponentArray.filter(function(item) {

        if(item.optionVal == 'TOP CONTRIBUTORS' 
           || item.optionVal == 'VIDEO BULLETIN' 
           || item.optionVal == 'CARTOON GALLERY'){
            return false;
        }
        return true;
    });
    /*END: Filter out the unneessary component*/
    /*START: fill the first component*/

    //comp title
    await page.type(".sidebar ol li:first-child #component-title", "my first sidebar", {delay: delayInputType});
    //select component
    await page.select('.sidebar ol li:first-child #viewTypeId', sidebarComponentArray[0].value); 


    await page.click('.sidebar ol li:first-child .confirm-add-component');

    /*END: fill the first component*/

    /*START: Fill the remaining compoennt*/
    


    for (let i = 1; i < sidebarComponentArray.length; i++) {

        

        await page.click('.sidebar .addComponent');
        //comp title
        await page.type(`.sidebar ol li:nth-child(${i+1}) #component-title`, `my-sidebar-comp-${sidebarComponentArray[i].optionVal}`, {delay: delayInputType});
        //select component
        await page.select(`.sidebar ol li:nth-child(${i+1}) #viewTypeId`, sidebarComponentArray[i].value); 

        await page.click(`.sidebar ol li:nth-child(${i+1}) .confirm-add-component`);



    }



    /*END: Fill the remaining compoennt*/

    /*END: Add all the sidebar components*/


    /*START: Add all the main components*/

    await page.click('.section .addComponent');

    let mainComponentArray = await page.evaluate(() => {

        let mainComponents = [];
        $(".section ol li:first-child #viewTypeId option").each(function(i, e) {
           let compData = {value: $(this).attr("value"), optionVal:$(this).html()}
           mainComponents.push(compData);
        });
        return Promise.resolve(mainComponents);

    });

    console.log("Sidebar Components Array");
    console.table && console.table(mainComponentArray);


    /*START: Filter out the unneessary component*/
    mainComponentArray = mainComponentArray.filter(function(item) {

        if(item.optionVal == 'CURRENCY_CONVERTER'){
            return false;
        }
        return true;
    });
    /*END: Filter out the unneessary component*/


    /*START: fill the first component*/

    //comp title
    await page.type(".section ol li:first-child #component-title", "my first main", {delay: delayInputType});
    //select component
    await page.select('.section ol li:first-child #viewTypeId', mainComponentArray[0].value); 


    await page.click('.section ol li:first-child .confirm-add-component');

    /*END: fill the first component*/

    /*START: Fill the remaining compoennt*/
    
    for (let i = 1; i < mainComponentArray.length; i++) {
        
        if(mainComponentArray[i].optionVal == ''){
            continue;
        }


        await page.click('.section .addComponent');
        //comp title
        await page.type(`.section ol li:nth-child(${i+1}) #component-title`, `my-comp-${mainComponentArray[i].optionVal}`, {delay: delayInputType});
        //select component
        await page.select(`.section ol li:nth-child(${i+1}) #viewTypeId`, mainComponentArray[i].value); 

        await page.click(`.section ol li:nth-child(${i+1}) .confirm-add-component`);
    }



    /*END: Fill the remaining compoennt*/

    /*END: Add all the sidebar components*/


    /*START: Click the save button*/
    
    await page.click('#section_layout_btn [name="save"]');
    await page.waitForNavigation({
        waitUntil: 'load',

    });
    /*END: Click the save button*/




    /*START: fill main compoennts*/
    
    //go to main bar tab
    await page.waitForSelector('.tabs.cf');
    await page.click('.tabs.cf');
    await page.waitForSelector('.tabs.cf');
    await page.waitFor("#sidebar");
    await page.waitFor(3000);



    /*END: fill main compoennts*/


    //Get Images from the sidebar and put it in drag and drop field

    const searchTabInSidebar = await page.$('dt#search a');
    await searchTabInSidebar.click();
    await page.click('#advanced_search');
    await page.click('input[value="ARTICLE"]');
    await page.click('input[value="PUBLISHED"][name="statuses"]');
    await page.click('#searchForm #search_button');

    await page.waitForSelector('#searchResults li.cf.enabled ')


    await page.click('#searchResults li.cf.enabled ');

    // /*START: Drag image 1 from the sidebar and place it in main media asset drag and drop field*/
    // mainmediaAssetEl = await page.$('#Urelated');
    // mainmediaAssetBoundingBox = await mainmediaAssetEl.boundingBox();


    //  draggedEl = await page.$('#searchResults li.cf.enabled ');
    //  draggedElBoundingBox = await draggedEl.boundingBox();

    // await page.mouse.move(draggedElBoundingBox.x + draggedElBoundingBox.width / 2, draggedElBoundingBox.y + draggedElBoundingBox.height / 2);
    // await page.mouse.down();
    // await page.mouse.move(mainmediaAssetBoundingBox.x + mainmediaAssetBoundingBox.width / 2, mainmediaAssetBoundingBox.y + mainmediaAssetBoundingBox.height / 2);
    // await page.mouse.up();
    // /*END: Drag image 1 from the sidebar and place it in main media asset drag and drop field*/

    // /*START: Drag image 2 from the sidebar and place it in main media asset drag and drop field*/
    // mainmediaAssetEl = await page.$('#Urelated');
    // mainmediaAssetBoundingBox = await mainmediaAssetEl.boundingBox();


    //  draggedEl = await page.$('#searchResults li.cf.enabled:nth-child(3)');
    //  draggedElBoundingBox = await draggedEl.boundingBox();

    // await page.mouse.move(draggedElBoundingBox.x + draggedElBoundingBox.width / 2, draggedElBoundingBox.y + draggedElBoundingBox.height / 2);
    // await page.mouse.down();
    // await page.mouse.move(mainmediaAssetBoundingBox.x + mainmediaAssetBoundingBox.width / 2, mainmediaAssetBoundingBox.y + mainmediaAssetBoundingBox.height / 2);
    // await page.mouse.up();
    // /*END: Drag image 2 from the sidebar and place it in main media asset drag and drop field*/


    // /*START: Drag image 3 from the sidebar and place it in main media asset drag and drop field*/
    // mainmediaAssetEl = await page.$('#Urelated');
    // mainmediaAssetBoundingBox = await mainmediaAssetEl.boundingBox();

    // draggedEl = await page.$('#searchResults li.cf.enabled:nth-child(4)');
    // draggedElBoundingBox = await draggedEl.boundingBox();

    // await page.mouse.move(draggedElBoundingBox.x + draggedElBoundingBox.width / 2, draggedElBoundingBox.y + draggedElBoundingBox.height / 2);
    // await page.mouse.down();
    // await page.mouse.move(mainmediaAssetBoundingBox.x + mainmediaAssetBoundingBox.width / 2, mainmediaAssetBoundingBox.y + mainmediaAssetBoundingBox.height / 2);
    // await page.mouse.up();
    // /*END: Drag image 3 from the sidebar and place it in main media asset drag and drop field*/


    // /*START: Click Approve and then publish*/
    // await page.click('[value="APPROVE"]');
    // await page.waitForNavigation({
    //     waitUntil: 'load',

    // });
    // await page.click('[value="PUBLISH"]');

    // /*END: Click Approve and then publish*/




    /*END: Populating the content creation pages with values*/


    /*START: Click Approve and then publish*/
    // await page.click('[value="APPROVE"]');
    // await page.waitForNavigation({
    //     waitUntil: 'load',

    // });
    // await page.click('[value="PUBLISH"]');

    /*END: Click Approve and then publish*/


})();