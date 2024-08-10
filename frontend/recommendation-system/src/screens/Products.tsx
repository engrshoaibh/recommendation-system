import { useEffect, useState } from "react";
import { getProducts } from "./api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function Products() {
  const productVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.1,    // Percentage of the component in view to start animation
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await getProducts();
        console.log(allProducts);
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    console.log("Clicked product:", product);
    navigate(`/product/${product.product_id}`, { state: { product } });
  };

  return (
    <motion.div
      ref={ref}
      className="mt-8"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={productVariants}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            All Products
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 bg-gray-100 py-16 px-16">
            {products.map((product) => (
              <motion.div
                key={product.product_id}
                className="group relative cursor-pointer"
                onClick={() => handleProductClick(product)}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={productVariants}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    alt={product.description}
                    src={product.image_url}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
