"use client"; // Indicates client-side rendering
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use `useParams` to access route parameters
import { createClient } from "@sanity/client";
import Image from "next/image";

const sanity = createClient({
  projectId: "x40to373", // Replace with your actual project ID
  dataset: "production",
  apiVersion: "v2025-01-24",
  useCdn: true,
});

const ProductDetails: React.FC = () => {
  const { id } = useParams(); // Get the dynamic product ID from the route
  const [product, setProduct] = useState<any>(null);

  // Fetch the product details using the dynamic ID
  const fetchProduct = async () => {
    if (!id) return; // Ensure the ID exists before fetching
    try {
      const query = `
        *[_type == "products" && _id == $id][0]{
          _id,
          title,
          price,
          description,
          discountPercentage,
          "imageUrl": image.asset->url,
          tags
        }
      `;
      const data = await sanity.fetch(query, { id });
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10 text-slate-600">Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div>
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={500}
              height={500}
              className="rounded-lg object-cover"
            />
          </div>
          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {product.title}
            </h1>
            <p className="text-slate-600 mt-2">{product.description}</p>
            <div className="mt-4">
              <p className="text-lg text-slate-800 font-semibold">
                Price: ${product.price.toFixed(2)}
              </p>
              {product.discountPercentage > 0 && (
                <p className="text-green-600">
                  Discount: {product.discountPercentage}% OFF
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags?.length > 0 ? (
                product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-slate-200 text-black rounded-full px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p>No Tags</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
