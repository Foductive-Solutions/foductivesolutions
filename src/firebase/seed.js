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
    console.log('🔄 Starting database seeding...');
    
    await seedDatabase({
      customers: mockCustomers,
      orders: mockOrders,
      expenses: mockExpenses,
      purchases: mockPurchases,
      feedback: mockFeedback
    });
    
    console.log('✅ Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
