// node --inspect web-css-properties-test.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node --inspect web-css-properties-test.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// break on first line
// node --debug-brk web-css-properties-test.js <domain-no-from-domainList.js> <mobile==1, tablet == 2>
// node  --inspect web-css-properties-test.js 0 1
// node  --debug-brk --inspect web-css-properties-test.js 0 1


const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

const iPhone5 = devices['iPhone 5']; //320
const iPhone6 = devices['iPhone 6']; //375
const nexus7 = devices['Nexus 7']; //600
const nexus6L = devices['Nexus 6 landscape']; //732
const iPad = devices['iPad']; //768
const smallDesktop = "smallDesktop"; //1300
const normalDesktop = "normalDesktop"; //1700

var devicesArray = [iPhone5, iPhone6, nexus7, nexus6L, iPad, smallDesktop, normalDesktop]

var mobileIndex = [0, 1, 2, 3];
var tabletIndex = [4];
var desktopIndex = [5, 6];

const del = require('del');
const fs = require('fs');




/*START: Domain Name From CommandLine argument*/
var domainItem = process.argv[2] || 0;
var domainList = require('./domains/domainList').domainList;

var domain = domainList[domainItem].webDomain;
/*END: Domain Name From CommandLine argument*/

/*START: Test Domain Name*/
var testDomainItem = process.argv[3] || 0;
var testDomainList = require('./domains/domainList').domainList;

var testDomain = testDomainList[testDomainItem].webDomain;
/*END: Test Domain Name*/


/*START: css selectors and its path to be tested*/
var cssSelectorPropertiesToTest = require('./testData/cssSelectorProperties').selectorsToTest;
/*END: css selectors and its path to be tested*/


/*START: Paths to be tested coming from the JSON*/
var paths = require('./paths/Web-Urls/css-properties-test-page-urls').paths;
/*END: Paths to be tested coming from the JSON*/


(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        // executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ["--window-size=2400,1239"]


    });
    var pageUrl;
    var loadMorePresent;

    var allPagesData = [];


    for (var j = 0; j < devicesArray.length; j++) {

        var deviceInTest;

        if (mobileIndex.indexOf(j) > -1) {
            deviceInTest = "mobile"
        } else if (tabletIndex.indexOf(j) > -1) {
            deviceInTest = "tablet"

        } else if (desktopIndex.indexOf(j) > -1) {
            deviceInTest = "desktop"

        }


            /*START: Open new tab for each device*/
            var page = await browser.newPage();
            /*END: Open new tab for each device*/

            if (devicesArray[j] == 'smallDesktop') {
                await page.setViewport({ width: 1300, height: 1239 });
            } else if (devicesArray[j] == 'normalDesktop') {
                await page.setViewport({ width: 1700, height: 1239 });
            } else {
                await page.emulate(devicesArray[j]);
            }


            let cssValueObj;
         

            /*START: My task: get computed css values for the properties*/

            for (var k = 0; k < cssSelectorPropertiesToTest.length; k++) {


                /*START: check if the property is supported for this device type*/
                if (!((cssSelectorPropertiesToTest[k].refDevices.indexOf("mobile") > -1 && (deviceInTest == "mobile")) ||
                        (cssSelectorPropertiesToTest[k].refDevices.indexOf("tablet") > -1 && (deviceInTest == "tablet")) ||
                        (cssSelectorPropertiesToTest[k].refDevices.indexOf("desktop") > -1 && (deviceInTest == "desktop")))) {

                    break;
                }
                
                /*END: check if the property is supported for this device type*/

                 //Go to the reference page
            await page.goto(domain + paths[cssSelectorPropertiesToTest[k].pageIndex].url, {
                timeout: 0,
            });


            //wait for some seconds to page to settle
            await page.waitFor(15000);
                cssValueObj = await page.evaluate((cssSelectorPropObj) => {

                    var cssValueObj = {
                        refElemCssPropObj: {},
                        testElemCssPropObj: {}
                    };
                    cssValueObj.refSelector = cssSelectorPropObj.refSelector;

                    console.log(cssSelectorPropObj);
                    let refElem = $(cssSelectorPropObj.refSelector);


                    for (let x = 0; x < cssSelectorPropObj.propertiesToTest.length; x++) {

                        cssValueObj.refElemCssPropObj[cssSelectorPropObj.propertiesToTest[x]] = refElem.css(cssSelectorPropObj.propertiesToTest[x]);


                    }
                    return Promise.resolve(cssValueObj);

                }, cssSelectorPropertiesToTest[k]);


            }



           


            for (var k = 0; k < cssSelectorPropertiesToTest.length; k++) {


                /*START: check if the property is supported for this device type*/
                if (!((cssSelectorPropertiesToTest[k].testDevices.indexOf("mobile") > -1 && (deviceInTest == "mobile")) ||
                        (cssSelectorPropertiesToTest[k].testDevices.indexOf("tablet") > -1 && (deviceInTest == "tablet")) ||
                        (cssSelectorPropertiesToTest[k].testDevices.indexOf("desktop") > -1 && (deviceInTest == "desktop")))) {

                    break;
                }
                //Go to the reference page
            await page.goto(testDomain + paths[cssSelectorPropertiesToTest[k].pageIndex].url, {
                timeout: 0,
            });


            //wait for some seconds to page to settle
            await page.waitFor(15000);
                /*END: check if the property is supported for this device type*/
                cssValueObj = await page.evaluate((cssSelectorPropObj, cssValueObj) => {

                    var cssValueObj = cssValueObj;

                    cssValueObj.testSelector = cssSelectorPropObj.testSelector;

                    console.log(cssSelectorPropObj);

                    let testElem = $(cssSelectorPropObj.testSelector);


                    for (let x = 0; x < cssSelectorPropObj.propertiesToTest.length; x++) {

                        cssValueObj.testElemCssPropObj[cssSelectorPropObj.propertiesToTest[x]] = testElem.css(cssSelectorPropObj.propertiesToTest[x]);


                    }
                    return Promise.resolve(cssValueObj);

                }, cssSelectorPropertiesToTest[k], cssValueObj);

                 allPagesData[k] = cssValueObj;
            // console.log(cssValueObj);
            
            console.log(cssValueObj.refSelector);
            console.log(cssValueObj.testSelector)
            console.table([cssValueObj.refElemCssPropObj, cssValueObj.testElemCssPropObj])


            }



            /*END: My task: get computed css values for the properties*/

    }




    console.log(allPagesData);
    // await browser.close();
})();