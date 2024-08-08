import { useEffect, useState } from 'react';
import { getRecommendedProducts } from '../screens/api'; // Adjust import based on your file structure
interface Product {
  id: number; // product_id
  name: string; // name
  description: string; // description
  price: number; // price
  image_url: string; // image_url
}
interface RecommendProductsProps {
  userId: number; // User ID to fetch recommendations for
}

export default function RecommendProducts({userId}:RecommendProductsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchRecommendedProducts() {
      try {
        const products = await getRecommendedProducts(userId); 
        setRecommendedProducts(products);
      } catch (error) {
        console.error('Failed to fetch recommended products', error);
      }
    }

    fetchRecommendedProducts();
  }, [userId]);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Recommended Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 bg-gray-100 py-16 px-16">
          {recommendedProducts.map((product) => (
             <div key={product.id} className="group relative">
               <div className="aspect-h-3 aspect-w-4 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                 <img
                   alt={product.description}
                   src={product.image_url}
                   className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                 />
               </div>
               <div className="mt-4 flex justify-between">
                 <div>
                   <h3 className="text-sm text-gray-700">
                     <a href={`/product/${product.id}`}>
                       <span aria-hidden="true" className="absolute inset-0" />
                       {product.name}
                     </a>
                   </h3>
                   <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                 </div>
                 <p className="text-sm font-medium text-gray-900">
                   ${product.price}
                 </p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
