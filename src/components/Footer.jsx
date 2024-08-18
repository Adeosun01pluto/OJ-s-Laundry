import React from 'react';
import { MdCleaningServices } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/90 text-white p-8">
      <Link to="/" className="pb-4 text-2xl md:text-3xl font-bold flex items-center">
        <MdCleaningServices className="mr-2" />
        OJ's Clean
      </Link>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Subscribe Section */}
        <div className="flex flex-col md:items-center">
          <h2 className="text-lg font-bold mb-4">Subscribe Now</h2>
          <p className="mb-4">There are many variations of passages of Lorem Ipsum available.</p>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="p-2 mb-4 text-black w-full border-none outline-none"
          />
          <button className="w-full bg-[#275C9E] hover:bg-[#fff] transition-all text-white hover:text-[#275C9E] duration-300 p-2">Subscribe</button>
        </div>

        {/* Information Section */}
        <div className="flex flex-col md:items-center">
          <h2 className="text-lg font-bold mb-4">Information</h2>
          <p>There are many variations of passages of Lorem Ipsum available, but the majority.</p>
        </div>

        {/* Helpful Links Section */}
        <div className="flex flex-col md:items-center">
          <h2 className="text-lg font-bold mb-4 text-white">Helpful Links</h2>
          <p>There are many variations of passages of Lorem Ipsum available, but the majority.</p>
        </div>

        {/* Investments Section */}
        <div className="flex flex-col md:items-center">
          <h2 className="text-lg font-bold mb-4">Investments</h2>
          <p>There are many variations of passages of Lorem Ipsum available, but the majority.</p>
        </div>
        {/* Contact Us Section */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-2">Contact Us</h2>
          <p>Location</p>
          <p>(+71) 8522369417</p>
          <p>demo@gmail.com</p>
        </div>
      </div>

      <div className="container mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">

        {/* Footer Bottom Text */}
        <div className="flex w-full justify-center">
          <p>&copy; {new Date().getFullYear()} FleetTrackr. All Rights Reserved. Design by Free Html Templates. Distributed by ThemeWagon.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;