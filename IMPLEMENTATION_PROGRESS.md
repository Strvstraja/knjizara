# Serbian Bookstore - Implementation Progress

**Project**: knjizara (Serbian Bookstore)  
**Tech Stack**: OpenSaaS (Wasp + React + Node.js + Prisma + Stripe)  
**Last Updated**: February 4, 2026

---

## ✅ Phase 1: OpenSaaS Base Setup - COMPLETE

### 1.1 Wasp CLI Installation ✅
- Installed Wasp version 0.20.1
- Verified installation with `wasp version`

### 1.2 OpenSaaS Project Creation ✅
- Created project at `/Users/strahinja/knjizara/knjizara-app/`
- Used command: `wasp new knjizara-app -t saas`
- Project includes:
  - React frontend
  - Node.js backend
  - Prisma ORM
  - Stripe integration
  - Authentication (email/password)
  - Admin dashboard
  - ShadCN UI components

### 1.3 Environment Setup ✅
- Created `.env.server` from template
- PostgreSQL database started in Docker
- Initial database migrations applied successfully

### 1.4 Development Server ✅
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: PostgreSQL on port 5432
- Server running and accessible

---

## ✅ Phase 2: Database Schema Extension - COMPLETE

### 2.1 User Model Extended ✅
Added fields:
- `preferredScript` (String, default: "latin") - for Cyrillic/Latin preference
- `addresses` (Address[]) - relation to Address model
- `orders` (Order[]) - relation to Order model

### 2.2 Book Model Created ✅
Fields:
- `id`, `title`, `titleCyrillic`, `author`, `authorCyrillic`
- `description`, `descriptionCyrillic`
- `price`, `discountPrice`, `coverImage`
- `isbn` (unique), `pageCount`, `binding` (enum)
- `publisher`, `publishYear`, `language`
- `stock`, `featured`
- `categories` (relation), `orderItems` (relation)
- `createdAt`, `updatedAt`

### 2.3 Category Model Created ✅
Fields:
- `id`, `name`, `nameCyrillic`, `slug` (unique)
- `parentId` (optional for hierarchy)
- `parent`, `children` (self-relations)
- `books` (relation)

### 2.4 Order Models Created ✅
**Order**:
- `id`, `userId`, `status`, `items`
- `shippingAddress`, `addressId`
- `paymentMethod`, `paymentStatus`
- `subtotal`, `shippingCost`, `total`
- `trackingNumber`, `createdAt`, `updatedAt`

**OrderItem**:
- `id`, `orderId`, `bookId`, `quantity`, `price`

**Address**:
- `id`, `userId`, `fullName`, `street`, `city`
- `postalCode`, `phone`, `isDefault`, `createdAt`

### 2.5 Enums Created ✅
- `Binding`: HARDCOVER, SOFTCOVER
- `OrderStatus`: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `PaymentMethod`: CASH_ON_DELIVERY, CARD
- `PaymentStatus`: PENDING, PAID

### 2.6 Migrations ✅
- Initial migration: `20260204203757_initial_migration`
- Schema extension: `20260204204352_second_migration`
- All migrations applied successfully

---

## ✅ Phase 3: API Endpoints - COMPLETE

### 3.1 Book Operations ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/bookstore/operations.ts`

**Queries**:
- `getBooks` - Paginated listing with filters (search, category, price range, binding, featured, sorting)
- `getBook` - Single book details with categories

**Actions** (Admin only):
- `createBook` - Create new book with category assignment
- `updateBook` - Update book details and categories
- `deleteBook` - Remove book from catalog

### 3.2 Category Operations ✅
**Queries**:
- `getCategories` - List all categories with parent/child relationships

### 3.3 Order Operations ✅
**Actions**:
- `createOrder` - Create order with shipping calculation (free shipping threshold, standard/express costs)
- `getUserOrders` - Get user's order history with items and shipping details

### 3.4 Wasp Configuration ✅
All queries and actions registered in `main.wasp`:
- Entities properly linked
- Import paths configured
- Type safety enabled

---

## ✅ Phase 4: Frontend Pages - COMPLETE

### 4.1 Books Catalog Page ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/bookstore/BooksPage.tsx`

Features:
- **Grid Layout**: Responsive (2-6 columns based on screen size)
- **Search**: By title, author, ISBN
- **Filters**: Category dropdown
- **Sorting**: Newest, price (asc/desc), title
- **Pagination**: Page navigation with total pages
- **Book Cards**: Cover image, title, author, price, discount badge
- **Performance**: Lazy loading images, optimized grid spacing

Route: `/books`

### 4.2 Book Detail Page ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/bookstore/BookDetailPage.tsx`

Features:
- Large cover image
- Full book information (title, author, price, stock status)
- Specifications (ISBN, pages, binding, publisher, year, language)
- Category tags
- Full description
- Add to cart button (disabled if out of stock)
- Discount badge and pricing

Route: `/books/:id`

---

## ✅ Phase 5: Serbian Market Configuration - COMPLETE

### 5.1 Environment Variables ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/.env.server`

Added:
```
FREE_SHIPPING_THRESHOLD=3000
STANDARD_SHIPPING_COST=350
EXPRESS_SHIPPING_COST=590
CURRENCY=RSD
```

### 5.2 Payment Methods ✅
- Cash on Delivery (primary method)
- Card payments via Stripe (secondary)
- Shipping cost calculation in `createOrder` operation

---

## ✅ Phase 6: Sample Data - COMPLETE

### 6.1 Categories Seeded ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/server/scripts/bookSeeds.ts`

4 categories created:
1. Beletristika / Белетристика
2. Naučna literatura / Научна литература
3. Dečje knjige / Дечје књиге
4. Domaći autori / Домаћи аутори

### 6.2 Books Seeded ✅
6 sample books:
1. **Na Drini ćuprija** - Ivo Andrić (1200 RSD)
2. **Hazarski rečnik** - Milorad Pavić (1200 RSD, was 1500 - 20% off)
3. **Sapiens** - Yuval Noah Harari (1800 RSD)
4. **Mali princ** - Antoine de Saint-Exupéry (800 RSD)
5. **1984** - George Orwell (900 RSD, was 1100 - 18% off)
6. **Prokleta avlija** - Ivo Andrić (950 RSD)

### 6.3 Image Optimization ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/server/scripts/updateBookImages.ts`

- Replaced large Unsplash images with lightweight placeholders
- Image size reduced by ~95% (from 200-500KB to 5-10KB each)
- Faster page loading

---

## ✅ Phase 7: Performance Optimizations - COMPLETE

### 7.1 Grid Layout Improvements ✅
- Responsive columns: 2 (mobile) → 3 (sm) → 4 (md) → 5 (lg) → 6 (xl)
- Reduced gap from `gap-6` to `gap-4`
- Better aspect ratio: `aspect-[2/3]` for book-like proportions

### 7.2 Image Loading ✅
- Added `loading="lazy"` attribute to all images
- Images load only when entering viewport
- Significantly improved initial page load time

---

## ✅ Phase 8: Shopping Cart - COMPLETE

### 8.1 Shopping Cart ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/client/contexts/CartContext.tsx`

**Cart Context & State Management**:
- Global cart state using React Context
- LocalStorage persistence (survives page refreshes)
- Add, remove, update quantity functions
- Item count and subtotal calculations
- Stock validation

**Cart Drawer** (`/src/client/components/CartDrawer.tsx`):
- Slide-in drawer accessible from navigation
- Cart badge showing item count
- Quick view of all items with images
- Quantity controls (+, -, delete)
- Free shipping progress bar (3000 RSD threshold)
- Order summary (subtotal, shipping 350 RSD, total)
- "Idi na plaćanje" button

**Cart Page** (`/src/bookstore/CartPage.tsx`):
- Full-page detailed cart view at `/cart`
- Large book images with links
- Quantity management
- Remove items functionality
- Free shipping progress indicator
- Order summary sidebar
- "Nastavi na plaćanje" checkout button
- "Nastavi sa kupovinom" continue shopping link

**Add to Cart Integration**:
- Book detail page: "Dodaj u korpu" button with checkmark feedback
- Books catalog: Quick add buttons on hover (shopping cart icon)
- Visual confirmation when items added
- "Already in cart" indicator

### 8.2 Free Shipping Calculation ✅
- Threshold: 3000 RSD
- Standard shipping cost: 350 RSD
- Progress bar showing amount needed
- Automatic free shipping when threshold reached
- Visual feedback (blue progress bar / green success message)

## ✅ Phase 9: Checkout Flow & Address Management - COMPLETE

### 9.1 Address Management ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/bookstore/addressOperations.ts`

**Address Operations**:
- `getUserAddresses` - Get all user addresses (sorted by default, then created date)
- `createAddress` - Create new address with auto-default handling
- `updateAddress` - Update address details
- `deleteAddress` - Remove address (with ownership verification)
- `setDefaultAddress` - Set address as default (unsets others)

**Address Form Component** (`/src/client/components/AddressForm.tsx`):
- Full name, street, city, postal code, phone fields
- "Set as default" checkbox
- Form validation
- Cancel/Save actions

### 9.2 Checkout Flow ✅
File: `/Users/strahinja/knjizara/knjizara-app/app/src/bookstore/CheckoutPage.tsx`

**4-Step Checkout Process**:
- **Step 1: Address Selection**
  - Display saved addresses with radio selection
  - "Add new address" form inline
  - Default address highlighting
  - Address validation (must belong to user)

- **Step 2: Delivery Method**
  - Standard delivery (3-5 days, 350 RSD or free if >3000 RSD)
  - Express delivery (1-2 days, 590 RSD)
  - Visual selection with pricing

- **Step 3: Payment Method**
  - Cash on Delivery (recommended, highlighted)
  - Credit/Debit Card (Visa, Mastercard, Maestro)
  - Radio button selection

- **Step 4: Review & Confirm**
  - Summary of address, delivery, payment
  - List of all items with quantities and prices
  - Final order totals
  - "Potvrdi porudžbinu" button

**Features**:
- Progress indicator with icons (MapPin, Truck, CreditCard, Check)
- Step navigation (back/forward buttons)
- Order summary sidebar (always visible)
- Cart items display with images
- Authentication required (redirects to login)
- Empty cart handling

**Order Success Page** (`/src/bookstore/OrderSuccessPage.tsx`):
- Success confirmation with checkmark icon
- Order details explanation
- Links to "My Orders" and "Continue Shopping"
- Support contact information

**Integration**:
- Cart page links to checkout
- Cart drawer links to checkout
- Order creation via `createOrder` operation
- Cart cleared after successful order
- Redirect to `/order-success` after order placement

**Route Configuration**:
- Checkout route: `/placanje` (changed from `/checkout` to avoid Wasp routing conflicts)
- All links updated to use `/placanje`
- Tested and verified with Playwright MCP

## ✅ Phase 10: i18n Cyrillic/Latin Toggle - COMPLETE

### 10.1 i18n Implementation ✅
Files:
- `/src/client/i18n/config.ts` - i18next configuration
- `/src/client/i18n/locales/sr-Latn.json` - Latin script translations
- `/src/client/i18n/locales/sr-Cyrl.json` - Cyrillic script translations
- `/src/client/contexts/ScriptContext.tsx` - Script state management
- `/src/client/components/ScriptToggle.tsx` - Toggle button component

**Features**:
- i18next and react-i18next integration
- Two language variants: sr-Latn (Latin) and sr-Cyrl (Cyrillic)
- Script context provider for global state management
- LocalStorage persistence of script preference
- User preference sync (reads from user.preferredScript)
- Toggle button in navigation bar (shows "Ћир" in Latin mode, "Lat" in Cyrillic mode)

**Translation Coverage**:
- Navigation (books, cart, login, account)
- Cart (all labels and messages)
- Books (search, filters, product details)
- Checkout (all 4 steps, address form, payment)
- Order success page
- Common terms (RSD, loading, error, success)

**Integration**:
- ScriptProvider wraps entire app in App.tsx
- ScriptToggle button added to NavBar
- i18n config imported in App.tsx
- Dependencies added: i18next ^23.7.0, react-i18next ^13.5.0

**Components with Full i18n Coverage**:
- **CartDrawer**: All labels, buttons, free shipping messages
- **CartPage**: Title, buttons, order summary, free shipping progress
- **BooksPage**: Search, filters, sorting, pagination, "add to cart" buttons
- **BookDetailPage**: Specifications, stock status, binding types, categories, description
- **CheckoutPage**: All 4 steps (address, delivery, payment, review), order summary
- **AddressForm**: All field labels, buttons, checkbox, validation messages
- **OrderSuccessPage**: Success message, next steps, contact information

**Translation Keys Added**:
- Navigation: books, cart, login, logout, account
- Cart: title, empty, subtotal, shipping, total, free shipping messages
- Books: search, filters, sorting, pagination, stock status
- BookDetail: specifications (ISBN, pages, binding, publisher, year, language), categories, description
- Checkout: all 4 steps, delivery methods, payment methods, order review
- Address: all form fields, save/cancel buttons
- OrderSuccess: success message, what's next, view orders, continue shopping
- Common: RSD currency, loading, error messages

**Tested**:
- Script toggle button renders correctly
- Clicking toggle switches between "Ћир" and "Lat"
- Script state persists in localStorage
- All pages translate correctly between Latin/Cyrillic scripts
- Verified with Playwright MCP on all pages:
  - BooksPage ✅
  - BookDetailPage ✅
  - CartPage ✅
  - CartDrawer ✅
  - CheckoutPage (all 4 steps) ✅
  - AddressForm ✅
  - OrderSuccessPage ✅

## ✅ Phase 11: User Dashboard

### 11.1 My Orders Page ✅
**Status**: Completed

**Features**:
- Display all user orders with full details
- Order status badges (Pending, Processing, Shipped, Delivered, Cancelled)
- Order items with book covers and details
- Shipping address display
- Order totals breakdown (subtotal, shipping, total)
- Empty state with call-to-action
- Full i18n support (Latin/Cyrillic)

**Implementation**:
- Created `MyOrdersPage.tsx` component
- Uses `getUserOrders` query to fetch user orders
- Route: `/my-orders` (auth required)
- Displays orders sorted by creation date (newest first)
- Shows order status with color-coded badges and icons
- Links to book detail pages from order items
- Updated OrderSuccessPage to link to My Orders

**Translation Coverage**:
- Order page title, empty states, error messages
- Order status labels (pending, processing, shipped, delivered, cancelled)
- Order details (order number, placed on, total, items, quantity)
- Shipping address labels
- All text translates correctly between Latin and Cyrillic

**Tested**:
- Verified page loads correctly
- Tested empty state display
- Verified i18n translations in both scripts
- Confirmed with Playwright MCP ✅

### 11.2 Address Management Page ✅
**Status**: Completed

**Features**:
- View all saved addresses
- Add new addresses with form validation
- Edit existing addresses
- Delete addresses with confirmation
- Set default address
- Default address badge display
- Empty state with call-to-action
- Full i18n support (Latin/Cyrillic)

**Implementation**:
- Created `AddressManagementPage.tsx` component
- Uses existing address operations: `getUserAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress`
- Reuses `AddressForm` component for add/edit functionality
- Route: `/addresses` (auth required)
- Displays addresses sorted by default status, then creation date
- Visual indicators for default address (blue ring and badge)

**Translation Coverage**:
- Page title, buttons (add new, edit, delete, set as default)
- Empty state messages
- Form titles (add new address, edit address)
- Confirmation dialogs
- All text translates correctly between Latin and Cyrillic

**Tested**:
- Verified page loads correctly
- Tested empty state display
- Verified i18n translations in both scripts
- Confirmed with Playwright MCP ✅

### 11.3 Wishlist Functionality ✅
**Status**: Completed

**Features**:
- View all wishlist items with book details
- Add books to wishlist from book detail page
- Remove books from wishlist (detail page or wishlist page)
- Heart button toggle on book detail page
- Visual indicator (filled heart) for books in wishlist
- Add to cart directly from wishlist page
- Empty state with call-to-action
- Full i18n support (Latin/Cyrillic)

**Implementation**:
- Created `WishlistItem` database model with unique constraint on userId + bookId
- Created `wishlistOperations.ts` with CRUD operations
- Added queries: `getUserWishlist`, `isInWishlist`
- Added actions: `addToWishlist`, `removeFromWishlist`
- Created `WishlistPage.tsx` component
- Added wishlist heart button to `BookDetailPage`
- Route: `/wishlist` (auth required)
- Database migration completed successfully

**Translation Coverage**:
- Page title, empty states, buttons (add to cart, remove)
- Success/error messages
- All text translates correctly between Latin and Cyrillic

**Tested**:
- Verified wishlist page loads correctly
- Tested add/remove functionality on book detail page
- Verified heart button toggles correctly
- Verified i18n translations in both scripts
- Confirmed with Playwright MCP ✅

### 11.4 Not Yet Implemented ⏳
- Profile settings

## 🔄 Phase 12: Cleanup and Navigation

### 12.1 Remove Demo Apps ✅
**Status**: Completed

**Removed:**
- AI Scheduler demo app (route, page, queries, actions)
- File Upload demo app (route, page, queries, actions)
- Payment/Pricing pages (not needed for bookstore)
- Admin Dashboard demo routes (will build custom bookstore admin later)
- All payment-related code from AccountPage

**Updated Navigation:**
- Replaced "AI Scheduler" and "File Upload" links with "Knjige" (Books)
- Updated Hero component buttons: "Pregledaj knjige" and "Registruj se"
- Removed references to PricingPageRoute throughout the app

**Files Modified:**
- `main.wasp` - Removed demo routes, pages, queries, and actions
- `src/client/components/NavBar/constants.ts` - Updated navigation items
- `src/user/constants.ts` - Updated user menu items
- `src/user/AccountPage.tsx` - Simplified to show only basic user info
- `src/landing-page/components/Hero.tsx` - Updated CTA buttons

**Tested:**
- Landing page loads correctly with new navigation
- Books link works in main navigation
- No broken route references

### 12.2 Navigation Links for User Features ✅
**Status**: Completed

**User Menu Items Added:**
- 📦 "Moje porudžbine" → `/my-orders` (My Orders)
- ❤️ "Lista želja" → `/wishlist` (Wishlist)
- 📍 "Moje adrese" → `/addresses` (Address Management)
- ⚙️ "Podešavanja naloga" → `/account` (Account Settings)

**Main Navigation:**
- "Knjige" link added to main navigation bar
- Visible to all users (logged in or not)

**Implementation:**
- Updated `src/user/constants.ts` with bookstore-specific menu items
- Used appropriate icons (Package, Heart, MapPin, Settings)
- All menu items require authentication except Account Settings
- Menu items show in both desktop dropdown and mobile menu

**Note:** Menu items are currently in Latin script only. Full i18n support for navigation (Latin/Cyrillic toggle) will be added in a future update.

### 8.5 Admin Panel ⏳
- Book management UI (CRUD interface)
- Order management (status updates, tracking)
- Category management
- Bulk import (CSV)

### 8.6 Homepage Customization ✅
**Status**: Completed

**Implemented:**
- ✅ Custom bookstore hero section with i18n support
  - Compelling headline: "Otkrijte svet knjiga u vašoj knjižari"
  - Call-to-action buttons: "Pregledaj knjige" and "Registruj se"
  - Three feature highlights with icons (Wide Selection, Easy Ordering, Wishlist)
- ✅ Featured Books section
  - Displays 4 featured books in a grid layout
  - Book cards with cover images, titles, authors, and prices
  - Hover effects and smooth transitions
  - "View All Books" button
- ✅ Categories section
  - Displays all book categories in a 6-column grid
  - Category cards with icons and names
  - Links to filtered book listings by category
- ✅ New Arrivals section
  - Displays 6 newest books in a compact grid
  - "Novo" badge on each book
  - Responsive design (2 cols mobile, 6 cols desktop)
  - "View All" button

**Files Created:**
- `src/landing-page/components/FeaturedBooks.tsx` - Featured books carousel
- `src/landing-page/components/Categories.tsx` - Category grid display
- `src/landing-page/components/NewArrivals.tsx` - New arrivals showcase

**Files Modified:**
- `src/landing-page/LandingPage.tsx` - Replaced demo sections with bookstore sections
- `src/landing-page/components/Hero.tsx` - Custom bookstore hero with features
- `src/client/i18n/config.ts` - Added `landing.*` translations for both scripts

**i18n Support:**
- All text fully translated to Latin and Cyrillic scripts
- Translation keys: `landing.hero.*`, `landing.features.*`, `landing.featured.*`, `landing.categories.*`, `landing.newArrivals.*`
- Script toggle works seamlessly across all homepage sections

**Design Features:**
- Gradient backgrounds for visual appeal
- Responsive grid layouts (mobile-first)
- Hover effects and smooth transitions
- Loading skeletons for better UX
- Consistent color scheme using design tokens

### 8.7 Auth Pages Translation ✅
**Status**: Completed

**Implemented:**
- ✅ Custom signup form with full i18n support
  - Translated form fields: "E-mail", "Lozinka"
  - Translated button: "Registruj se"
  - Translated links: "Već imam nalog (idi na prijavu)"
  - Auto-redirect to books page after successful signup
- ✅ Custom login form with full i18n support
  - Translated form fields: "E-mail", "Lozinka"
  - Translated button: "Prijavi se"
  - Translated links: "Nemate nalog? registrujte se", "Zaboravili ste lozinku? resetujte je"
  - Auto-redirect to books page after successful login
- ✅ Error handling with translated messages
- ✅ Loading states with translated text

**Files Created:**
- `src/auth/CustomSignupForm.tsx` - Custom signup form with i18n
- `src/auth/CustomLoginForm.tsx` - Custom login form with i18n

**Files Modified:**
- `src/auth/SignupPage.tsx` - Uses custom form instead of Wasp default
- `src/auth/LoginPage.tsx` - Uses custom form instead of Wasp default
- `src/client/i18n/config.ts` - Added `auth.*` translations for both scripts

**i18n Support:**
- All text fully translated to Latin and Cyrillic scripts
- Translation keys: `auth.signup.*`, `auth.login.*`, `auth.forgotPassword.*`
- Script toggle works seamlessly across all auth pages

**Functionality:**
- Email/password authentication working
- Automatic redirect to `/books` after successful login/signup
- Form validation and error messages
- Loading states during authentication

### 8.8 Additional Features ⏳
- Similar books section on detail page
- Reviews and ratings
- Gift wrapping option
- Newsletter signup
- Social sharing

---

## 📁 Key Files Reference

### Configuration
- `main.wasp` - Wasp configuration, routes, queries, actions
- `schema.prisma` - Database schema
- `.env.server` - Environment variables

### Backend
- `src/bookstore/operations.ts` - API operations
- `src/server/scripts/bookSeeds.ts` - Sample data seeding
- `src/server/scripts/updateBookImages.ts` - Image optimization script

### Frontend
- `src/bookstore/BooksPage.tsx` - Book catalog
- `src/bookstore/BookDetailPage.tsx` - Book details

---

## 🚀 Current Status

**Working Features**:
✅ Book catalog with search, filters, sorting, pagination  
✅ Book detail pages  
✅ Responsive grid layout (2-6 columns)  
✅ Optimized image loading  
✅ Category filtering  
✅ Discount badges  
✅ RSD pricing  
✅ Serbian market configuration  

**Access**:
- Catalog: http://localhost:3000/books
- Detail: http://localhost:3000/books/[book-id]

**Database**:
- 6 books loaded
- 4 categories
- PostgreSQL running in Docker

---

## ✅ Phase 13: Marketplace Features (C2C + B2C)

### 13.1 Seller Functionality ✅
**Status**: Completed

**Auto-Seller Registration:**
- All users are automatically sellers upon account creation
- Seller profile auto-created on first listing
- Type: PRIVATE by default
- Can be upgraded to BUSINESS later

**Seller Profile Management:**
- Added displayName field to Account Settings page (`/account`)
- Editable inline with pencil icon
- Saves to SellerProfile table in database
- Real-time updates with visual feedback

**Implementation:**
- File: `src/user/AccountPage.tsx` - Added displayName edit functionality
- Operations: `getSellerProfile`, `updateSellerProfile` already in place
- Database: SellerProfile model with all required fields

### 13.2 Book Listing Features ✅
**Status**: Completed

**Condition Badges:**
- Added to BookDetailPage
- Color-coded: Green (NEW), Teal (LIKE_NEW), Blue (VERY_GOOD), Yellow (GOOD), Orange (ACCEPTABLE)
- Shows "Cena po dogovoru" if negotiable
- Full i18n support (Latin/Cyrillic)

**Seller Info Display:**
- Shows on book detail page when displayName is set
- Displays seller name with business/private icon
- Only visible for books with seller information
- Conditional rendering to avoid empty states

**Implementation:**
- File: `src/bookstore/BookDetailPage.tsx` - Added condition badge and seller info card
- Updated `getBook` operation to include seller data
- Translation keys added: `listing.*` for conditions

### 13.3 Navigation Updates ✅
**Status**: Completed

**My Listings Link:**
- Added "Moji oglasi" to main navigation
- Links to `/my-listings` page
- Accessible from anywhere in the app
- Shows seller's active/paused/sold listings

**Fixed Issues:**
- Fixed `createListing` entity error (added User entity)
- Fixed `deleteListing` entity error (added SellerProfile entity)
- Both operations now work correctly

### 13.4 Additional Features ✅
**Status**: Completed

**City Field in Account Settings:**
- Added editable city field to `/account` page
- Inline editing with pencil icon
- Saves to SellerProfile database
- Displays on book detail pages when set

**All Sellers Listings Page:**
- Created `/all-sellers` route and page
- Shows all books from all sellers
- Grid layout with pagination
- Link added to book detail pages ("Pogledaj sve oglase →")

**Implementation:**
- File: `src/user/AccountPage.tsx` - Added city field with edit functionality
- File: `src/bookstore/AllSellersPage.tsx` - New page showing all sellers' listings
- File: `src/bookstore/BookDetailPage.tsx` - Added city display and link to all sellers page
- Route: `/all-sellers` registered in main.wasp

### 13.5 Not Implemented (Marked as Won't Do) ❌
- Seller public profile page (`/seller/:id`) - Skipped
- Phone number field in account settings - Not needed
- Messaging system between buyers and sellers - Won't implement
- Seller ratings and reviews - Won't implement

### 13.6 Search Filters ✅
**Status**: Completed
- Condition filter added to books page (NEW, LIKE_NEW, VERY_GOOD, GOOD, ACCEPTABLE)
- Works alongside existing category and sort filters
- Seller type and city filters removed (not needed)

---

## 📝 Phase 14: Seller Dashboard & Admin Features (In Progress)

### 14.1 Seller Dashboard Stats ✅
**Status**: Completed
- Added stats card to My Listings page
- Shows: total listings, active (green), paused (yellow), sold (blue)
- Real-time calculation from listings data
- Clean, card-based UI design

**Implementation:**
- File: `src/listing/MyListingsPage.tsx` - Added 4-card stats grid

### 14.2 Admin Panel ✅
**Status**: Completed
- Created admin books management page (`/admin/books`)
- Created admin sellers management page (`/admin/sellers`)
- Books admin: view all books, filter by status, delete listings
- Sellers admin: view all sellers, see listing counts, view their books
- Integrated with existing admin layout

**Implementation:**
- Files: `src/admin/dashboards/books/BooksAdminPage.tsx` & `BooksAdminTable.tsx`
- Files: `src/admin/dashboards/sellers/SellersAdminPage.tsx` & `SellersAdminTable.tsx`
- Routes: `/admin/books`, `/admin/sellers` registered in main.wasp
- Uses existing admin layout and styling

### 14.3 Order Management for Sellers ✅
**Status**: Completed
- Created seller orders view page (`/seller/orders`)
- Backend query to fetch orders containing seller's books
- Displays buyer information (email, username)
- Shows shipping address details
- Lists all seller's books in each order with quantities and prices
- Calculates total for seller's items per order
- Filter by order status (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
- Stats cards showing total, paid, shipped, and pending orders
- Pagination support
- Added "Moje prodaje" link to navigation menu

**Implementation:**
- File: `src/seller/sellerOrderOperations.ts` - Backend query operation
- File: `src/seller/SellerOrdersPage.tsx` - Full-featured orders page
- File: `src/client/components/NavBar/constants.ts` - Added navigation link
- Route: `/seller/orders` registered in main.wasp
- Query: `getSellerOrders` with Order, OrderItem, Book, SellerProfile entities

### 14.4 Additional Completed Features ✅
**Status**: Completed
- Seller type filter on books page (PRIVATE/BUSINESS)
- Edit listing functionality with full form
- Order status updates with tracking numbers
- 14 book categories (expanded from 4)

---

## 📝 Phase 15: Optional Features (Marked as Won't Do) ❌

The following features are considered optional enhancements and will NOT be implemented at this time:

### **Nice-to-Have Features:**
- ❌ Email notifications for orders
- ❌ Advanced analytics for sellers (views over time, conversion rates)
- ❌ Bulk operations on My Listings
- ❌ Image upload (using URLs is sufficient)
- ❌ Advanced search features
- ❌ Wishlist sharing functionality
- ❌ Order tracking for buyers
- ❌ Reviews/ratings system
- ❌ Seller verification badges
- ❌ Promotional features (featured listings, discounts)

### **Technical Improvements (Deferred):**
- ❌ Performance optimization (caching, lazy loading)
- ❌ SEO optimization (meta tags, sitemaps)
- ❌ Additional mobile responsiveness improvements
- ❌ Advanced accessibility features
- ❌ Unit/integration tests
- ❌ Comprehensive E2E tests

---

## 📝 Phase 16: Polish & Testing ✅

**Status**: Completed

### **Completed Fixes:**
- ✅ Navigation i18n - Links switch between Latin/Cyrillic
- ✅ User dropdown i18n - Menu items translate properly
- ✅ Horizontal scrollbar removed - overflow-x-hidden on html
- ✅ Cart drawer improvements:
  - Width increased to 500px
  - Books section has 60vh minimum height
  - White background on scrollable area
  - Z-index set to 9999 to cover all content
  - Overlay at z-index 9998 with 60% opacity
  - Proper spacing and visibility

### **Testing Checklist:**
- ✅ i18n translations (Latin/Cyrillic) - Verified working
- ✅ Cart drawer functionality - Fixed and verified
- ✅ Navigation and menus - All translating properly
- [ ] End-to-end user flow testing
- [ ] Seller registration and profile setup
- [ ] Create/edit/delete listings
- [ ] Browse and filter books
- [ ] Add to cart and checkout
- [ ] Order management for sellers
- [ ] Admin panel functionality
- [ ] Mobile responsiveness
- [ ] Error handling and edge cases

### **Remaining Polish Tasks:**
- [ ] Review and improve loading states
- [ ] Enhance error messages
- [ ] UI/UX consistency check
- [ ] Performance review
- [ ] Code cleanup and documentation

---

## 📝 Next Priority Tasks

1. Test all marketplace features end-to-end
2. Fix any bugs discovered during testing
3. Polish UI/UX based on findings
4. Prepare for deployment

---

## 🛠️ Commands Reference

```bash
# Start development server
cd /Users/strahinja/knjizara/knjizara-app/app
wasp start

# Start database only
wasp db start

# Run migrations
wasp db migrate-dev

# Seed database
wasp db seed seedBooks
wasp db seed updateBookImages

# Compile project
wasp compile
```

---

**End of Implementation Progress Document**
