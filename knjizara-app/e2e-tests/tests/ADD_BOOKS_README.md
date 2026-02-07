# Automated Book Import Script

This script automatically adds all books from the JSON data files to your local Wasp application using Playwright automation.

## Prerequisites

1. **Wasp app must be running**
   ```bash
   cd knjizara-app/app
   wasp start
   ```
   Wait until both client (localhost:3000) and server (localhost:3001) are running.

2. **Install Playwright** (if not already installed)
   ```bash
   npm install -D playwright
   # or
   npx playwright install chromium
   ```

3. **User account must exist**
   - The script uses: `test@test1.com` / `test123456`
   - This account should already exist from previous sessions
   - If not, create it manually first by signing up at http://localhost:3000/signup

## Data Files

The script will process books from these files:
- `data1.json` - 9 mythology/Greek books (already added manually)
- `data2.json` - 25 epic fantasy books
- `data3.json` - 15 crime/thriller books

**Total: 49 books**

## Running the Script

### Option 1: Using Node.js directly

```bash
cd /Users/strahinja/knjizara
node add-books.js
```

### Option 2: Using npx

```bash
cd /Users/strahinja/knjizara
npx playwright test add-books.spec.ts --headed
```

## What the Script Does

For each book in the JSON files, the script will:

1. **Navigate** to the "Create Listing" page
2. **Fill Basic Info** (Osnovno):
   - Title
   - Author
   - Price
   - Cover Image URL
3. **Fill Details** (Detalji):
   - Condition: "Nova (neotpakovana)"
   - Category: "Beletristika" (default)
   - Description
4. **Fill Additional** (Dodatno):
   - ISBN
5. **Publish** the listing
6. **Verify** navigation to "My Listings" page

## Script Features

- ✅ Processes all 3 data files sequentially
- ✅ Logs progress for each book
- ✅ Error handling with recovery
- ✅ Summary statistics at the end
- ✅ Runs in headed mode so you can watch the process
- ✅ Waits between actions to ensure stability

## Expected Output

```
🚀 Starting book import process...

Logging in...
✓ Logged in successfully

📚 Processing 9 books from data1.json
────────────────────────────────────────────────────────────

Adding: Slovenska mitologija - latinica
  ✓ Successfully added

Adding: Hiljadu brodova
  ✓ Successfully added

...

============================================================
📊 SUMMARY
============================================================
Total books processed: 49
✓ Successfully added: 49
✗ Failed: 0

📋 Verifying listings...

✅ Import process completed!
Check http://localhost:3000/my-listings to see all books
```

## Troubleshooting

### "Connection refused" error
- Make sure Wasp app is running: `wasp start` in the app directory

### "Login failed" error
- Verify the test account exists at http://localhost:3000/login
- Check credentials: `test@test1.com` / `test123456`

### "Element not found" error
- The UI might have changed
- Check if the app is fully loaded before running the script
- Try running with a slower network: add more `waitForTimeout` calls

### Script hangs
- Press Ctrl+C to stop
- Check browser console for errors
- Restart Wasp app and try again

## Customization

To change the login credentials, edit these lines in `add-books.js`:

```javascript
const LOGIN_EMAIL = 'your-email@example.com';
const LOGIN_PASSWORD = 'your-password';
```

To add/remove data files, edit the `DATA_FILES` array:

```javascript
const DATA_FILES = [
  path.join(__dirname, 'data1.json'),
  path.join(__dirname, 'data2.json'),
  path.join(__dirname, 'data3.json'),
];
```

## Notes

- The script runs in **non-headless mode** so you can watch the automation
- Each book takes ~5-10 seconds to add
- Total runtime: approximately 5-10 minutes for all 49 books
- The browser will close automatically after 5 seconds when complete
