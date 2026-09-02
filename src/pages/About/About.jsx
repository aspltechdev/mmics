import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About MMMICS Limited</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-6">
          MMMICS Limited is a cooperative organization focused on providing 
          quality packaging solutions for MSMEs, cooperatives, and businesses.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          We are committed to delivering sustainable and innovative packaging 
          solutions that help our clients grow their businesses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Our Vision</h3>
            <p className="text-gray-700">To be the leading packaging solutions provider for MSMEs in India.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-2">Our Mission</h3>
            <p className="text-gray-700">To deliver quality, sustainable, and affordable packaging solutions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;