import fs from 'fs';
import csv from 'csv-parser';
import { Browser, Builder } from 'selenium-webdriver';
import dotenv from 'dotenv';
import loginUser, { exitBrowser, saveMember } from './actions.js';

dotenv.config();

const SYSTEM_BASE_URL = 'https://crm.amskhc.org';

const members = [];

let driver = await new Builder().forBrowser(Browser.CHROME).build();

await driver.get(SYSTEM_BASE_URL);

await loginUser(driver, `${SYSTEM_BASE_URL}/PersonEditor`);

fs.createReadStream('assets/members.csv')
  .pipe(csv())
  .on('data', async (data) => {
    members.push(data);
  })
  .on('end', async () => {
    await saveMember(driver, members[0]);
    console.log('CSV file successfully processed');
  });

exitBrowser(driver);
