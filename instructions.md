# Serbian Bookstore - App Specification

## Project Overview

**Type:** B2C Web Application for book sales
**Market:** Serbia
**Tech Stack:** OpenSaaS (React + Node + Prisma + Stripe)
**Visual Style:** Modern, minimal, white with focus on books

---

## Core Features

### 1. Authentication (OpenSaaS built-in)

- Email/password registration and login
- Password reset flow
- User profile management

### 2. Book Catalog

#### 2.1 Book Display
- Grid display with covers as primary visual element
- Cards: cover, title, author, price (RSD)
- Hover effect with quick actions (add to cart, wishlist)
- Lazy loading for performance

#### 2.2 Single Book Page
- Large cover (left side)
- Info panel (right side): title, author, price, description, specifications
- Specifications: ISBN, page count, binding, publisher, year
- Prominent "Add to Cart" button
- "Similar Books" section

#### 2.3 Search and Filters
- Search bar (search by title, author, ISBN)
- Filters: genre, price range, binding (hardcover/softcover), language
- Sorting: price (ascending/descending), newest, popularity

### 3. Categories and Navigation

#### 3.1 Main Categories
- Fiction
- Non-fiction / Professional
- Children's Books
- Textbooks
- Comics and Manga
- Local Authors (featured section)

#### 3.2 Homepage Sections
- Hero banner (current promotions)
- "New Arrivals"
- "Bestsellers"
- "Local Authors" (highlighted section)
- "On Sale"

### 4. Cart and Checkout

#### 4.1 Cart
- Sidebar cart (slide-in) for quick preview
- Dedicated cart page for detailed view
- Quantity adjustment, item removal
- Display savings if discount exists
- "Add X RSD more for free shipping" progress bar

#### 4.2 Checkout Flow
- Step 1: Shipping address (Serbian format)
- Step 2: Delivery method (standard, express)
- Step 3: Payment method
- Step 4: Review and confirm

#### 4.3 Payment Methods
- **Cash on Delivery** (default, highlighted) - payment to courier upon receipt
- Credit/Debit card (Visa, Mastercard) - Stripe integration

#### 4.4 Shipping
- Free shipping for orders over X RSD (configurable in admin)
- Standard delivery: 2-5 business days
- Express delivery: 1-2 business days (additional cost)
- Display expected delivery date

### 5. Cyrillic/Latin Script Toggle

#### 5.1 Implementation
- Toggle button in header (always visible)
- Icon: "Ћ/C" or "АБВ/ABC"
- Preference saved in localStorage and user profile
- All UI text available in both scripts
- Book data: title and author in original script, description can be dual

#### 5.2 Technical Details
- i18n setup with two "languages": sr-Cyrl and sr-Latn
- JSON files with all UI strings
- Context provider for script switching
- URL stays the same (not /cir/ vs /lat/)

### 6. User Dashboard

#### 6.1 My Orders
- List of all orders with status
- Statuses: Received, Processing, Shipped, Delivered
- Tracking number when available
- Individual order details

#### 6.2 Wishlist
- Saved books for later
- Quick add to cart
- Notification when book goes on sale (nice to have)

#### 6.3 Profile Settings
- Personal information
- Shipping addresses (multiple addresses supported)
- Preferred script (Cyrillic/Latin)
- Email notification preferences

### 7. Admin Panel (OpenSaaS built-in + custom)

#### 7.1 Book Management
- CRUD for books
- Bulk import (CSV)
- Category management
- Author management

#### 7.2 Order Management
- List of all orders
- Status updates
- Print shipping labels
- Filters by status, date, payment method

#### 7.3 Settings
- Free shipping threshold (RSD)
- Shipping prices
- Active promotions/coupons

---

## Data Models

### Book
```
id: string
title: string
titleCyrillic: string (optional, if original is Latin)
author: string
authorCyrillic: string (optional)
description: string
descriptionCyrillic: string (optional)
price: number (RSD)
discountPrice: number (optional)
coverImage: string (URL)
isbn: string
pageCount: number
binding: enum (HARDCOVER, SOFTCOVER)
publisher: string
publishYear: number
language: string
categories: Category[]
stock: number
featured: boolean
createdAt: datetime
updatedAt: datetime
```

### Category
```
id: string
name: string
nameCyrillic: string
slug: string
parentId: string (optional, for subcategories)
```

### Order
```
id: string
userId: string
status: enum (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
items: OrderItem[]
shippingAddress: Address
paymentMethod: enum (CASH_ON_DELIVERY, CARD)
paymentStatus: enum (PENDING, PAID)
subtotal: number
shippingCost: number
total: number
trackingNumber: string (optional)
createdAt: datetime
updatedAt: datetime
```

### Address
```
id: string
userId: string
fullName: string
street: string
city: string
postalCode: string
phone: string
isDefault: boolean
```

---

## UI/UX Guidelines

### Color Palette
- **Primary:** White (#FFFFFF)
- **Secondary:** Light gray (#F5F5F5) for backgrounds
- **Accent:** One color for CTA (recommendation: warm orange #FF6B35 or dark blue #1A365D)
- **Text:** Dark gray (#1A1A1A) for readability
- **Subtle:** Medium gray (#6B7280) for secondary text

### Typography
- **Headings:** Sans-serif, bold (Inter, Outfit, or Source Sans Pro)
- **Body:** Sans-serif, regular
- **Cyrillic support:** Must verify font has all characters

### Layout Principles
- Maximum content width: 1280px
- Plenty of whitespace
- Book covers are hero elements — large, high quality
- Minimal UI chrome — focus on content
- Mobile-first responsive design

### Key Components
- **Header:** Logo left, search center, cart/user right, cyr/lat toggle
- **Book card:** Clean, shadow on hover, cover dominates
- **Buttons:** Rounded, one primary style, one ghost style
- **Forms:** Large inputs, clear labels, inline validation

---

## Nice to Have Features (Post-MVP)

- Recommendations based on purchase history
- Reviews and ratings
- Gift wrapping option
- E-book versions alongside physical
- Loyalty program / points
- Blog section with recommendations
- Newsletter signup with first purchase discount
- Social sharing for books
- GoodReads integration for read books sync

---

## Technical Notes for AI Code Generation

### OpenSaaS Customization Points
1. Extend User model with: preferredScript, addresses
2. Add new entities: Book, Category, Order, OrderItem, Address
3. Customize Stripe checkout for RSD and cash on delivery option
4. Add i18n for sr-Cyrl/sr-Latn

### API Endpoints Needed
- `GET /api/books` - list with pagination and filters
- `GET /api/books/:id` - single book
- `GET /api/categories` - all categories
- `POST /api/orders` - create order
- `GET /api/orders` - user's orders
- `GET /api/orders/:id` - order details
- `PATCH /api/orders/:id/status` - admin status update

### Key React Components
- `<ScriptToggle />` - Cyrillic/Latin switcher
- `<BookCard />` - book display in grid
- `<BookGrid />` - responsive grid with infinite scroll
- `<CartDrawer />` - slide-in cart
- `<CheckoutStepper />` - multi-step checkout
- `<FreeShippingProgress />` - progress bar to free shipping
- `<OrderStatusBadge />` - visual order status

### Environment Variables
```
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
FREE_SHIPPING_THRESHOLD=3000  # RSD
STANDARD_SHIPPING_COST=350    # RSD
EXPRESS_SHIPPING_COST=590     # RSD
```

---

## Deliverable Checklist

- [ ] Landing page with hero and featured sections
- [ ] Catalog page with filters
- [ ] Single book page
- [ ] Cart (drawer + dedicated page)
- [ ] Checkout flow (4 steps)
- [ ] User dashboard (orders, wishlist, profile)
- [ ] Cyrillic/Latin toggle functional
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Admin panel for books and orders