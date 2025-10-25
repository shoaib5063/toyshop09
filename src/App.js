import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ToyDetails from './pages/ToyDetails';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const App = ({ user }) => {
  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/toy/:id" element={<ToyDetails />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
