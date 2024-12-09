import React, { useState, useEffect } from 'react';
import './styles/chart.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export function Chart() {
  const [data, setData] = useState([]);
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDay = daysOfWeek[new Date().getDay()]; // Get the current day (e.g., 'mon')

  // Fetch the balance data from backend API when the component mounts
  useEffect(() => {
    // Fetch data from backend API endpoint
    fetch(`${apiBaseUrl}/api/balances`)
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);  // Set the fetched data into the state
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
      });
  }, []);

  // Handle updating the balance for a specific day
  const handleBarClick = (day) => {
    const newAmount = prompt(`Enter new spending for ${day}:`);

    if (newAmount !== null && !isNaN(newAmount) && Number(newAmount) >= 0) {
      // Send the updated value to the backend API
      fetch(`${apiBaseUrl}/api/balances/${day}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(newAmount) }),
      })
        .then((response) => response.json())
        .then((updatedData) => {
          // Update the local state with the new data
          setData(updatedData);
        })
        .catch((error) => {
          console.error('Error updating the balance:', error);
        });
    } else {
      alert('Please enter a valid positive number for the spending.');
    }
  };

  // Find the maximum amount to normalize bar heights
  const maxAmount = Math.max(...data.map(d => d.amount)) || 1; // Default to 1 to avoid division by 0

  return (
    <div className="expenses-chart">
      <h2>Spending - Last 7 days</h2>
      <div className="chart">
        {data.map((item, index) => (
          <div
            key={index}
            className={`bar ${item.day === currentDay ? 'highlight' : ''}`} // Highlight the current day's bar
            style={{
              height: `${(item.amount / maxAmount) * 100}%`, // Normalize height based on max amount
              minHeight: '20px', // Ensure the bar is visible even when amount is 0
            }}
            onClick={() => handleBarClick(item.day)}  // Handle click event
          >
            <span className="expense-value">{`$${item.amount.toFixed(2)}`}</span> {/* Display amount inside bar */}
          </div>
        ))}
      </div>
      <div className="labels">
        {data.map((item, index) => (
          <div key={index} className="day-label">
            {item.day.charAt(0).toUpperCase() + item.day.slice(1)} 
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chart;

