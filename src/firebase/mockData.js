// Mock Data Structure
// This file contains all your mock data before migration to Firestore
// Data structure matches the actual application structure

export const mockCustomers = [
  {
    id: 1,
    shopName: 'Hotel Sai Palace',
    billingPerson: 'Mr. Rajesh Kumar',
    mobile: '+91 98765 43210',
    location: 'Sector 5, Downtown',
    customized: 'Yes',
    rate1000ml: '₹ 45',
    rate500ml: '₹ 25',
    rate100ml: '₹ 8',
    frequency: 'Bi-weekly'
  },
  {
    id: 2,
    shopName: 'Green Leaf Cafe',
    billingPerson: 'Ms. Priya Singh',
    mobile: '+91 98765 43211',
    location: 'Market Road, City Center',
    customized: 'No',
    rate1000ml: '₹ 42',
    rate500ml: '₹ 23',
    rate100ml: '₹ 7',
    frequency: 'Weekly'
  },
  {
    id: 3,
    shopName: 'Royal Mess',
    billingPerson: 'Mr. Vikram Patel',
    mobile: '+91 98765 43212',
    location: 'JP Road, East Wing',
    customized: 'Yes',
    rate1000ml: '₹ 48',
    rate500ml: '₹ 26',
    rate100ml: '₹ 9',
    frequency: 'Tri-weekly'
  }
];

export const mockOrders = [
  {
    orderId: 'ORD-1023',
    customer: 'Hotel Sai Palace',
    date: '05 Feb 2026',
    qty1000ml: 50,
    qty500ml: 30,
    qty100ml: 100,
    rate1000ml: 45,
    rate500ml: 25,
    rate100ml: 8,
    totalBill: 3200,
    paid: 2000,
    remaining: 1200,
    paymentMode: 'Cash',
    status: 'Pending'
  },
  {
    orderId: 'ORD-1022',
    customer: 'Green Leaf Cafe',
    date: '05 Feb 2026',
    qty1000ml: 30,
    qty500ml: 20,
    qty100ml: 50,
    rate1000ml: 42,
    rate500ml: 23,
    rate100ml: 7,
    totalBill: 1850,
    paid: 1850,
    remaining: 0,
    paymentMode: 'UPI',
    status: 'Completed'
  },
  {
    orderId: 'ORD-1021',
    customer: 'Royal Mess',
    date: '04 Feb 2026',
    qty1000ml: 40,
    qty500ml: 25,
    qty100ml: 80,
    rate1000ml: 48,
    rate500ml: 26,
    rate100ml: 9,
    totalBill: 2100,
    paid: 1500,
    remaining: 600,
    paymentMode: 'Check',
    status: 'Partial'
  }
];

export const mockExpenses = [
  {
    id: 1,
    name: 'Petrol',
    amount: 5000,
    date: '05 Feb 2026',
    paymentMode: 'Cash',
    category: 'Transport',
    paid: true
  },
  {
    id: 2,
    name: 'Driver Salary',
    amount: 25000,
    date: '01 Feb 2026',
    paymentMode: 'Bank Transfer',
    category: 'Salary',
    paid: true
  },
  {
    id: 3,
    name: 'Vehicle Maintenance',
    amount: 3500,
    date: '04 Feb 2026',
    paymentMode: 'Cash',
    category: 'Maintenance',
    paid: true
  },
  {
    id: 4,
    name: 'Rent',
    amount: 15000,
    date: '01 Feb 2026',
    paymentMode: 'Check',
    category: 'Rent',
    paid: true
  },
  {
    id: 5,
    name: 'Labour Charges',
    amount: 8000,
    date: '05 Feb 2026',
    paymentMode: 'Cash',
    category: 'Labour',
    paid: true
  },
  {
    id: 6,
    name: 'Miscellaneous',
    amount: 2500,
    date: '03 Feb 2026',
    paymentMode: 'UPI',
    category: 'Other',
    paid: true
  }
];

export const mockPurchases = [
  {
    id: 1,
    vendorName: 'Water Bottle Industries Ltd',
    orderDate: '01 Feb 2026',
    deliveryDate: '05 Feb 2026',
    qty1000ml: 200,
    qty500ml: 300,
    qty100ml: 500,
    rate1000ml: 35,
    rate500ml: 18,
    rate100ml: 5,
    billingAmount: 13650,
    paid: 13650,
    remaining: 0,
    paymentMode: 'Bank Transfer',
    status: 'Delivered'
  },
  {
    id: 2,
    vendorName: 'Premium Plastics Co.',
    orderDate: '03 Feb 2026',
    deliveryDate: '08 Feb 2026',
    qty1000ml: 150,
    qty500ml: 250,
    qty100ml: 400,
    rate1000ml: 34,
    rate500ml: 17,
    rate100ml: 5,
    billingAmount: 11000,
    paid: 6000,
    remaining: 5000,
    paymentMode: 'Check',
    status: 'Pending'
  },
  {
    id: 3,
    vendorName: 'Crystal Clear Bottles',
    orderDate: '02 Feb 2026',
    deliveryDate: '06 Feb 2026',
    qty1000ml: 100,
    qty500ml: 150,
    qty100ml: 250,
    rate1000ml: 36,
    rate500ml: 19,
    rate100ml: 6,
    billingAmount: 7350,
    paid: 7350,
    remaining: 0,
    paymentMode: 'Cash',
    status: 'Delivered'
  }
];

export const mockFeedback = [
  {
    id: 1,
    customerName: 'Hotel Sai Palace',
    contactPerson: 'Mr. Rajesh Kumar',
    rating: 5,
    date: '05 Feb 2026',
    message: 'Excellent service and product quality. Delivery is always on time.',
    category: 'Service Quality'
  },
  {
    id: 2,
    customerName: 'Green Leaf Cafe',
    contactPerson: 'Ms. Priya Singh',
    rating: 4,
    date: '04 Feb 2026',
    message: 'Good quality bottles, but would appreciate faster delivery times.',
    category: 'Delivery'
  },
  {
    id: 3,
    customerName: 'Royal Mess',
    contactPerson: 'Mr. Vikram Patel',
    rating: 5,
    date: '03 Feb 2026',
    message: 'Outstanding! The customized bottles are perfect for our brand. Will order more.',
    category: 'Product Quality'
  },
  {
    id: 4,
    customerName: 'Hotel Sai Palace',
    contactPerson: 'Mr. Rajesh Kumar',
    rating: 4,
    date: '01 Feb 2026',
    message: 'Product is great but pricing could be more competitive.',
    category: 'Pricing'
  }
];
