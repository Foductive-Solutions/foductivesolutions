# Foductive Solution - Quick Reference Guide

## 🌐 Website Navigation

### Public Pages
- **Home** `/` → Redirects based on login status
- **Portfolio** `/portfolio` → Landing page with services overview
- **Admin Login** `/login` → Authentication page

### Admin Dashboard (Protected)
All admin pages are wrapped with **AdminLayout** (sidebar + header)

| Page | Route | Key Features |
|------|-------|--------------|
| Dashboard | `/dashboard` | Sales overview, stock status, recent orders |
| Customers | `/customers` | List all shops/hotels, search, quick stats |
| Customer Detail | `/customer/:id` | Full customer profile, orders, stock |
| Orders | `/orders` | All orders, status filtering, outstanding tracking |
| Expenses | `/expenses` | Track costs by category, breakdown analysis |
| Purchase | `/purchase` | Vendor orders, inventory received, payment status |
| Feedback | `/feedback` | Customer reviews, ratings, sentiment analysis |

---

## 🎯 Key Data Fields

### Customer Data
```javascript
{
  shopName: string,
  billingPerson: string,
  mobile: string,
  location: string,
  customized: "Yes" | "No",
  rate1000ml: number,
  rate500ml: number,
  rate100ml: number,
  frequency: string // "Weekly", "Bi-weekly", "Tri-weekly"
}
```

### Order Data
```javascript
{
  orderId: string,
  customer: string,
  date: string,
  qty1000ml: number,
  qty500ml: number,
  qty100ml: number,
  totalBill: number,
  paid: number,
  remaining: number,
  paymentMode: string, // "Cash", "Check", "UPI", "Bank Transfer"
  status: "Completed" | "Pending" | "Partial"
}
```

### Expense Categories
- Petrol (Transport)
- Driver Salary (Salary)
- Vehicle Maintenance (Maintenance)
- Rent
- Labour Charges
- Miscellaneous

---

## 🎨 Component Structure

### Page Components
Each page (`Dashboard`, `Customers`, `Orders`, etc.) is structured as:

```
Page Component
├── Page Header (Title + Action Button)
├── Summary Stats (Cards)
├── Filter/Search Bar
├── Data Table/Cards
├── Breakdown/Analytics
└── Related Information
```

### Reusable Components
- `StatCard` - KPI display
- `RecentOrderRow` - Table row for orders
- `StockRow` - Stock display row
- Filter buttons and tabs

---

## 🔧 Customization Guide

### Adding a New Page

1. **Create Page Component**
   ```jsx
   // src/pages/newfeature/NewFeature.jsx
   import React from 'react'
   
   const NewFeature = () => {
     return (
       <div className="space-y-6 text-slate-200">
         {/* Content */}
       </div>
     )
   }
   
   export default NewFeature
   ```

2. **Add Route in App.jsx**
   ```jsx
   <Route element={<AdminLayout />}>
     <Route path='/newfeature' element={<NewFeature />} />
   </Route>
   ```

3. **Add Navbar Link in AdminLayout.jsx**
   ```jsx
   <NavLink to="/newfeature" /* ... */>
     🆕 New Feature
   </NavLink>
   ```

### Styling Colors

**Use these Tailwind classes:**
```css
/* Text Colors */
text-teal-400    /* Primary action */
text-green-400   /* Success/Positive */
text-yellow-400  /* Warning/Pending */
text-red-400     /* Danger/Negative */
text-slate-300   /* Secondary text */
text-slate-400   /* Tertiary text */

/* Background Colors */
bg-slate-900     /* Cards/Containers */
bg-slate-800     /* Headers/Hover */
bg-slate-950     /* Page background */

/* Borders */
border-slate-800 /* Card borders */
border-slate-700 /* Hover borders */
```

---

## 📊 Mock Data Structure

### Current Mock Data Locations
- **Dashboard:** Hardcoded in component
- **Customers:** useState array in customers.jsx
- **Orders:** useState array in Orders.jsx
- **Expenses:** useState array in Expenses.jsx
- **Purchase:** useState array in Purchase.jsx
- **Feedback:** useState array in Feedback.jsx

**To migrate to API:**
Replace `useState` with `useEffect` + API fetch calls:
```jsx
const [data, setData] = useState([])

useEffect(() => {
  fetch('/api/endpoint')
    .then(res => res.json())
    .then(data => setData(data))
}, [])
```

---

## 🔐 Authentication Flow

**Current:** Mock authentication with localStorage

**Steps to Implement Real Auth:**

1. **Replace mock login in Login.jsx:**
   ```jsx
   // Current: hardcoded admin check
   // Replace with API call:
   const response = await fetch('/api/login', {
     method: 'POST',
     body: JSON.stringify({ username, password })
   })
   const { token } = await response.json()
   localStorage.setItem('token', token)
   ```

2. **Add Protected Routes:**
   ```jsx
   // Create ProtectedRoute component
   const ProtectedRoute = ({ element }) => {
     const isLoggedIn = localStorage.getItem('token')
     return isLoggedIn ? element : <Navigate to="/login" />
   }
   ```

3. **Add API Headers:**
   ```jsx
   const token = localStorage.getItem('token')
   fetch(url, {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

Most layouts use:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Responsive grid */}
</div>
```

---

## 🐛 Debugging Tips

1. **Check Console:** Open DevTools (F12)
2. **Inspect Elements:** Right-click → Inspect
3. **React DevTools:** Install React extension
4. **Check Routes:** Verify App.jsx route definitions
5. **State Issues:** Use React DevTools to inspect useState

---

## 📦 Dependencies

Current setup uses:
- `react` - UI library
- `react-router-dom` - Routing
- `tailwindcss` - Styling
- `vite` - Build tool

**To add more libraries:**
```bash
npm install package-name
```

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📞 Support & Maintenance

### Common Issues

| Issue | Solution |
|-------|----------|
| Routes not working | Check route path spelling in App.jsx |
| Styling not applied | Verify Tailwind CSS classes, check specificity |
| Data not updating | Check useState dependencies, verify API calls |
| Sidebar not toggling | Ensure sidebarOpen state is properly managed |

### Best Practices

✅ Use semantic HTML  
✅ Keep components focused and small  
✅ Use consistent naming conventions  
✅ Add comments for complex logic  
✅ Test responsive design on mobile  
✅ Validate user input  
✅ Handle API errors gracefully  

---

**Last Updated:** December 31, 2025  
**Project Status:** MVP Ready with Mock Data
