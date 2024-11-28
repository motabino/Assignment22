// src/components/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductManagement.css';

const ProductManagement = ({ setProducts }) => {
  const [products, setLocalProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }
      const data = await response.json();
      setLocalProducts(data);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error fetching products: ' + err.message);
    }
  };

  // Handle input changes for the new product form
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Function to add or update a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update product');
        }
      } else {
        // Add new product
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add product');
        }
      }

      // Refresh the product list after adding/updating
      await fetchProducts();
      // Reset the form
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
      setEditingProduct(null);
      setError('');
    } catch (err) {
      console.error('Error adding/updating product:', err);
      setError('Error adding/updating product: ' + err.message);
    }
  };

  // Function to initiate editing a product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    setError('');
  };

  // Function to sell a product (decrement quantity by 1)
  const handleSellProduct = async (id) => {
    const product = products.find((p) => p.id === id);
    if (product && product.quantity > 0) {
      const updatedQuantity = product.quantity - 1;
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...product, quantity: updatedQuantity }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to sell product');
        }

        // Refresh the product list after selling
        await fetchProducts();
        setError('');
      } catch (err) {
        console.error('Error selling product:', err);
        setError('Error selling product: ' + err.message);
      }
    } else {
      setError('Product is out of stock');
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      // Refresh the product list after deletion
      await fetchProducts();
      setError('');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error deleting product: ' + err.message);
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="product-management">
      <header className="header">
        <h2>Product Management</h2>
        <nav className="navigation">
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/users">User Management</Link></li>
          </ul>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </header>

      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddProduct} className="product-form">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="input-field"
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="input-field"
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Price"
          step="0.01"
          required
          className="input-field"
        />
        <input
          type="number"
          name="quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <h3>Product List</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price ($)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="table-row">
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{parseFloat(product.price).toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => handleEditProduct(product)} className="action-button edit-button">Edit</button>
                <button onClick={() => handleSellProduct(product.id)} className="action-button sell-button">Sell</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="action-button delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
