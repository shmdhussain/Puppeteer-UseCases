const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({

        headless: false,
        executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
        args: ["--window-size=2400,1239"]


    });
    const page = await browser.newPage();
    await page.setViewport({width: 2300, height:1239});


    await page.goto('http://10.64.161.22:8080/publisher/login' ,{
        waitUntil: 'load'
    });
    if(){
    	await page.type("#username", "sysadmin");
    	await page.type("#password", "F00bar");
    	await page.click("[value='Sign in']")
    }
})();