import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/signup';
import OpenPosition from './pages/Home/OpenPostition';

// PrivateRoute component to restrict access to protected pages
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is authenticated (token stored in localStorage)

  if (!isAuthenticated) {
    // If not authenticated, show an alert and redirect to login page
    alert('You need to log in to access this page.');
    return <Navigate to="/login" />;
  }

  // If authenticated, allow access to the route
  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Home />} />}
        />
        <Route
          path="/openpostition"
          element={<PrivateRoute element={<OpenPosition />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
