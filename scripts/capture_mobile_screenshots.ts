import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/NETCOM/.gemini/antigravity/brain/81207a8c-2c6f-45e1-9d12-2373db2977d9/mobile_screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Home Dashboard
  console.log('1_home_dashboard.png');
  await page.screenshot({ path: path.join(outDir, '1_home_dashboard.png') });

  // 2. Saved Files
  console.log('2_saved_files.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    btns[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '2_saved_files.png') });

  // 3. Reels Screen
  console.log('3_reels_screen.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    btns[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '3_reels_screen.png') });

  // 4. Collections Screen
  console.log('4_collections_screen.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    btns[4]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '4_collections_screen.png') });

  // 5. Settings Screen (Account Tab)
  console.log('5_settings_account.png');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    btns[5]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '5_settings_account.png') });

  // 5b. Settings Screen (Appearance Tab with Theme Cards)
  console.log('5b_settings_appearance.png');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const appTab = tabs.find(t => t.textContent?.includes('Appearance'));
    appTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '5b_settings_appearance.png') });

  // 6. Centered File Preview Popup Modal
  console.log('6_file_preview_popup.png');
  // Navigate back to saves
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    btns[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1000));
  // Click first card
  await page.evaluate(() => {
    const card = document.querySelector('.glass-card.cursor-pointer');
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '6_file_preview_popup.png') });
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // 7. Mobile Security (Fingerprint & Phone PIN Lock)
  console.log('7_mobile_security_modal.png');
  await page.evaluate(() => {
    const lockBtn = document.querySelector('button[aria-label="Mobile Fingerprint & Phone PIN Lock"]');
    lockBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '7_mobile_security_fingerprint.png') });

  // Switch to PIN mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pinBtn = btns.find(b => b.textContent?.includes('Phone PIN'));
    pinBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '7_mobile_security_pin_keypad.png') });

  await browser.close();
  console.log('Done capturing all screenshots!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
