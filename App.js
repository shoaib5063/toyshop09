import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ToyDetails from './pages/ToyDetails';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <ProtectedRoute>
          <Route path="/profile" component={Profile} />
          <Route path="/toy/:id" component={ToyDetails} />
        </ProtectedRoute>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
