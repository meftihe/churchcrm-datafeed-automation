const fs = require('fs');
const csv = require('csv-parser');
const { Browser, Builder, By, Key } = require('selenium-webdriver');
require('dotenv').config();

SYSTEM_URL = 'https://crm.amskhc.org/session/begin';

const members = [];

fs.createReadStream('assets/members.csv')
  .pipe(csv())
  .on('data', (data) => {
    members.push(data);
  })
  .on('end', async () => {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get(SYSTEM_URL);
    const loginForm = await driver.findElement(By.name('LoginForm'));
    const username = await driver.findElement(By.name('User'));
    const password = await driver.findElement(By.name('Password'));

    username.sendKeys(process.env.CRMUSER);
    password.sendKeys(process.env.CRMPWD);

    loginForm.submit();

    // await driver.quit();
    // console.log(members);
  });
