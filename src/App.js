// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupAndLogin from './components/SignupAndLogin';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import { useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]); // Lifted product state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupAndLogin isLogin={false} />} />
        <Route path="/signup" element={<SignupAndLogin isLogin={false} />} />
        <Route path="/login" element={<SignupAndLogin isLogin={true} />} />
        <Route path="/dashboard" element={<Dashboard products={products} />} />
        <Route path="/products" element={<ProductManagement setProducts={setProducts} />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;