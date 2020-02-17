import puppeteer from "puppeteer";
import moment from "moment";
import fs from "fs";
import minimist from "minimist";

(async () => {
  const options = {
    width: 1920,
    height: 1080
  };

  const { project, start_date, end_date } = minimist(process.argv.slice(2));

  const startOfMonth =
    start_date ||
    moment()
      .startOf("month")
      .format("DD/MM/YYYY");

  const endOfMonth =
    end_date ||
    moment()
      .endOf("month")
      .format("DD/MM/YYYY");

  if (!moment(start_date, "DD/MM/YYYY").isValid()) {
    console.error(start_date, "Is not a valid date");
  }

  if (!moment(end_date, "DD/MM/YYYY").isValid()) {
    console.error(end_date, "Is not a valid date");
  }

  if (!project) {
    throw Error("No project specified");
  }

  const browser = await puppeteer.launch({
    headless: false, // The browser is visible
    ignoreHTTPSErrors: true,
    slowMo: 20, // slow down by 20ms (better for the screenshots)
    defaultViewport: null,
    devtools: true,
    args: [
      `--window-size=${options.width},${options.height}`,
      "--disable-features=site-per-process"
    ] // new option
  });
  const page = await browser.newPage();
  await page.goto("https://dev.azure.com/agency-commerce");

  await page.waitForSelector("#i0116");

  const email = `${process.env.RPM_VSTS_USER}@travelport.com`;

  await page.type("#i0116", email);

  await page.waitForSelector("#idSIButton9");

  await page.click("#idSIButton9");

  await page.waitForSelector("#ContentPlaceHolder1_UsernameTextBox");

  await page.type(
    "#ContentPlaceHolder1_UsernameTextBox",
    `GALILEO\\${process.env.RPM_VSTS_USER}`
  );

  await page.type(
    "#ContentPlaceHolder1_PasswordTextBox",
    process.env.RPM_VSTS_PASSWORD
  );

  await page.click("#ContentPlaceHolder1_SubmitButton");

  await page.waitForSelector("#idBtn_Back");

  await page.click("#idBtn_Back");

  await page.waitForSelector(
    "#__bolt-suite-logo > span.brand.body-m.font-weight-heavy"
  );

  await page.goto(
    `https://dev.azure.com/agency-commerce/${project}/_apps/hub/ottostreifel.pull-request-search.pr-search-hub`
  );

  const elementHandle = await page.$("iframe");
  const frame = await elementHandle.contentFrame();

  await frame.waitForSelector("#results > div > table > tbody");

  await frame.click("#vss_13 > div.wrap > input[type=text]");

  await page.keyboard.press("Tab");

  await page.keyboard.type("Completed");

  await page.keyboard.press("Tab");

  await page.keyboard.type(email);

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  await page.keyboard.type(startOfMonth);
  await page.keyboard.press("Tab");

  await page.keyboard.type(endOfMonth);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await page.waitFor(3000);

  const frameContent = await frame.evaluate(() => document.body.innerHTML);

  const getAllPrs = frameContent.match(
    /href="https:\/\/dev\.azure\.com\/agency-commerce.*?"/g
  );
  const month = moment().format("YYYY-MM-DD");

  if (!fs.existsSync(month)) {
    fs.mkdirSync(month);
  }

  for (let index = 0; index < getAllPrs.length; index++) {
    console.log(getAllPrs[index]);

    const url = getAllPrs[index].replace("href=", "").replace('"', "");
    console.log("TCL: url", url);

    const name = url.match(/[0-9]+/g);
    console.log("TCL: name", name);

    await page.goto(`${url}`);
    await page.waitForSelector('[data-id="files"]');
    await page.click('[data-id="files"]');

    await page.waitFor(3000);

    await page.screenshot({ path: `${month}/${name}.png` });
  }

  await browser.close();
})();
