# Firebase Firestore Migration Guide

## 📋 Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Project Configuration](#project-configuration)
3. [Database Structure](#database-structure)
4. [Migration Steps](#migration-steps)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)

---

## 🔧 Firebase Setup

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project" or "Add project"
3. Enter your project name (e.g., "Foductive")
4. Follow the setup wizard and confirm

### Step 2: Create a Firestore Database
1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your region (e.g., `us-central1`)
5. Click **Create**

> ⚠️ **Note**: Test mode allows reads/writes from anywhere. Before going to production, switch to production mode and set up proper security rules.

### Step 3: Get Your Firebase Configuration
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on your web app
4. Copy the entire firebaseConfig object

---

## 📝 Project Configuration

### Step 1: Install Firebase SDK
The Firebase SDK should be added to your dependencies:

```bash
npm install firebase
```

### Step 2: Create Environment File
Create a `.env.local` file in your project root with your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Do NOT commit `.env.local` to version control!** Add it to `.gitignore`.

### Step 3: Verify Configuration
Files created for you:
- ✅ `src/firebase/config.js` - Firebase initialization
- ✅ `src/firebase/services.js` - Database service functions
- ✅ `src/firebase/mockData.js` - Your mock data structure

---

## 📊 Database Structure

Your Firestore database will have the following collections:

```
firestore/
├── customers/
│   ├── {customerId}
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── phone: string
│   │   ├── address: string
│   │   ├── city: string
│   │   ├── state: string
│   │   ├── zipCode: string
│   │   ├── status: string (active/inactive)
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...more customers
│
├── orders/
│   ├── {orderId}
│   │   ├── customerId: string (reference to customer)
│   │   ├── orderDate: timestamp
│   │   ├── totalAmount: number
│   │   ├── status: string (pending/completed/cancelled)
│   │   ├── items: array
│   │   │   ├── productName: string
│   │   │   ├── quantity: number
│   │   │   └── price: number
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...more orders
│
├── expenses/
│   ├── {expenseId}
│   │   ├── description: string
│   │   ├── amount: number
│   │   ├── category: string
│   │   ├── date: timestamp
│   │   ├── status: string (approved/pending)
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...more expenses
│
├── purchases/
│   ├── {purchaseId}
│   │   ├── vendorName: string
│   │   ├── items: array
│   │   │   ├── productName: string
│   │   │   ├── quantity: number
│   │   │   └── costPerUnit: number
│   │   ├── totalCost: number
│   │   ├── purchaseDate: timestamp
│   │   ├── status: string (pending/received)
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...more purchases
│
└── feedback/
    ├── {feedbackId}
    │   ├── customerId: string
    │   ├── orderId: string
    │   ├── rating: number (1-5)
    │   ├── comment: string
    │   ├── date: timestamp
    │   ├── status: string (pending/published)
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    └── ...more feedback
```

---

## 🚀 Migration Steps

### Step 1: Update Your Mock Data
Edit `src/firebase/mockData.js` and add your actual mock data:

```javascript
export const mockCustomers = [
  {
    id: '1',
    name: 'Your Customer Name',
    email: 'email@example.com',
    // ... more fields
  },
  // ... more customers
];
```

### Step 2: Create Seeding Script
Create `src/firebase/seed.js`:

```javascript
import { seedDatabase } from './services';
import {
  mockCustomers,
  mockOrders,
  mockExpenses,
  mockPurchases,
  mockFeedback
} from './mockData';

export const initializeDatabase = async () => {
  try {
    await seedDatabase({
      customers: mockCustomers,
      orders: mockOrders,
      expenses: mockExpenses,
      purchases: mockPurchases,
      feedback: mockFeedback
    });
    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};
```

### Step 3: Run Seeding in Your App
Update `src/main.jsx` to seed the database on first run:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeDatabase } from './firebase/seed';

// Uncomment to seed database on first run
// initializeDatabase();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 📚 Usage Examples

### Fetching Data
```javascript
import { getCustomers, getOrdersByCustomer } from './firebase/services';

// Get all customers
const customers = await getCustomers();

// Get orders for a specific customer
const orders = await getOrdersByCustomer(customerId);
```

### Adding Data
```javascript
import { addCustomer, addOrder } from './firebase/services';

// Add a new customer
const customerId = await addCustomer({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  status: 'active'
});

// Add a new order
const orderId = await addOrder({
  customerId: customerId,
  orderDate: new Date(),
  totalAmount: 250,
  status: 'pending',
  items: [...]
});
```

### Updating Data
```javascript
import { updateCustomer } from './firebase/services';

// Update a customer
await updateCustomer(customerId, {
  name: 'Jane Doe',
  status: 'inactive'
});
```

### Deleting Data
```javascript
import { deleteCustomer } from './firebase/services';

// Delete a customer
await deleteCustomer(customerId);
```

---

## 🧪 Testing

### Test Seed Function
```javascript
// In your App.jsx or any component
import { initializeDatabase } from './firebase/seed';

// Add a button to test seeding
<button onClick={initializeDatabase}>
  Seed Database
</button>
```

### Verify in Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Go to **Build** → **Firestore Database**
3. You should see your collections populated with data

---

## 🔒 Security Rules (Production)

Before deploying to production, update your Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all by default
    match /{document=**} {
      allow read, write: if false;
    }

    // Allow authenticated users to read their data
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
    }

    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }

    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }

    match /purchases/{purchaseId} {
      allow read, write: if request.auth != null;
    }

    match /feedback/{feedbackId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📞 Troubleshooting

### Issue: "Firebase is not defined"
**Solution**: Make sure you've installed Firebase and imported it correctly in `config.js`

### Issue: "Missing environment variables"
**Solution**: Create `.env.local` file with Firebase credentials

### Issue: "Permission denied" errors
**Solution**: Check Firestore security rules - use test mode for development

### Issue: "Data not appearing in Firestore"
**Solution**: Check browser console for errors and verify database seeding ran successfully

---

## 🎯 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Update mock data in `mockData.js`
4. ✅ Run database seeding
5. ✅ Update your components to use Firebase services
6. ✅ Test all CRUD operations
7. ✅ Set up authentication
8. ✅ Deploy to production with proper security rules

---

## 📖 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)

