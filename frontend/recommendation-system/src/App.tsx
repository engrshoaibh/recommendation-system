import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './screens/Register';
import SignIn from './screens/SignIn';
import Preferences from './screens/Preferences';
import Home from './screens/Home';
import ProductPage from './screens/ProductPage';
import AuthRoute from './components/AuthRoute'; // Import the AuthRoute component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect authenticated users from register and signin pages */}
        <Route path="/register" element={<AuthRoute element={<Register />} requiresAuth={false} />} />
        <Route path="/signin" element={<AuthRoute element={<SignIn />} requiresAuth={false} />} />

        {/* Private routes */}
        <Route path="/preferences/:userId" element={<AuthRoute element={<Preferences />} requiresAuth={true} />} />
        <Route path="/home" element={<AuthRoute element={<Home />} requiresAuth={true} />} />
        <Route path="/product/:id" element={<AuthRoute element={<ProductPage />} requiresAuth={true} />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
