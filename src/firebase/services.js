import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// ==================== CUSTOMERS ====================

export const addCustomer = async (customerData) => {
  try {
    const customerRef = await addDoc(collection(db, 'customers'), {
      ...customerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return customerRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const getCustomers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'customers'));
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in memory to avoid requiring Firestore index
    return customers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (customerId) => {
  try {
    const docRef = doc(db, 'customers', customerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId, customerData) => {
  try {
    const docRef = doc(db, 'customers', customerId);
    await updateDoc(docRef, {
      ...customerData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    await deleteDoc(doc(db, 'customers', customerId));
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// ==================== ORDERS ====================

export const addOrder = async (orderData) => {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return orderRef.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'orders'));
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in memory to avoid requiring Firestore index
    return orders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrdersByCustomer = async (customerId) => {
  try {
    // Get all orders and filter in memory to avoid needing Firestore indexes
    const snapshot = await getDocs(collection(db, 'orders'));
    const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter by customerId or by customer name matching the shop
    const customerOrders = allOrders.filter(order => 
      order.customerId === customerId || order.customer === customerId
    );
    
    // Sort by createdAt
    return customerOrders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...orderData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// ==================== EXPENSES ====================

export const addExpense = async (expenseData) => {
  try {
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return expenseRef.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'expenses'));
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in memory to avoid requiring Firestore index
    return expenses.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const updateExpense = async (expenseId, expenseData) => {
  try {
    const docRef = doc(db, 'expenses', expenseId);
    await updateDoc(docRef, {
      ...expenseData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// ==================== PURCHASES ====================

export const addPurchase = async (purchaseData) => {
  try {
    const purchaseRef = await addDoc(collection(db, 'purchases'), {
      ...purchaseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return purchaseRef.id;
  } catch (error) {
    console.error('Error adding purchase:', error);
    throw error;
  }
};

export const getPurchases = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'purchases'));
    const purchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in memory to avoid requiring Firestore index
    return purchases.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

export const updatePurchase = async (purchaseId, purchaseData) => {
  try {
    const docRef = doc(db, 'purchases', purchaseId);
    await updateDoc(docRef, {
      ...purchaseData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating purchase:', error);
    throw error;
  }
};

export const deletePurchase = async (purchaseId) => {
  try {
    await deleteDoc(doc(db, 'purchases', purchaseId));
  } catch (error) {
    console.error('Error deleting purchase:', error);
    throw error;
  }
};

// ==================== FEEDBACK ====================

export const addFeedback = async (feedbackData) => {
  try {
    const feedbackRef = await addDoc(collection(db, 'feedback'), {
      ...feedbackData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return feedbackRef.id;
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};

export const getFeedback = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'feedback'));
    const feedback = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in memory to avoid requiring Firestore index
    return feedback.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

export const getFeedbackByCustomer = async (customerId) => {
  try {
    const q = query(
      collection(db, 'feedback'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

export const updateFeedback = async (feedbackId, feedbackData) => {
  try {
    const docRef = doc(db, 'feedback', feedbackId);
    await updateDoc(docRef, {
      ...feedbackData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
};

export const deleteFeedback = async (feedbackId) => {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

// ==================== VEHICLE STOCK ====================

export const addVehicleStock = async (stockData) => {
  try {
    const stockRef = await addDoc(collection(db, 'vehicleStock'), {
      ...stockData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return stockRef.id;
  } catch (error) {
    console.error('Error adding vehicle stock:', error);
    throw error;
  }
};

export const getVehicleStock = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'vehicleStock'));
    const stocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt in memory
    return stocks.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching vehicle stock:', error);
    throw error;
  }
};

export const getVehicleStockByDate = async (date) => {
  try {
    const snapshot = await getDocs(collection(db, 'vehicleStock'));
    const allStocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter by date
    const filteredStocks = allStocks.filter(stock => stock.date === date);
    return filteredStocks.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching vehicle stock by date:', error);
    throw error;
  }
};

export const updateVehicleStock = async (stockId, stockData) => {
  try {
    const docRef = doc(db, 'vehicleStock', stockId);
    await updateDoc(docRef, {
      ...stockData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating vehicle stock:', error);
    throw error;
  }
};

export const deleteVehicleStock = async (stockId) => {
  try {
    await deleteDoc(doc(db, 'vehicleStock', stockId));
  } catch (error) {
    console.error('Error deleting vehicle stock:', error);
    throw error;
  }
};

// Get current vehicle stock summary (total loaded - total sold from vehicle)
export const getVehicleStockSummary = async () => {
  try {
    // Get all vehicle stock entries
    const stockSnapshot = await getDocs(collection(db, 'vehicleStock'));
    const stocks = stockSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get all orders from vehicle
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const vehicleOrders = ordersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(order => order.orderSource === 'vehicle');
    
    // Calculate totals loaded
    const totalLoaded = {
      qty1000ml: stocks.reduce((sum, s) => sum + (s.qty1000ml || 0), 0),
      qty500ml: stocks.reduce((sum, s) => sum + (s.qty500ml || 0), 0),
      qty200ml: stocks.reduce((sum, s) => sum + (s.qty200ml || 0), 0)
    };
    
    // Calculate totals sold from vehicle
    const totalSold = {
      qty1000ml: vehicleOrders.reduce((sum, o) => sum + (o.qty1000ml || 0), 0),
      qty500ml: vehicleOrders.reduce((sum, o) => sum + (o.qty500ml || 0), 0),
      qty200ml: vehicleOrders.reduce((sum, o) => sum + (o.qty200ml || 0), 0)
    };
    
    // Calculate remaining in vehicle
    const remaining = {
      qty1000ml: totalLoaded.qty1000ml - totalSold.qty1000ml,
      qty500ml: totalLoaded.qty500ml - totalSold.qty500ml,
      qty200ml: totalLoaded.qty200ml - totalSold.qty200ml
    };
    
    return { totalLoaded, totalSold, remaining };
  } catch (error) {
    console.error('Error calculating vehicle stock summary:', error);
    throw error;
  }
};

// Get godown stock summary (total purchased - total loaded to vehicle)
export const getGodownStockSummary = async () => {
  try {
    // Get all purchases
    const purchasesSnapshot = await getDocs(collection(db, 'purchases'));
    const purchases = purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get all vehicle stock entries (loaded from godown)
    const stockSnapshot = await getDocs(collection(db, 'vehicleStock'));
    const stocks = stockSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get all orders from godown
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const godownOrders = ordersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(order => order.orderSource === 'godown');
    
    // Calculate total purchased
    const totalPurchased = {
      qty1000ml: purchases.reduce((sum, p) => sum + (p.qty1000ml || 0), 0),
      qty500ml: purchases.reduce((sum, p) => sum + (p.qty500ml || 0), 0),
      qty200ml: purchases.reduce((sum, p) => sum + (p.qty200ml || 0), 0)
    };
    
    // Calculate total loaded to vehicle
    const totalLoadedToVehicle = {
      qty1000ml: stocks.reduce((sum, s) => sum + (s.qty1000ml || 0), 0),
      qty500ml: stocks.reduce((sum, s) => sum + (s.qty500ml || 0), 0),
      qty200ml: stocks.reduce((sum, s) => sum + (s.qty200ml || 0), 0)
    };
    
    // Calculate sold directly from godown
    const soldFromGodown = {
      qty1000ml: godownOrders.reduce((sum, o) => sum + (o.qty1000ml || 0), 0),
      qty500ml: godownOrders.reduce((sum, o) => sum + (o.qty500ml || 0), 0),
      qty200ml: godownOrders.reduce((sum, o) => sum + (o.qty200ml || 0), 0)
    };
    
    // Calculate remaining in godown
    const remaining = {
      qty1000ml: totalPurchased.qty1000ml - totalLoadedToVehicle.qty1000ml - soldFromGodown.qty1000ml,
      qty500ml: totalPurchased.qty500ml - totalLoadedToVehicle.qty500ml - soldFromGodown.qty500ml,
      qty200ml: totalPurchased.qty200ml - totalLoadedToVehicle.qty200ml - soldFromGodown.qty200ml
    };
    
    return { totalPurchased, totalLoadedToVehicle, soldFromGodown, remaining };
  } catch (error) {
    console.error('Error calculating godown stock summary:', error);
    throw error;
  }
};

// ==================== BATCH OPERATIONS ====================

export const seedDatabase = async (mockData) => {
  try {
    console.log('🔄 Seeding customers...');
    // Seed customers
    if (mockData.customers && mockData.customers.length > 0) {
      for (const customer of mockData.customers) {
        try {
          const customerData = { ...customer };
          delete customerData.id; // Remove id, let Firestore generate it
          
          console.log(`  Adding customer: ${customer.shopName}`);
          await addDoc(collection(db, 'customers'), {
            ...customerData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          console.log(`  ✓ Added: ${customer.shopName}`);
        } catch (err) {
          console.error(`  ✗ Failed to add customer ${customer.shopName}:`, err.message);
        }
      }
      console.log(`✅ Customers seeding completed`);
    }

    console.log('🔄 Seeding orders...');
    // Seed orders
    if (mockData.orders && mockData.orders.length > 0) {
      for (const order of mockData.orders) {
        try {
          console.log(`  Adding order: ${order.orderId}`);
          await addDoc(collection(db, 'orders'), {
            ...order,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          console.log(`  ✓ Added: ${order.orderId}`);
        } catch (err) {
          console.error(`  ✗ Failed to add order ${order.orderId}:`, err.message);
        }
      }
      console.log(`✅ Orders seeding completed`);
    }

    console.log('🔄 Seeding expenses...');
    // Seed expenses
    if (mockData.expenses && mockData.expenses.length > 0) {
      for (const expense of mockData.expenses) {
        try {
          console.log(`  Adding expense: ${expense.name}`);
          await addDoc(collection(db, 'expenses'), {
            ...expense,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          console.log(`  ✓ Added: ${expense.name}`);
        } catch (err) {
          console.error(`  ✗ Failed to add expense ${expense.name}:`, err.message);
        }
      }
      console.log(`✅ Expenses seeding completed`);
    }

    console.log('🔄 Seeding purchases...');
    // Seed purchases
    if (mockData.purchases && mockData.purchases.length > 0) {
      for (const purchase of mockData.purchases) {
        try {
          console.log(`  Adding purchase from: ${purchase.vendorName}`);
          await addDoc(collection(db, 'purchases'), {
            ...purchase,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          console.log(`  ✓ Added: ${purchase.vendorName}`);
        } catch (err) {
          console.error(`  ✗ Failed to add purchase from ${purchase.vendorName}:`, err.message);
        }
      }
      console.log(`✅ Purchases seeding completed`);
    }

    console.log('🔄 Seeding feedback...');
    // Seed feedback
    if (mockData.feedback && mockData.feedback.length > 0) {
      for (const feedback of mockData.feedback) {
        try {
          console.log(`  Adding feedback from: ${feedback.customerName}`);
          await addDoc(collection(db, 'feedback'), {
            ...feedback,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
          console.log(`  ✓ Added feedback from: ${feedback.customerName}`);
        } catch (err) {
          console.error(`  ✗ Failed to add feedback from ${feedback.customerName}:`, err.message);
        }
      }
      console.log(`✅ Feedback seeding completed`);
    }

    console.log('✅ Database seeded successfully with all collections!');
  } catch (error) {
    console.error('❌ Critical error seeding database:', error);
    throw error;
  }
};
