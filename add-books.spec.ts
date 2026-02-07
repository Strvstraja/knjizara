import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface Book {
  title: string;
  author: string;
  price: string | number;
  coverImage: string;
  description: string;
  isbn: string;
}

const DATA_FILES = [
  path.join(__dirname, 'data1.json'),
  path.join(__dirname, 'data2.json'),
  path.join(__dirname, 'data3.json'),
];

const LOGIN_EMAIL = 'test@test1.com';
const LOGIN_PASSWORD = 'test123456';

async function loginUser(page: Page) {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  await page.fill('input[type="text"]', LOGIN_EMAIL);
  await page.fill('input[type="password"]', LOGIN_PASSWORD);
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/books', { timeout: 10000 });
}

async function addBook(page: Page, book: Book) {
  console.log(`Adding book: ${book.title}`);
  
  // Navigate to create listing page
  await page.goto('http://localhost:3000/create-listing');
  await page.waitForLoadState('networkidle');
  
  // Step 1: Osnovno (Basic Info)
  await page.fill('input[placeholder="Na primer: 1984"]', book.title);
  await page.fill('input[placeholder="Na primer: Džordž Orvel"]', book.author);
  
  // Fill price
  const priceValue = typeof book.price === 'string' ? book.price : book.price.toString();
  await page.fill('input[type="number"]', priceValue);
  
  // Fill cover image URL
  await page.fill('input[placeholder="https://example.com/cover.jpg"]', book.coverImage);
  
  // Click "Dalje" (Next)
  await page.click('button:has-text("Dalje")');
  await page.waitForTimeout(500);
  
  // Step 2: Detalji (Details)
  // Select condition: "Nova (neotpakovana)"
  await page.click('button[role="combobox"]');
  await page.waitForTimeout(300);
  await page.click('div[role="option"]:has-text("Nova (neotpakovana)")');
  
  // Select category - try to determine from book genre
  // Default to "Beletristika" if not specified
  const categoryButton = page.locator('button:has-text("Beletristika")').first();
  await categoryButton.click();
  
  // Fill description
  await page.fill('textarea[placeholder*="Opišite stanje knjige"]', book.description);
  
  // Click "Dalje" (Next)
  await page.click('button:has-text("Dalje")');
  await page.waitForTimeout(500);
  
  // Step 3: Dodatno (Additional)
  // Fill ISBN
  await page.fill('input[placeholder*="ISBN"]', book.isbn);
  
  // Click "Dalje" (Next)
  await page.click('button:has-text("Dalje")');
  await page.waitForTimeout(500);
  
  // Step 4: Pregled (Preview) - Publish
  await page.click('button:has-text("Objavi knjigu")');
  
  // Wait for navigation to my listings page
  await page.waitForURL('**/my-listings', { timeout: 10000 });
  
  console.log(`✓ Successfully added: ${book.title}`);
  await page.waitForTimeout(1000);
}

test.describe('Add Books from JSON Files', () => {
  test('should add all books from data files', async ({ page }) => {
    // Login first
    await loginUser(page);
    
    let totalBooks = 0;
    let successCount = 0;
    let failCount = 0;
    
    // Process each data file
    for (const dataFile of DATA_FILES) {
      if (!fs.existsSync(dataFile)) {
        console.log(`⚠ File not found: ${dataFile}`);
        continue;
      }
      
      const fileContent = fs.readFileSync(dataFile, 'utf-8');
      const books: Book[] = JSON.parse(fileContent);
      
      console.log(`\n📚 Processing ${books.length} books from ${path.basename(dataFile)}`);
      
      for (const book of books) {
        totalBooks++;
        try {
          await addBook(page, book);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`✗ Failed to add: ${book.title}`);
          console.error(error);
          
          // Try to recover by going back to books page
          try {
            await page.goto('http://localhost:3000/books');
            await page.waitForTimeout(1000);
          } catch (e) {
            console.error('Failed to recover');
          }
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`Total books: ${totalBooks}`);
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    
    // Verify by checking my listings page
    await page.goto('http://localhost:3000/my-listings');
    await page.waitForLoadState('networkidle');
    
    // Check that we have listings
    const listingsCount = await page.locator('div[class*="book"]').count();
    console.log(`\n📋 Total listings on page: ${listingsCount}`);
    
    expect(successCount).toBeGreaterThan(0);
  });
});
