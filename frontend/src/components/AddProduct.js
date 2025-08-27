import React, { useState } from 'react';
import { addProduct } from '../services/api';

const AddProduct = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: ''
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
      await addProduct(
        formData.name,
        parseFloat(formData.price),
        parseInt(formData.quantity),
        formData.category
      );
      setMessage('Product added successfully!');
      setFormData({ name: '', price: '', quantity: '', category: '' });
      onAdd();
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {message && (
        <div className={message.includes('Error') ? 'alert-error' : 'alert-success'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
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
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
