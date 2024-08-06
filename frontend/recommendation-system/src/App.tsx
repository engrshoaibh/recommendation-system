// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './screens/Register'
import SignIn from './screens/SignIn'
import Preferences from './screens/Preferences'
import Dashboard from './screens/Dashboard'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/preferences/:userId" element={<Preferences/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;
