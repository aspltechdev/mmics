import React from 'react';

const Home = () => {
  return (
    <div>
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">MMMICS Limited</h1>
          <p className="text-xl mb-8">Packaging Solutions for MSMEs, Cooperatives & Businesses</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Explore Products
            </button>
            <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              Request a Quote
            </button>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of packaging solutions including Eco Friendly Bags, 
            Corrugated Boxes, Paper Cups, and more.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;