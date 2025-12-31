# Foductive Solution - Testing & Demo Guide

## 🚀 Quick Start

### Installation & Launch
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will open at http://localhost:5173
```

---

## 📝 Login Credentials

**Demo Account:**
- Username: `admin`
- Password: `admin`

**Note:** Simple authentication for demo purposes only. Replace with real auth before production.

---

## ✅ Testing Checklist

### Navigation Testing

#### Public Pages
- [ ] Visit home page `/` - Should redirect to `/portfolio` (not logged in)
- [ ] Check Portfolio page `/portfolio`
  - [ ] See company name "Foductive Solution"
  - [ ] See brand name "Aarich Water Bottles"
  - [ ] Click "Admin Dashboard" button → Should go to `/login`
- [ ] Check Login page `/login`
  - [ ] See login form
  - [ ] See demo credentials hint
  - [ ] Error message appears with wrong credentials
  - [ ] Login with `admin/admin` → Should redirect to `/dashboard`

#### Admin Pages (After Login)
- [ ] Dashboard `/dashboard` - Main overview page
- [ ] Customers `/customers` - Customer list
- [ ] Customer Detail `/customer/1` - Specific customer page
- [ ] Orders `/orders` - All orders
- [ ] Expenses `/expenses` - Expense tracking
- [ ] Purchase `/purchase` - Vendor orders
- [ ] Feedback `/feedback` - Customer reviews

### Sidebar Navigation Testing

- [ ] Sidebar toggles open/close
- [ ] Can click each navigation item
- [ ] Active page highlighted in sidebar
- [ ] Logout button works
- [ ] Responsive on mobile (hamburger menu)

### Page-Specific Features

#### Dashboard
- [ ] All 4 stat cards display
- [ ] Recent Orders table shows data
- [ ] Stock Overview displays bottle sizes
- [ ] Summary statistics visible
- [ ] Page title and subtitle present

#### Customers
- [ ] Customer list displays all shops
- [ ] Search box filters by shop name
- [ ] Search filters by mobile number
- [ ] "View Details" link works for each customer
- [ ] Summary stats show correct counts
- [ ] "Add Customer" button present

#### Customer Detail
- [ ] Back button navigates to Customers
- [ ] Customer info cards display correctly
- [ ] Sales summary shows metrics
- [ ] Stock summary visible for 3 sizes
- [ ] Order history table populated
- [ ] Bill summary cards visible
- [ ] All data properly formatted

#### Orders
- [ ] Filter tabs work (All, Completed, Pending, Partial)
- [ ] Orders table shows all columns
- [ ] Status badges display correctly
  - [ ] Completed = Green
  - [ ] Pending = Yellow
  - [ ] Partial = Orange
- [ ] Summary statistics updated based on filter
- [ ] "New Order" button present

#### Expenses
- [ ] Summary cards show totals
- [ ] Category filter buttons work
- [ ] Expenses table displays data
- [ ] Breakdown charts visible
  - [ ] By Category
  - [ ] By Payment Mode
- [ ] Progress bars show percentages
- [ ] "Add Expense" button present

#### Purchase
- [ ] Summary stats display correctly
- [ ] Status filter tabs work
- [ ] Purchase orders table complete
- [ ] Vendor summary cards show info
- [ ] Bottle inventory summary visible
- [ ] "New Purchase Order" button present

#### Feedback
- [ ] Summary stats visible
- [ ] Filter tabs work
- [ ] Feedback cards expandable
- [ ] Ratings display correctly
- [ ] Category badges show
- [ ] Breakdown charts visible
- [ ] "Add Feedback" button present

### Styling & Responsive Testing

#### Colors & Theme
- [ ] Dark theme applied (slate background)
- [ ] Text readable (slate 200-300)
- [ ] Accent colors visible (teal, green, yellow, red)
- [ ] Cards have proper borders
- [ ] Hover effects work

#### Responsive Design
- [ ] Mobile (< 640px)
  - [ ] Single column layout
  - [ ] Sidebar toggles
  - [ ] Tables horizontal scroll
  - [ ] Touch-friendly buttons
- [ ] Tablet (640px - 1024px)
  - [ ] 2-column layouts
  - [ ] Sidebar toggle option
  - [ ] Readable text
- [ ] Desktop (> 1024px)
  - [ ] Full sidebar visible
  - [ ] Multi-column layouts
  - [ ] All details visible

### Data Integrity Testing

#### Search Functionality
- [ ] Customer search by name works
- [ ] Customer search by mobile works
- [ ] Search clears correctly
- [ ] No results handled properly

#### Filtering
- [ ] Order status filters accurate
- [ ] Expense category filters work
- [ ] Purchase status filters correct
- [ ] Feedback rating filters work

#### Data Display
- [ ] Numbers formatted correctly (₹ symbol)
- [ ] Dates display properly
- [ ] Tables align correctly
- [ ] No data truncation

---

## 🎯 Feature Testing Guide

### Dashboard Testing

1. **Stat Cards**
   ```
   Check these appear with correct values:
   - Overall Sales: ₹ 4,85,000
   - Today's Sales: ₹ 12,500
   - Bill to Receive (Today): ₹ 6,200
   - Total Pending Bill: ₹ 78,300
   ```

2. **Recent Orders Table**
   ```
   Verify columns:
   - Order ID | Customer | Date | Amount
   
   Sample data:
   ORD-1023 | Hotel Sai Palace | 05 Feb 2026 | ₹ 3,200
   ORD-1022 | Green Leaf Cafe | 05 Feb 2026 | ₹ 1,850
   ```

3. **Stock Overview**
   ```
   Check all 3 bottle sizes:
   - 1000ml: 1,250 (OK)
   - 500ml: 420 (Warning)
   - 100ml: 90 (Danger)
   ```

### Customers Testing

1. **Customer List**
   ```
   Verify displayed customers:
   - Hotel Sai Palace
   - Green Leaf Cafe
   - Royal Mess
   ```

2. **Search Testing**
   ```
   Try these searches:
   - "Hotel" → Shows Hotel Sai Palace
   - "98765" → Shows relevant customers
   - "xyz" → Shows no results
   ```

3. **Detail Page Navigation**
   ```
   Click "View Details" on Hotel Sai Palace:
   - Should show /customer/1 in URL
   - Display all customer information
   - Show order history
   - Back button works
   ```

### Orders Testing

1. **Filter Testing**
   ```
   Click filter buttons and verify:
   - "All" → Shows 3 orders
   - "Completed" → Shows 1 order
   - "Pending" → Shows 1 order
   - "Partial" → Shows 1 order
   ```

2. **Status Badges**
   ```
   Check color coding:
   - Green = Completed ✓
   - Yellow = Pending ⚠
   - Orange = Partial ⏳
   ```

### Expenses Testing

1. **Category Filter**
   ```
   Click each category:
   - All → Shows all expenses
   - Petrol → Shows petrol only
   - Driver Salary → Shows salary
   - Etc.
   ```

2. **Breakdown Charts**
   ```
   Verify two charts:
   - By Category (pie chart visualization)
   - By Payment Mode (pie chart visualization)
   ```

### Purchase Testing

1. **Vendor Summary**
   ```
   Check vendor cards display:
   - Vendor name
   - Number of orders
   - Total amount spent
   - Delivery status
   ```

2. **Inventory Summary**
   ```
   Verify bottle totals:
   - 1000ml: 350 units
   - 500ml: 550 units
   - 100ml: 900 units
   ```

### Feedback Testing

1. **Expandable Cards**
   ```
   Click feedback cards to expand:
   - Shows full message
   - Shows action buttons (Reply, Archive)
   - Can collapse again
   ```

2. **Rating Distribution**
   ```
   Check rating summary:
   - 5 stars: 60% ██████░░░░
   - 4 stars: 40% ████░░░░░░
   - Correct average: 4.6/5
   ```

---

## 🐛 Bug Testing

### Common Issues to Check

| Issue | How to Test | Expected Result |
|-------|------------|-----------------|
| Routes not working | Type URL directly | Page loads correctly |
| Styling missing | Zoom page | All styles apply |
| Data not showing | Refresh page | Data persists |
| Sidebar toggle | Resize to mobile | Toggle button appears |
| Search not working | Type in search | Results filter |
| Filters not working | Click filter button | Data updates |

### Console Errors
- [ ] Open DevTools (F12)
- [ ] Check Console tab
- [ ] No errors should appear
- [ ] Warnings acceptable (React warnings in dev)

---

## 📊 Performance Testing

1. **Page Load Time**
   ```
   Dashboard should load in < 2 seconds
   Other pages in < 1 second
   ```

2. **Responsiveness**
   ```
   No lag when:
   - Clicking buttons
   - Typing in search
   - Scrolling tables
   - Expanding cards
   ```

3. **Mobile Performance**
   ```
   Test on mobile:
   - Sidebar toggle smooth
   - Tables scroll smoothly
   - Buttons responsive
   - No layout shifts
   ```

---

## 🎬 Demo Workflow

### Scenario 1: New Admin Login
1. Visit portfolio page
2. Click "Admin Dashboard"
3. Login with `admin`/`admin`
4. Verify dashboard loads
5. Check all stat cards
6. View recent orders

### Scenario 2: Customer Management
1. Navigate to Customers
2. See list of 3 shops
3. Search for "Hotel"
4. Click "View Details"
5. See customer orders
6. Go back to list

### Scenario 3: Order Management
1. Go to Orders page
2. Filter by "Pending"
3. See pending orders
4. Check status badges
5. Review order details
6. Check summary stats

### Scenario 4: Financial Review
1. Check Dashboard sales
2. Go to Orders for details
3. Check Expenses page
4. Review expense breakdown
5. Check Purchase page
6. Review vendor spending

### Scenario 5: Customer Satisfaction
1. Go to Feedback page
2. Expand feedback cards
3. Check ratings
4. View breakdown charts
5. See average rating
6. Filter by sentiment

---

## 📱 Device Testing

### Recommended Test Devices
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 (390x844)
- [ ] Android (360x800)

### Browser Testing
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

---

## ✨ Quality Checklist

### Functional
- [ ] All pages load
- [ ] All buttons work
- [ ] All links navigate
- [ ] Search functions
- [ ] Filters work
- [ ] Data displays correctly

### Visual
- [ ] Dark theme applied
- [ ] Colors consistent
- [ ] Text readable
- [ ] Spacing proper
- [ ] Responsive layout
- [ ] Icons/badges display

### User Experience
- [ ] Intuitive navigation
- [ ] Clear labels
- [ ] Helpful hints
- [ ] Quick actions
- [ ] Feedback responsive
- [ ] No confusion

### Performance
- [ ] Fast loading
- [ ] Smooth scrolling
- [ ] Quick filtering
- [ ] No lag
- [ ] Minimal network calls

### Data
- [ ] Numbers correct
- [ ] Dates formatted
- [ ] Values updated
- [ ] No duplicates
- [ ] Proper alignment

---

## 📋 Testing Report Template

```
Date: _______________
Tester: ______________

✅ PASSED TESTS
- Page X loads correctly
- Feature Y works as expected
- [etc.]

⚠️ ISSUES FOUND
- Issue 1: [Description]
  Severity: Low/Medium/High
  Steps to reproduce: [...]
  
❌ FAILED TESTS
- Test: [Description]
  Expected: [...]
  Actual: [...]

OVERALL ASSESSMENT: ___/10
Recommended for: [Production/Further Testing/Fix Required]
```

---

## 🚀 Next Testing Phase

After basic functionality testing, test these upcoming features:

- [ ] Export reports to PDF
- [ ] Export reports to CSV
- [ ] Print functionality
- [ ] Multi-user login
- [ ] Role-based access
- [ ] Real-time updates
- [ ] API integration
- [ ] Advanced analytics

---

## 📞 Issue Reporting

When reporting bugs, include:
1. What page/feature
2. What you did (steps)
3. What happened (actual)
4. What should happen (expected)
5. Browser & device
6. Screenshot if possible

---

**Last Updated:** December 31, 2025  
**Test Version:** 1.0.0
