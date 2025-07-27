// client/src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddOD from './pages/AddOD';
import Demo from './pages/Demo';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ODList from './pages/ODList';
import PlacementTracker from './pages/PlacementTracker';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/od-list" element={token ? <ODList /> : <Navigate to="/login" />} />
        <Route path="/placement-tracker" element={token ? <PlacementTracker /> : <Navigate to="/login" />} />
        <Route path="/add-od" element={token ? <AddOD /> : <Navigate to="/login" />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
