# Foductive Solution - Complete Routing Map

## 🗺️ Application Route Structure

```
/
├── / (Landing)
│   └── Redirects to /dashboard if logged in, /portfolio if not
│
├── /portfolio (Public)
│   └── Portfolio.jsx - Company overview & services
│
├── /login (Public)
│   └── Login.jsx - Admin authentication
│
└── /admin/* (Protected - with AdminLayout)
    │
    ├── /dashboard
    │   └── Dashboard.jsx
    │       ├── Overall Sales Card
    │       ├── Today's Sales Card
    │       ├── Bill to Receive (Today) Card
    │       ├── Total Pending Bill Card
    │       ├── Recent Orders Table
    │       ├── Stock Overview
    │       ├── Active Customers Metric
    │       ├── Pending Payments Metric
    │       └── Monthly Expenses Metric
    │
    ├── /customers
    │   └── customers.jsx
    │       ├── Search Bar
    │       ├── Customers Table with:
    │       │   ├── Shop Name
    │       │   ├── Billing Person
    │       │   ├── Mobile Number
    │       │   ├── Location
    │       │   ├── Customized (Yes/No)
    │       │   ├── Order Frequency
    │       │   └── Actions (View Details)
    │       └── Summary Stats
    │           ├── Total Customers
    │           ├── Active This Week
    │           └── Customized Orders
    │
    ├── /customer/:id
    │   └── CustomerDetail.jsx
    │       ├── Customer Info Cards
    │       │   ├── Contact Person
    │       │   ├── Location
    │       │   ├── Order Frequency
    │       │   └── Customized Status
    │       ├── Sales Summary
    │       │   ├── Overall Sales
    │       │   ├── Today's Sales
    │       │   └── Rates (1000ml, 500ml, 100ml)
    │       ├── Stock Summary
    │       │   ├── 1000ml Stats
    │       │   ├── 500ml Stats
    │       │   └── 100ml Stats
    │       ├── Order History Table
    │       │   ├── Order ID
    │       │   ├── Date
    │       │   ├── Quantities (1000ml, 500ml, 100ml)
    │       │   ├── Rates
    │       │   ├── Total Bill
    │       │   ├── Paid Amount
    │       │   ├── Remaining Amount
    │       │   └── Payment Mode
    │       └── Bill Summary
    │           ├── Total Bill Amount
    │           ├── Total Paid
    │           └── Total Pending
    │
    ├── /orders
    │   └── Orders.jsx
    │       ├── Filter Tabs (All, Completed, Pending, Partial)
    │       ├── Orders Table with:
    │       │   ├── Order ID
    │       │   ├── Customer
    │       │   ├── Date
    │       │   ├── Quantities (1000ml, 500ml, 100ml)
    │       │   ├── Total Bill
    │       │   ├── Paid Amount
    │       │   ├── Remaining Amount
    │       │   ├── Payment Mode
    │       │   └── Status Badge
    │       └── Summary Stats
    │           ├── Total Orders
    │           ├── Total Bill Value
    │           ├── Total Received
    │           └── Outstanding Amount
    │
    ├── /expenses
    │   └── Expenses.jsx
    │       ├── Summary Cards
    │       │   ├── Total Expenses (Feb)
    │       │   ├── Salary Expenses
    │       │   ├── Transport & Maintenance
    │       │   └── Fixed Costs (Rent)
    │       ├── Category Filter Buttons
    │       ├── Expenses Table with:
    │       │   ├── Expense Name
    │       │   ├── Category
    │       │   ├── Date
    │       │   ├── Amount
    │       │   ├── Payment Mode
    │       │   └── Actions (Edit)
    │       ├── Breakdown by Category
    │       │   ├── Progress bars
    │       │   └── Percentage breakdown
    │       └── Breakdown by Payment Mode
    │           ├── Progress bars
    │           └── Payment mode distribution
    │
    ├── /purchase
    │   └── Purchase.jsx
    │       ├── Summary Cards
    │       │   ├── Total Orders
    │       │   ├── Total Spent
    │       │   ├── Amount Paid
    │       │   └── Amount Pending
    │       ├── Filter Tabs (All, Delivered, Pending)
    │       ├── Purchase Orders Table with:
    │       │   ├── PO ID
    │       │   ├── Vendor Name
    │       │   ├── Order Date
    │       │   ├── Delivery Date
    │       │   ├── Quantities (1000ml, 500ml, 100ml)
    │       │   ├── Bill Amount
    │       │   ├── Paid Amount
    │       │   ├── Remaining Amount
    │       │   ├── Payment Mode
    │       │   └── Status Badge
    │       ├── Vendor Summary Cards
    │       │   ├── Vendor Name
    │       │   ├── Total Orders
    │       │   ├── Total Amount Spent
    │       │   └── Delivery Status
    │       └── Bottle Inventory Summary
    │           ├── Total 1000ml Bottles
    │           ├── Total 500ml Bottles
    │           └── Total 100ml Bottles
    │
    └── /feedback
        └── Feedback.jsx
            ├── Summary Cards
            │   ├── Total Feedbacks
            │   ├── Average Rating
            │   ├── Positive Reviews
            │   └── Needs Attention
            ├── Filter Tabs
            │   ├── All
            │   ├── Positive (4-5 stars)
            │   ├── Needs Attention
            │   └── By Category
            ├── Feedback Cards (Expandable)
            │   ├── Customer Name
            │   ├── Contact Person
            │   ├── Rating Stars
            │   ├── Category Badge
            │   ├── Date
            │   ├── Message (Expanded)
            │   └── Actions (Reply, Archive)
            ├── Feedback by Rating
            │   └── 5 Star, 4 Star, 3 Star, etc.
            └── Feedback by Category
                └── Category breakdown with avg rating
```

---

## 📋 URL Reference

### Public Routes
| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Landing.jsx | Home/redirect |
| `/portfolio` | Portfolio.jsx | Public landing page |
| `/login` | Login.jsx | Admin authentication |

### Admin Protected Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard` | Dashboard.jsx | Sales overview dashboard |
| `/customers` | Customers.jsx | List all customers/shops |
| `/customer/:id` | CustomerDetail.jsx | Individual customer profile |
| `/orders` | Orders.jsx | All orders management |
| `/expenses` | Expenses.jsx | Expense tracking |
| `/purchase` | Purchase.jsx | Vendor purchase orders |
| `/feedback` | Feedback.jsx | Customer feedback & reviews |

---

## 🔄 Navigation Flow

```
Landing Page (/)
    ↓
    ├─→ Not Logged In → Portfolio (/portfolio)
    │                       ↓
    │                    Click "Admin Dashboard"
    │                       ↓
    │                    Login Page (/login)
    │                       ↓
    │                    Enter: admin / admin
    │                       ↓
    │                    Dashboard
    │
    └─→ Logged In → Dashboard (/dashboard)
                          ↓
                   [Sidebar Navigation]
                          ↓
        ┌─────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
        ↓             ↓          ↓          ↓          ↓          ↓          ↓
    Dashboard    Customers   Orders    Expenses   Purchase   Feedback   Logout
        ↓             ↓
        │        Customers List
        │             ↓
        │        Click "View Details"
        │             ↓
        │        Customer Detail Page
        │        (/customer/:id)
        │
    Can access any page via sidebar
```

---

## 🎯 Component Hierarchy

```
App
├── Routes
│   ├── Landing
│   ├── Portfolio
│   ├── Login
│   └── AdminLayout (Protected wrapper)
│       ├── Sidebar Navigation
│       ├── Top Header
│       └── <Outlet>
│           ├── Dashboard
│           ├── Customers
│           │   └── Customer Detail (nested route)
│           ├── Orders
│           ├── Expenses
│           ├── Purchase
│           └── Feedback
│
└── Sub-components
    ├── StatCard (Dashboard)
    ├── RecentOrderRow (Dashboard)
    ├── StockRow (Dashboard)
    ├── NavLink (AdminLayout)
    └── Various Table & Card components
```

---

## 🔐 Access Control

### Public Access
- `/` - Home
- `/portfolio` - Portfolio page
- `/login` - Login page

### Admin Access (Requires Authentication)
- All `/` routes except listed public routes
- Redirects to `/login` if not authenticated
- Uses localStorage token check

---

## 📱 Responsive Behavior

All routes adapt to:
- **Mobile (< 640px):** Single column, collapsed sidebar
- **Tablet (640px - 1024px):** Two columns, toggleable sidebar
- **Desktop (> 1024px):** Full sidebar + content layout

---

## 🔗 Breadcrumb Navigation

| Page | Breadcrumb Path |
|------|-----------------|
| Dashboard | Dashboard |
| Customers | Customers |
| Customer Detail | Customers > Hotel Sai Palace |
| Orders | Orders |
| Expenses | Expenses |
| Purchase | Purchase Orders |
| Feedback | Customer Feedback |

---

## ⚡ Quick Navigation Links

**From Dashboard:**
- Recent Orders → Click order ID → (Future: Order detail page)
- Stock Overview → (Can link to Purchase page)

**From Customers:**
- View Details → Customer Detail page (/customer/:id)

**From Customer Detail:**
- Back to Customers → Customers list

**From any admin page:**
- Sidebar → Navigate to any other admin page
- Click brand name → Go to Dashboard

---

**Last Updated:** December 31, 2025
