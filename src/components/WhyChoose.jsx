import React from 'react';
import { FaTshirt } from "react-icons/fa"; 
import { FaClock } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';


const ReasonCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
    {icon}
    <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const WhyChoose = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const handleClick = () => {
    if (user) {
      navigate('/schedule'); // Route to schedule if logged in
    } else {
      navigate('/login'); // Route to login if not logged in
    }
  };

  const reasons = [
    {
      icon: <FaTshirt size={48} className="text-[#275C9E]" />,
      title: "Exceptional Quality",
      description: "We deliver pristine laundry services, ensuring your clothes are fresh and spotless every time."
    },
    {
      icon: <FaClock size={48} className="text-[#275C9E]" />,
      title: "Fast Turnaround",
      description: "Our efficient processes mean you get your laundry back faster, without compromising on quality."
    },
    {
      icon: <FaLeaf size={48} className="text-[#275C9E]" />,
      title: "Eco-Friendly Practices",
      description: "Committed to sustainability, we use eco-friendly products that are gentle on your clothes and the environment."
    },
    {
      icon: <FaHandsHelping size={48} className="text-[#275C9E]" />,
      title: "Customer Focused",
      description: "We prioritize your satisfaction, offering personalized services to meet all your laundry needs."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl text-[#275C9E] mb-6 font-bold text-center sm:mb-12">Why Choose Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <ReasonCard key={index} {...reason} />
          ))}
        </div>
        <div className="mt-8 sm:mt-16 text-center">
          <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-8">
            Experience the difference with our premier laundry services.
          </p>
          <button
            onClick={handleClick}
            className="bg-[#275C9E] text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full text-md md:text-lg font-semibold hover:bg-[#275C9E]/90 transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
