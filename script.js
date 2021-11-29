// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

const fs = require('fs');

(async () => {
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
    const browser = await puppeteer.launch({
        executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome",
        headless: false,
        args: ["--incognito", "--start-maximized"],
    });

    const page = (await browser.pages())[0];


    const url = fs.readFileSync('url.txt', 'utf-8');
    await page.goto(url);
    const li = await page.evaluate(function () {
        const list = document.querySelectorAll("#wc-endpoint");
        let l = "";
        list.forEach((element) => {
            l +=  element.getAttribute("href") + 'saperator';
        });
        return l;
    });
    await page.click('#container #menu-container ytd-toggle-button-renderer');
    await page.click('#contentWrapper yt-formatted-string[id="text"]');

    await page.waitForTimeout(3000);

    const email = fs.readFileSync('email.txt', 'utf-8')
    const password = fs.readFileSync('password.txt', 'utf-8')
    await page.type('[type="email"]', email);
    await page.click('[data-is-touch-wrapper="true"]');
    await page.waitForTimeout(5000);
    await page.type('[type="password"]', password);
    await page.click('[data-is-touch-wrapper="true"]');
    await page.waitForTimeout(5000);
    const arr = li.split("saperator");
    console.log(arr.length);
    for(let i = 0; i < arr.length - 1; ++i) {
        await page.goto('https://www.youtube.com' + arr[i]);

        await page.waitForTimeout(1000);    
        let title = await page.evaluate(() =>
            document.querySelector('ytd-video-primary-info-renderer h1').innerText
        );
        console.log(title + '\n\n');
        await page.waitForTimeout(1000);
        await page.evaluate(function () {
            document.querySelectorAll('#container #menu-container ytd-toggle-button-renderer')[1].click();
        });
        await page.waitForTimeout(1000);
        await page.evaluate(function () {
            document.querySelectorAll('#container #menu-container ytd-toggle-button-renderer')[0].click();
        });
        await page.waitForTimeout(1000);
    }
    await browser.close();
    console.log('Script is completed');
})();
