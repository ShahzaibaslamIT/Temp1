"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import Link from "next/link";
import Image from "next/image";

const sanity = createClient({
  projectId: "x40to373",
  dataset: "production",
  apiVersion: "v2025-01-24",
  useCdn: true,
});

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  discountPercentage: number;
  imageUrl: string;
  tags: string[];
}

const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  // Fetch products from Sanity
  const fetchProducts = async () => {
    try {
      const query = `
        *[_type == "products"]{
          _id,
          title,
          price,
          description,
          discountPercentage,
          "imageUrl": image.asset->url,
          tags
        }
      `;
      const data = await sanity.fetch(query);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  // Add product to the cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.title} has been added to your cart`);
  };

  // Remove product from the cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    alert(`Product has been removed from your cart`);
  };

  // Calculate total price and discounted total
  const calculateCartSummary = () => {
    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
    const discountedTotal = cart.reduce(
      (sum, product) =>
        sum + product.price * ((100 - product.discountPercentage) / 100),
      0
    );
    return { totalPrice, discountedTotal };
  };

  // Truncate long descriptions
  const truncateDescription = (description: string) => {
    return description.length > 100
      ? description.substring(0, 100) + "..."
      : description;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const { totalPrice, discountedTotal } = calculateCartSummary();

  return (
    <div className="p-4">
      <h2 className="text-center text-slate-800 mt-4 mb-4">
        Products from API
      </h2>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
      

<Link href={`/products/${product._id}`}>
  {product.imageUrl ? (
    <Image
      src={product.imageUrl}
      alt={product.title}
      width={300}
      height={300}
      className="w-full h-48 object-cover rounded-md"
    />
  ) : (
    <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
      <p>No Image</p>
    </div>
  )}
  <div className="mt-4">
    <h2 className="text-lg font-semibold">{product.title}</h2>
    <p className="text-slate-800 mt-2 text-sm">
      {truncateDescription(product.description)}
    </p>
    <p className="text-slate-600 font-bold mt-2">
      ${product.price}
    </p>
  </div>
</Link>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 bg-slate-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-slate-800">Cart Summary</h2>
        {cart.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center bg-white shadow-sm p-4 rounded-md"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <button
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-slate-800">
                <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
              </p>
              <p className="text-green-600">
                <strong>Discounted Total:</strong> ${discountedTotal.toFixed(2)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-600">
            Your cart is empty. Please add some products.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCards;

