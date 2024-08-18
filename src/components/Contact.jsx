import React from 'react';
import { FiMapPin } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";


const ContactInfo = ({ icon, title, content }) => (
  <div className="flex items-start mb-3 sm:mb-6 py-1">
    <div className="mr-4">{icon}</div>
    <div>
      <h3 className="text-md sm:text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm sm:text-mdtext-gray-600">{content}</p>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl text-[#275C9E] mb-6 font-bold text-center sm:mb-12">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Get in Touch</h2>
              <ContactInfo
                icon={<FiMapPin size={20} className="text-[#275C9E]" />}
                title="Address"
                content="123 Vehicle St, Automotive City, AC 12345"
              />
              <ContactInfo
                icon={<FaPhoneAlt size={20} className="text-[#275C9E]" />}
                title="Phone"
                content="+1 (555) 123-4567"
              />
              <ContactInfo
                icon={<CiMail size={20} className="text-[#275C9E]" />}
                title="Email"
                content="info@yourcompany.com"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Send Us a Message</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm sm:text-md mb-2">Name</label>
                  <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#275C9E]" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm sm:text-md mb-2">Email</label>
                  <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#275C9E]" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 text-sm sm:text-md mb-2">Message</label>
                  <textarea id="message" name="message" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#275C9E]" required></textarea>
                </div>
                <button type="submit" className="text-sm sm:text-md bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;