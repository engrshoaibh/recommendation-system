import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  thumbnails: string[];
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const product = location.state?.product as Product;

  const thumbnails = product?.thumbnails || [];

  const [isExpanded, setIsExpanded] = useState({
    features: false,
    care: false,
    shipping: false,
    returns: false,
  });

  const toggleSection = (section: keyof typeof isExpanded) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (!product) {
    return <div>Product data is missing!</div>;
  }

  return (
    <>
      <Navbar />
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side - Image Section */}
        <div className="relative w-full lg:w-1/2">
          <img
            className="w-full h-80 object-cover"
            src={product.image_url}
            alt={product.name}
          />
          <div className="absolute bottom-0 left-0 flex items-center p-4 space-x-2 mt-4">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                className="w-12 h-12 rounded-lg border border-gray-300"
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Content Section */}
        <div className="p-6 w-full lg:w-1/2">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <div className="flex items-center mt-4">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          <p className="mt-4 text-gray-600">{product.description}</p>

          {/* Color Options */}
          <div className="mt-6">
            <label className="text-gray-600">Color:</label>
            <div className="flex items-center space-x-3 mt-2">
              <span className="w-6 h-6 rounded-full bg-gray-800 cursor-pointer border-2 border-gray-200"></span>
              <span className="w-6 h-6 rounded-full bg-gray-600 cursor-pointer border-2 border-gray-200"></span>
              <span className="w-6 h-6 rounded-full bg-gray-300 cursor-pointer border-2 border-gray-200"></span>
            </div>
          </div>

          {/* Add to Bag Button */}
          <div className="mt-8">
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">
              Add to bag
            </button>
          </div>

          {/* Expandable Sections */}
          <div className="mt-8 space-y-2">
            <div
              className="cursor-pointer text-blue-600 flex justify-between items-center"
              onClick={() => toggleSection('features')}
            >
              <span>Features</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isExpanded.features ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </div>
            {isExpanded.features && (
              <motion.div
                className="text-gray-600 mt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="list-disc list-inside">
                  <li>Convertible straps</li>
                  <li>Durable canvas construction</li>
                  <li>Spacious interior</li>
                </ul>
              </motion.div>
            )}

            <div
              className="cursor-pointer text-blue-600 flex justify-between items-center"
              onClick={() => toggleSection('care')}
            >
              <span>Care</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isExpanded.care ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </div>
            {isExpanded.care && (
              <motion.div
                className="text-gray-600 mt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>Spot clean with a damp cloth. Do not machine wash.</p>
              </motion.div>
            )}

            <div
              className="cursor-pointer text-blue-600 flex justify-between items-center"
              onClick={() => toggleSection('shipping')}
            >
              <span>Shipping</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isExpanded.shipping ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </div>
            {isExpanded.shipping && (
              <motion.div
                className="text-gray-600 mt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>Ships within 2-3 business days.</p>
              </motion.div>
            )}

            <div
              className="cursor-pointer text-blue-600 flex justify-between items-center"
              onClick={() => toggleSection('returns')}
            >
              <span>Returns</span>
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isExpanded.returns ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            </div>
            {isExpanded.returns && (
              <motion.div
                className="text-gray-600 mt-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>30-day return policy with no questions asked.</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
