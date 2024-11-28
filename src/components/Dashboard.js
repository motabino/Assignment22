// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductBarChart from './ProductBarChart';
import './Dashboard.css';

const Dashboard = ({ products }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images
  const images = [
    { src: 'apple.jpeg', alt: 'Product 1', className: 'slide-in' },
    { src: 'OIP.jpeg', alt: 'Product 2', className: 'fade-in' },
    { src: 'strawberries.jpeg', alt: 'Strawberries', className: 'bounce-in' },
    { src: 'grapes.jpeg', alt: 'Grapes', className: 'rotate-in' },
    { src: 'pears.jpeg', alt: 'Pears', className: 'zoom-in' },
    { src: 'coke.jpeg', alt: 'Coke', className: 'slide-in' },
    { src: 'cake.jpeg', alt: 'Cake', className: 'fade-in' }
  ];

  // Cycle through images one at a time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? 'N/A' : numericPrice.toFixed(2);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2 id="dashboard-title">Dashboard</h2>
          <nav className="dashboard-nav">
            <Link to="/products" className="nav-link">Product Management</Link>
            <Link to="/users" className="nav-link">User Management</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </nav>
        </header>

        <section className="dashboard-main">
          <h3 id="products-overview-title">Products Overview</h3>

          {products.length === 0 ? (
            <p id="no-products-message">No products have been added yet.</p>
          ) : (
            <div className="dashboard-data">
              <div className="chart-container">
                <ProductBarChart products={products} />
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Display one image at a time */}
          <div className="image-container">
            <h2>Featured Products</h2>
            <img
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className={`dashboard-image ${images[currentImageIndex].className}`}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
