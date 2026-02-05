# Serbian Bookstore - Marketplace Features Addon

## Overview

This document extends the base B2C spec to support a C2C + B2C marketplace model where both private individuals and businesses (publishers, bookstores) can sell books. Think "KupujemProdajem but only for books."

---

## New User Roles

### Buyer (existing)
- Can browse, search, purchase books
- Has wishlist, order history
- No changes needed

### Seller (new)
- Can list books for sale
- Manages their own listings
- Two subtypes:
  - **Private Seller** - individual person selling personal books
  - **Business Seller** - registered company (Laguna, Vulkan, local bookstores, etc.)

### User can be both buyer and seller simultaneously

---

## Seller Registration Flow

### Step 1: Choose Seller Type
- "Privatno lice" (Private individual)
- "Firma" (Business)

### Step 2a: Private Seller Info
- Full name (already have from user profile)
- Phone number (required for contact)
- City/Location
- Agree to terms of service

### Step 2b: Business Seller Info
- Company name
- PIB (Serbian tax ID)
- Address
- Contact phone
- Contact email
- Logo upload (optional)
- Agree to terms of service

### Step 3: Verification
- Private: Phone verification (SMS code)
- Business: Manual approval or automatic (MVP: automatic)

---

## Book Listing Flow ("Objavi knjigu")

### Required Fields
- Title
- Author
- Price (RSD)
- Condition (see below)
- Category (from existing categories)
- At least 1 photo

### Book Condition Options
```
NEW - Nova (neotpakovana)
LIKE_NEW - Kao nova (pročitana jednom, bez tragova)
VERY_GOOD - Odlična (minimalni tragovi korišćenja)
GOOD - Dobra (vidljivi tragovi, sve čitljivo)
ACCEPTABLE - Prihvatljiva (oštećenja, podvlačenja, ali kompletna)
```

### Optional Fields
- ISBN (auto-fill other data if provided)
- Description / notes
- Publisher
- Year of publication
- Number of pages
- Binding (hardcover/softcover)
- Language
- Multiple photos (up to 5)

### Pricing Options
- Fixed price
- "Cena po dogovoru" (price negotiable) checkbox
- Optional: "Fixno" badge for non-negotiable

### Listing Settings
- Active / Paused / Sold
- Auto-deactivate after X days (configurable, default 30)
- Bump/renew listing option

---

## Seller Dashboard

### My Listings
- Grid/list view of all seller's books
- Quick filters: Active, Paused, Sold, Expired
- Quick actions: Edit, Pause, Mark as Sold, Delete
- Stats: views, favorites count

### My Sales (if platform handles transactions)
- Order list with status
- Buyer info
- Shipping/handover details

### Messages (MVP: simplified)
- List of inquiries from buyers
- Simple thread per listing

### Seller Profile Settings
- Edit seller info
- Visibility settings
- Notification preferences

---

## Seller Profile Page (Public)

### Header
- Seller name (or company name + logo)
- Member since date
- Location (city)
- Seller type badge: "Privatni prodavac" / "Firma"
- Rating (if implemented, otherwise skip)
- Total listings count
- Response time (nice to have)

### Listings Section
- Grid of all active books from this seller
- Search within seller's listings
- Sort by: newest, price, etc.

### Contact Section
- "Pošalji poruku" button (opens message form)
- "Prikaži broj telefona" button (reveals on click)
- For business: website link, if provided

---

## Updated Book Page

### New Sections
- **Seller info card** (right sidebar or below main info)
  - Seller name
  - Seller type badge
  - Location
  - Member since
  - "Pogledaj sve knjige prodavca" link
  - Contact button

- **Book condition** prominently displayed
  - Condition badge with color coding
  - Condition description tooltip

### For Business Sellers with Multiple Copies
- Stock count: "3 primerka na stanju"
- Add to cart (existing flow)

### For Private Sellers (unique items)
- No cart, direct "Kontaktiraj prodavca" or "Kupi odmah"
- If platform handles payment: buy now flow
- If not: contact seller to arrange

---

## Search & Filter Updates

### New Filters
- Condition (multi-select)
- Seller type: Svi / Privatni / Firme
- Location/City
- Price: "Po dogovoru" toggle

### New Sort Options
- Newest listings
- Ending soon (if expiration implemented)

---

## Data Model Additions

### SellerProfile
```
id: string
userId: string (relation to User)
type: enum (PRIVATE, BUSINESS)
displayName: string
phone: string
city: string
isVerified: boolean
createdAt: datetime

// Business only
companyName: string (optional)
pib: string (optional)
logo: string (optional)
website: string (optional)
```

### Book (updated)
```
// Add these fields to existing Book model
sellerId: string (relation to SellerProfile)
condition: enum (NEW, LIKE_NEW, VERY_GOOD, GOOD, ACCEPTABLE)
isNegotiable: boolean
status: enum (ACTIVE, PAUSED, SOLD, EXPIRED)
expiresAt: datetime (optional)
viewCount: number
images: string[] (array of URLs, first is primary)
```

### Message (new)
```
id: string
bookId: string
senderId: string
receiverId: string
content: string
isRead: boolean
createdAt: datetime
```

### Conversation (new)
```
id: string
bookId: string
buyerId: string
sellerId: string
lastMessageAt: datetime
```

---

## API Endpoints (New)

### Seller
- `POST /api/seller/register` - become a seller
- `GET /api/seller/profile` - get own seller profile
- `PATCH /api/seller/profile` - update seller profile
- `GET /api/seller/:id` - public seller profile

### Listings
- `POST /api/listings` - create new listing
- `GET /api/listings/mine` - seller's own listings
- `PATCH /api/listings/:id` - update listing
- `DELETE /api/listings/:id` - delete listing
- `POST /api/listings/:id/sold` - mark as sold
- `POST /api/listings/:id/bump` - renew listing

### Messages
- `GET /api/conversations` - list conversations
- `GET /api/conversations/:id/messages` - messages in conversation
- `POST /api/messages` - send message
- `POST /api/messages/:id/read` - mark as read

---

## React Components (New)

### Seller Registration
- `<SellerTypeSelector />` - private vs business choice
- `<PrivateSellerForm />` - registration form
- `<BusinessSellerForm />` - registration form

### Listing Management
- `<CreateListingForm />` - multi-step book listing form
- `<ConditionSelector />` - visual condition picker
- `<ImageUploader />` - multiple image upload with drag/drop
- `<MyListingsGrid />` - seller's listings with actions
- `<ListingStatusBadge />` - active/paused/sold indicator

### Seller Public Profile
- `<SellerProfileHeader />` - seller info and stats
- `<SellerBookGrid />` - books from specific seller
- `<SellerContactCard />` - contact options

### Messaging
- `<ConversationList />` - list of chats
- `<MessageThread />` - individual conversation
- `<ContactSellerButton />` - initiates conversation
- `<RevealPhoneButton />` - show phone on click

### Updated Components
- `<BookCard />` - add condition badge, seller name
- `<BookFilters />` - add condition, seller type, location filters
- `<BookPage />` - add seller section

---

## UI Notes

### Condition Badge Colors
```
NEW - Green (#22C55E)
LIKE_NEW - Teal (#14B8A6)
VERY_GOOD - Blue (#3B82F6)
GOOD - Yellow (#EAB308)
ACCEPTABLE - Orange (#F97316)
```

### Seller Type Badges
- Private: simple text badge, neutral gray
- Business: highlighted badge, maybe with checkmark icon

### Listing Form UX
- Progressive disclosure: start simple, "Više opcija" expands
- ISBN lookup: if entered, offer to auto-fill known data
- Image upload: drag & drop, mobile camera support
- Preview before publish

---

## MVP Priorities

### Must Have (for prototype)
1. Seller registration (both types)
2. Create listing form (basic fields + condition + images)
3. My listings page with status management
4. Seller info on book page
5. Contact seller (reveal phone number)
6. Search filters: condition, seller type

### Should Have (if time permits)
1. Simple messaging system
2. Seller public profile page
3. Listing expiration
4. "Cena po dogovoru" indicator

### Nice to Have (post-MVP)
1. Seller ratings and reviews
2. ISBN auto-fill
3. Listing bump/promote
4. Saved searches with notifications
5. Price history / price drop alerts
6. Verified seller badges

---

## Implementation Order (Suggested)

### Evening Session
1. SellerProfile model + registration API
2. Seller registration UI (both types)
3. Update Book model with new fields

### Morning Session
1. Create listing form + API
2. My listings dashboard
3. Update book page with seller info
4. Update search with new filters

### Final Polish
1. Contact seller functionality
2. Test full flow: register as seller → list book → buyer finds it → contacts seller
3. Mobile responsive check
4. Screenshots for submission