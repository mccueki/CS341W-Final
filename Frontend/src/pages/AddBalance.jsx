import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const BankBalance = () => {
  const [inputBalance, setInputBalance] = useState('');
  const [bankBalance, setBankBalance] = useState(null);
  const navigate = useNavigate();

  // Fetch the current bank balance
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputBalance !== '') {
      const amount = parseFloat(inputBalance);

      // Call backend to update bank balance
      try {
        const response = await fetch(`${apiBaseUrl}/api/update-bank-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        if (response.ok) {
          setBankBalance(amount);  // Update state on success
          navigate('/');  // Redirect after successful update
        } else {
          alert(data.error || 'Failed to update bank balance');
        }
      } catch (error) {
        alert('Error updating bank balance: ' + error.message);
      }
    }
  };

  return (
    <div className="bank-balance-page">
      <h2>Bank Balance</h2>
      <p>Current Bank Balance: ${bankBalance}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter new bank balance"
          value={inputBalance}
          onChange={(e) => setInputBalance(e.target.value)}  //changes bank balance
        />
        <button type="submit">Save Bank Balance</button>
      </form>
    </div>
  );
};

export default BankBalance;
