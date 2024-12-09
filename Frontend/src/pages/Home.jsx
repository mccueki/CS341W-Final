import React, { useState, useEffect } from 'react';
import BalanceBox from './BalanceBox';
import Spending from './Spending';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
    const [balances, setBalances] = useState([]);  // store balances
    const [loading, setLoading] = useState(true);  //loading status
    const [error, setError] = useState(null);  // errors
  
    // Fetch balances when the component mounts
    useEffect(() => {
      const fetchBalances = async () => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/balances`);
          if (!response.ok) {
            throw new Error('Error fetching balances');
          }
          const data = await response.json();
          setBalances(data);  // Store fetched balances in state
        } catch (error) {
          setError(error.message);  // Handle any errors
        } finally {
          setLoading(false);  
        }
      };
  
      fetchBalances();
    }, []);  
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }

  return (
    <div className="dashboard">
      <BalanceBox />
      <Spending balances={balances} /> {/* Pass balances to Spending component */}
    </div>
  );
};

export default Home;
