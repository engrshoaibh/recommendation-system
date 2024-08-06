// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './screens/Register'
import SignIn from './screens/SignIn'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/signin" element={<SignIn/>} />
      </Routes>
    </Router>
  );
};

export default App;
