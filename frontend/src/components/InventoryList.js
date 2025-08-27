import React, { useState } from 'react';
import { updateStock } from '../services/api';

const InventoryList = ({ inventory, onUpdate }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  const handleStockUpdate = async (productId, change) => {
    setUpdatingId(productId);
    setMessage('');
    try {
      await updateStock(productId, change);
      setMessage('Stock updated successfully!');
      onUpdate();
    } catch (error) {
      setMessage('Error updating stock: ' + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2>Inventory List</h2>
      {message && (
        <div className={message.includes('Error') ? 'alert-error' : 'alert-success'}>
          {message}
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.category}</td>
              <td>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStockUpdate(product.id, 1)}
                  disabled={updatingId === product.id}
                >
                  {updatingId === product.id ? '...' : '+1'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleStockUpdate(product.id, -1)}
                  disabled={updatingId === product.id || product.quantity <= 0}
                >
                  {updatingId === product.id ? '...' : '-1'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
