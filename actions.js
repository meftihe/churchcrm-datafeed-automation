import { By, Select, until } from 'selenium-webdriver';

export default async function loginUser(driver) {
  const loginForm = await driver.findElement(By.name('LoginForm'));
  const username = await driver.findElement(By.name('User'));
  const password = await driver.findElement(By.name('Password'));

  await username.sendKeys(process.env.CRMUSER);
  await password.sendKeys(process.env.CRMPWD);
  await loginForm.submit();
}

export async function exitBrowser(driver) {
  await driver.sleep(1000);
  await driver.quit();
}

export async function saveMember(driver, member, currentFamily) {
  try {
    await driver.get(
      `${process.env.BASEURL}/PersonEditor.php?FamilyID=${currentFamily}`,
    );
    await driver.wait(until.elementLocated(By.id('FirstName')));

    const gender = await driver.findElement(By.id('Gender'));
    const firstName = await driver.findElement(By.id('FirstName'));
    const middleName = await driver.findElement(By.id('MiddleName'));
    const lastName = await driver.findElement(By.id('LastName'));
    const birthMonth = await driver.findElement(By.id('BirthMonth'));
    const birthDay = await driver.findElement(By.id('BirthDay'));
    const birthYear = await driver.findElement(By.id('BirthYear'));
    const familyRole = await driver.findElement(By.name('FamilyRole'));
    const becameChristian = await driver.findElement(By.name('c1'));
    const membershipDate = await driver.findElement(By.name('MembershipDate'));
    const educationLevel = await driver.findElement(By.name('c2'));
    const occupation = await driver.findElement(By.name('c3'));
    const baptism = await driver.findElement(By.name('c4'));
    const ministry = await driver.findElement(By.name('c6'));
    const cellPhone = await driver.findElement(By.name('CellPhone'));
    const chapel = await driver.findElement(By.name('c5'));

    const saveButton = await driver.findElement(By.name('PersonSubmitAndAdd'));

    // select object creation for select fields
    const genderSelect = new Select(gender);
    const birthMonthSelect = new Select(birthMonth);
    const birthDaySelect = new Select(birthDay);
    const familyRoleSelect = new Select(familyRole);

    birthYear.clear();

    await genderSelect.selectByVisibleText(member['Sex']);
    await firstName.sendKeys(member['First name']);
    await middleName.sendKeys(member['Last Name']);
    await lastName.sendKeys(member['Middle Name']);
    await birthMonthSelect.selectByValue(
      randomToString(getRandomNumber(1, 12)),
    );
    await birthDaySelect.selectByVisibleText(getRandomNumber(1, 28).toString());
    await birthYear.sendKeys(member['Date of birth']);
    await familyRoleSelect.selectByValue(getFamilyRole(member).toString());
    await becameChristian.sendKeys(
      member['Became Christian'] === 'From Family'
        ? member['Date of birth']
        : member['Became Christian'],
    );
    if (member['Become member of the church'] !== '') {
      await membershipDate.sendKeys(
        getDate(member['Become member of the church']),
      );
    }
    await educationLevel.sendKeys(member['Education Level']);
    await occupation.sendKeys(member['Occupation']);
    await baptism.sendKeys(member['Year of Baptism']);
    await cellPhone.sendKeys(member['Mobile']);
    await chapel.sendKeys(member['Chapel']);
    await ministry.sendKeys(member['Ministry']);

    await saveButton.click();
  } catch (error) {
    console.log('Error saving member: ', error);
    throw error;
  }
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomToString = (random) => {
  if (random < 10) {
    return `0${random}`;
  }

  return random.toString();
};

export async function saveFamily(driver, member) {
  try {
    await driver.get(`${process.env.BASEURL}/FamilyEditor`);
    await driver.wait(until.elementLocated(By.id('FamilyName')));

    console.log(member['First name']);

    const familyName = await driver.findElement(By.name('Name'));
    const weddingDate = await driver.findElement(By.name('WeddingDate'));
    const saveButton = await driver.findElement(By.name('FamilySubmit'));

    await familyName.sendKeys(
      `${member['First name']} ${member['Middle Name']}`,
    );
    if (member['Marriage Year'] !== '') {
      await weddingDate.sendKeys(getDate(member['Marriage Year']));
    }

    await saveButton.click();

    await driver.wait(until.elementLocated(By.id('deleteFamilyBtn')));

    const currentUrl = await driver.getCurrentUrl();
    return currentUrl.split('/').pop();
  } catch (error) {
    console.log('Error saving family: ', error);
    throw error;
  }
}

function getDate(year) {
  return `${year}-${randomToString(getRandomNumber(1, 12))}-${randomToString(
    getRandomNumber(1, 28),
  )}`;
}

function getFamilyRole(member) {
  if (member['ተ.ቁ'] !== '') {
    if (member['Family condition'] == 'Unmarried') {
      return 0;
    }
    return 1;
  }

  switch (member['Family condition']) {
    case 'Mother':
    case 'Father':
      return 2;
    case 'Child':
    case 'grand child':
      return 3;
    case 'Relative':
      return 4;
    default:
      return 0;
  }
}
