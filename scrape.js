/*jshint esversion: 8 */
const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const title = await page.title();

    const [el1] = await page.$x(
        '//*[@id="mw-content-text"]/div/table[1]/tbody/tr[1]/td/a/img'
    );
    const src = await el1.getProperty("src");
    const imgURL = await src.jsonValue();

    const [el2] = await page.$x(
        '//*[@id="mw-content-text"]/div'
    );
    const txt = await el2.getProperty("textContent");
    const body = await txt.jsonValue();

    const link = await page.$$eval("a", (as) =>
        as.map((a) => a.href)
    );

    const linktxt = await JSON.stringify(link);

    console.log({ title, imgURL });
    fs.writeFile("wikibody.rtf", body, (err) => {
        if (err) throw err;
        console.info("File Saved");
    });


    fs.writeFile("links.csv", linktxt, (err) => {
        if (err) throw err;
        console.info("Links Saved!");
    });
    browser.close();
}

module.exports.scrape = scrape;