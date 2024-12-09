import React from 'react';
import Chart from './Chart';  // Assuming you have a chart component for rendering the chart

const Spending = ({ balances }) => {
  const totalBalance = balances.reduce((acc, balance) => acc + balance.amount, 0).toFixed(2);

  return (
    <div className="white-box">
      <Chart balances={balances} /> {/* Render the chart here */}
      <div className="total-balance">
        <p>Total Spending: ${totalBalance}</p>
      </div>
    </div>
  );
};

export default Spending;
