import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home_';
import Dashboard from './pages/Dashboard/Dashboard_';
import About from './pages/About/About_';
import Contact from './components/Contact';
import Thecars from './components/Thecars';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Blog from './pages/Blog/Blog_';
import BlogPost from './components/BlogPost';
import ScheduleAppointment from './pages/Schedule/ScheduleAppointment ';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute

function App() {

  return (
    <Router>
      <div>
        <Header />
        <main className='bg-white'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/vehicles" element={<Thecars />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <PrivateRoute>
                  <Blog />
                </PrivateRoute>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <PrivateRoute>
                  <BlogPost />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute>
                  <ScheduleAppointment />
                </PrivateRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
