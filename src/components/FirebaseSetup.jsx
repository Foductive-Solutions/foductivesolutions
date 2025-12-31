import { useState } from 'react';
import { initializeDatabase } from '../firebase/seed';

export default function FirebaseSetup() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedDatabase = async () => {
    try {
      setIsSeeding(true);
      setMessage('Seeding database...');
      
      await initializeDatabase();
      
      setMessage('✅ Database seeded successfully! You can now remove this component.');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      backgroundColor: '#f0f8f0',
      textAlign: 'center'
    }}>
      <h2>Firebase Setup</h2>
      <p>Click the button below to seed your Firestore database with mock data.</p>
      <button
        onClick={handleSeedDatabase}
        disabled={isSeeding}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSeeding ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {isSeeding ? 'Seeding...' : 'Seed Database'}
      </button>
      {message && <p style={{ marginTop: '10px', fontSize: '14px' }}>{message}</p>}
    </div>
  );
}
