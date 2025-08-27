import React from 'react';

const TransactionHistory = ({ transactions }) => {
  return (
    <div>
      <h2>Transaction History</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Type</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{new Date(transaction.timestamp).toLocaleString()}</td>
              <td>{transaction.type}</td>
              <td>{transaction.product_id}</td>
              <td>{transaction.quantity}</td>
              <td>{transaction.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
