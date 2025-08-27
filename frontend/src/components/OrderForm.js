import React, { useState } from 'react';
import { placeOrder, processOrders } from '../services/api';

const OrderForm = ({ onOrder }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    customerName: '',
    priority: '1'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await placeOrder(
        parseInt(formData.productId),
        parseInt(formData.quantity),
        formData.customerName,
        parseInt(formData.priority)
      );
      setMessage('Order placed successfully!');
      setFormData({ productId: '', quantity: '', customerName: '', priority: '1' });
      onOrder();
    } catch (error) {
      setMessage('Error placing order: ' + error.message);
    }
  };

  const handleProcessOrders = async () => {
    setMessage('');
    try {
      const result = await processOrders(5);
      setMessage(`Processed ${result.processed_orders.length} orders`);
      onOrder();
    } catch (error) {
      setMessage('Error processing orders: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Place New Order</h2>
      {message && (
        <div className={message.includes('Error') ? 'alert-error' : 'alert-success'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product ID:</label>
          <input
            type="number"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority:</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Place Order</button>
        <button type="button" className="btn btn-secondary" onClick={handleProcessOrders}>
          Process Orders
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
