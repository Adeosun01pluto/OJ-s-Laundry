import React from 'react';

const About_ = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-12 text-[#275C9E]">About Us</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-md sm:text-lg text-gray-700 mb-6">
            At OJ's Clean, we're dedicated to providing exceptional laundry services that simplify your life. Our journey started with a passion for delivering convenience and quality to our community.
          </p>
          <p className="text-md sm:text-lg text-gray-700 mb-6">
            We pride ourselves on offering a full range of laundry solutions tailored to meet your needs. From everyday laundry to specialized garment care, our experienced team handles it all with precision and care.
          </p>
          <p className="text-md sm:text-lg text-gray-700 mb-6">
            Our commitment to quality, sustainability, and customer satisfaction sets us apart. We use eco-friendly practices and state-of-the-art equipment to ensure your clothes are cleaned to the highest standards while minimizing our environmental footprint.
          </p>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li className="mb-2">Excellence in laundry care</li>
              <li className="mb-2">Commitment to sustainability</li>
              <li className="mb-2">Innovative solutions</li>
              <li className="mb-2">Customer-first approach</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 sm:mt-12 text-center">
          <button className="bg-[#275C9E] text-white px-4 py-2 sm:py-3 sm:px-8 rounded-full text-md md:text-lg font-semibold hover:bg-[#e63946]/90 transition-colors">
            Learn More About Our Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default About_;
