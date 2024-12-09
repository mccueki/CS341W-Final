import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './styles/BalanceBox.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const BalanceBox = () => {
  const [bankBalance, setBankBalance] = useState(null);

  // Fetches bank balance
  useEffect(() => {
    const fetchBankBalance = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/get-bank-balance`);
        const data = await response.json();
        if (response.ok) {
          setBankBalance(data.bankBalance);
        } else {
          alert('Failed to load bank balance');
        }
      } catch (error) {
        alert('Error fetching bank balance');
      }
    };

    fetchBankBalance();
  }, []);

  return (
    <div className="box top-box">
      <Link to="/add-balance">  
        <div className="clickable-box">
          <div className="graphic-box">
            <span>My Bank Balance: ${bankBalance}</span> 
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BalanceBox;

