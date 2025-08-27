import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import InventoryList from './components/InventoryList';
import AddProduct from './components/AddProduct';
import OrderForm from './components/OrderForm';
import TransactionHistory from './components/TransactionHistory';
import { getInventory, getStatus, getTransactions } from './services/api';

function App() {
  const [inventory, setInventory] = useState([]);
  const [status, setStatus] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invData, statusData, transData] = await Promise.all([
        getInventory(),
        getStatus(),
        getTransactions(10)
      ]);
      setInventory(invData);
      setStatus(statusData);
      setTransactions(transData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryList inventory={inventory} onUpdate={fetchData} />;
      case 'add-product':
        return <AddProduct onAdd={fetchData} />;
      case 'place-order':
        return <OrderForm onOrder={fetchData} />;
      case 'transactions':
        return <TransactionHistory transactions={transactions} />;
      default:
        return <InventoryList inventory={inventory} onUpdate={fetchData} />;
    }
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <div className="tabs">
          <button 
            className={activeTab === 'inventory' ? 'active' : ''}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button 
            className={activeTab === 'add-product' ? 'active' : ''}
            onClick={() => setActiveTab('add-product')}
          >
            Add Product
          </button>
          <button 
            className={activeTab === 'place-order' ? 'active' : ''}
            onClick={() => setActiveTab('place-order')}
          >
            Place Order
          </button>
          <button 
            className={activeTab === 'transactions' ? 'active' : ''}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        <div className="status-bar">
          <span>Products: {status.total_products}</span>
          <span>Pending Orders: {status.pending_orders}</span>
          <span>Backorders: {status.backorders}</span>
          <span>Ready for Delivery: {status.items_ready_for_delivery}</span>
        </div>

        <div className="content">
          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
