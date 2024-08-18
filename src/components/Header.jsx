import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaBars, FaTimes, FaHome, FaInfoCircle, FaBlog, FaCalendarAlt } from 'react-icons/fa';
import { MdCleaningServices } from 'react-icons/md';
import { auth } from '../firebase'; // Make sure this points to your Firebase config

// 275C9E

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      // Optionally redirect to the homepage or login page
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="relative shadow-md md:p-0 px-4 bg-white ">
      <div className="container text-white py-4 md:py-6 bg-transparent mx-auto flex justify-between md:items-center">
        {/* Logo Section */}
        <Link to="/" className="text-[#275C9E] text-2xl md:text-3xl font-bold flex items-center">
          <MdCleaningServices className="mr-2" />
          OJ's Clean
        </Link>

        {/* Navigation Menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-[#275C9E] text-2xl focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <nav className="hidden md:flex md:space-x-4 lg:space-x-8 text-sm items-center text-black font-semibold">
          <Link to="/" className="hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaHome className="mr-1" /> Home
          </Link>
          <Link to="/about" className="hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaInfoCircle className="mr-1" /> About Us
          </Link>
          <Link to="/blog" className="hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaBlog className="mr-1" /> Blogs
          </Link>
          <Link to="/schedule" className="hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaCalendarAlt className="mr-1" /> Schedule
          </Link>
          <Link to="/dashboard" className="hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaUserAlt className="mr-1" /> Admin
          </Link>
        </nav>

        {/* Login/Logout Section */}
        <div className="hidden md:flex space-x-2 md:space-x-4 items-center text-[#275C9E] font-semibold text-sm">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-white rounded-full py-2 px-4 bg-[#275C9E] hover:text-white transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-black transition-colors duration-300">Login</Link>
              <Link to="/signup" className="text-white rounded-full py-2 px-4 bg-[#275C9E] hover:text-white transition-colors duration-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className={`md:hidden bg-[#275C9E] z-10 transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'
        } text-white absolute right-0 top-full w-full flex flex-col items-center space-y-4 py-4 shadow-lg`}>
          <Link to="/" onClick={toggleMenu} className="w-[30%] hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaHome className="mr-1" /> Home
          </Link>
          <Link to="/about" onClick={toggleMenu} className="w-[30%] hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaInfoCircle className="mr-1" /> About Us
          </Link>
          <Link to="/blog" onClick={toggleMenu} className="w-[30%] hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaBlog className="mr-1" /> Blogs
          </Link>
          <Link to="/schedule" onClick={toggleMenu} className="w-[30%] hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaCalendarAlt className="mr-1" /> Schedule
          </Link>
          <Link to="/dashboard" onClick={toggleMenu} className="w-[30%] hover:text-[#275C9E] transition-colors duration-300 flex items-center">
            <FaUserAlt className="mr-1" /> Admin
          </Link>
          {/* Mobile Login/Logout */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-[30%] text-center rounded-xl font-semibold py-[3px] hover:text-[#275C9E] text-[#fff] transition-colors duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu} className="w-[30%] text-center rounded-xl font-semibold py-[3px] hover:text-[#275C9E] text-[#fff] transition-colors duration-300">Login</Link>
              <Link to="/signup" onClick={toggleMenu} className="w-[30%] bg-white hover:text-[#275C9E] text-center rounded-xl font-semibold py-[3px] text-sm text-[#275C9E] transition-colors duration-300">Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
