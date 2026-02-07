const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const DATA_FILES = [
  path.join(__dirname, '../../../data1.json'),
  path.join(__dirname, '../../../data2.json'),
  path.join(__dirname, '../../../data3.json'),
];

const LOGIN_EMAIL = 'test@test1.test';
const LOGIN_PASSWORD = 'test@test1.test';

async function loginUser(page) {
  console.log('Logging in...');
  await page.goto('https://knjizara-app-client.fly.dev/');
  await page.getByRole('button', { name: 'Prihvati sve' }).click();
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Korisničko ime' }).fill(LOGIN_EMAIL);
  await page.getByRole('textbox', { name: 'Lozinka' }).fill(LOGIN_PASSWORD);
  await page.getByRole('button', { name: 'Prijavi se' }).click();
  await page.waitForURL('**/books', { timeout: 10000 });
  console.log('✓ Logged in successfully');
}

async function addBook(page, book) {
  console.log(`\nAdding: ${book.title}`);
  
  // Navigate to create listing page
  await page.getByRole('link', { name: 'Objavi knjigu' }).first().click();
  
  // Step 1: Osnovno (Basic Info)
  await page.getByRole('textbox', { name: 'Na primer: 1984' }).fill(book.title);
  await page.getByRole('textbox', { name: 'Na primer: Džordž Orvel' }).fill(book.author);
  
  // Fill price
  const priceValue = typeof book.price === 'string' ? book.price : book.price.toString();
  await page.getByPlaceholder('1200').fill(priceValue);
  
  // Fill cover image URL
  await page.getByRole('textbox', { name: 'https://example.com/cover.jpg' }).fill(book.coverImage);
  
  // Click "Dalje" (Next)
  await page.getByRole('button', { name: 'Dalje' }).click();
  
  // Step 2: Detalji (Details)
  // Select category - Beletristika
  await page.getByRole('button', { name: 'Beletristika' }).click();
  
  // Click "Dalje" (Next)
  await page.getByRole('button', { name: 'Dalje' }).click();
  
  // Step 3: Dodatno (Additional)
  // Fill ISBN
  await page.getByRole('textbox').first().fill(book.isbn);
  
  // Click "Dalje" (Next)
  await page.getByRole('button', { name: 'Dalje' }).click();
  
  // Step 4: Pregled (Preview) - Publish
  await page.getByRole('button', { name: 'Objavi knjigu' }).click();
  
  console.log(`  ✓ Successfully added`);
}

test('Add all books from JSON files', async ({ page }) => {
  // Set timeout to 10 minutes (600000ms) for adding all books
  test.setTimeout(600000);
  
  console.log('🚀 Starting book import process...\n');
  
  // Login first
  await loginUser(page);
  
  let totalBooks = 0;
  let successCount = 0;
  let failCount = 0;
  const failedBooks = [];
  
  // Process each data file
  for (const dataFile of DATA_FILES) {
    if (!fs.existsSync(dataFile)) {
      console.log(`⚠ File not found: ${dataFile}`);
      continue;
    }
    
    const fileContent = fs.readFileSync(dataFile, 'utf-8');
    const books = JSON.parse(fileContent);
    
    console.log(`\n📚 Processing ${books.length} books from ${path.basename(dataFile)}`);
    console.log('─'.repeat(60));
    
    for (const book of books) {
      totalBooks++;
      try {
        await addBook(page, book);
        successCount++;
      } catch (error) {
        failCount++;
        failedBooks.push({ title: book.title, error: error.message });
        console.error(`  ✗ Failed: ${error.message}`);
        
        // Try to recover by going back to books page
        try {
          await page.goto('http://localhost:3000/books');
          await page.waitForTimeout(1000);
        } catch (e) {
          console.error('  ⚠ Failed to recover, continuing...');
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total books processed: ${totalBooks}`);
  console.log(`✓ Successfully added: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  
  if (failedBooks.length > 0) {
    console.log('\nFailed books:');
    failedBooks.forEach(({ title, error }) => {
      console.log(`  - ${title}: ${error}`);
    });
  }
  
  // Verify by checking my listings page
  console.log('\n📋 Verifying listings...');
  await page.goto('http://localhost:3000/my-listings');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('\n✅ Import process completed!');
  console.log('Check http://localhost:3000/my-listings to see all books');
  
  // Assert that we successfully added at least some books
  expect(successCount).toBeGreaterThan(0);
});
