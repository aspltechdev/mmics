import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
          <p className="text-gray-700 mb-4">
            We'd love to hear from you. Please reach out to us for any inquiries.
          </p>
          <div className="space-y-3">
            <p><strong>📍 Address:</strong> Kadavanthara, Ernakulam, Kerala</p>
            <p><strong>📞 Phone:</strong> 0484 265 4871</p>
            <p><strong>✉️ Email:</strong> info@mmmicslimited.com</p>
          </div>
        </div>
        <div>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full border rounded-lg px-4 py-2" />
            <input type="email" placeholder="Your Email" className="w-full border rounded-lg px-4 py-2" />
            <textarea placeholder="Message" rows="4" className="w-full border rounded-lg px-4 py-2"></textarea>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;