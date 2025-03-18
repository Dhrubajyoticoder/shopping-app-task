import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../@/components/ui/select";

// Define Product interface
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity: number;
}

// Fetch products from Fake Store API with error handling
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await axios.get<Product[]>("https://fakestoreapi.com/products");
    return data.map((product) => ({ ...product, quantity: 1 }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to load products");
  }
};

const ProductList = () => {
  // Fetch data using React Query
  const { data, isLoading, error } = useQuery<Product[]>({ queryKey: ["products"], queryFn: fetchProducts });

  // State for category filter, sorting, and pagination
  const [category, setCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get addToCart function from Cart Context
  const { addToCart } = useCart();

  // Loading and error handling
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (error) {
    return <p className="p-4 text-center text-red-500">{(error as Error).message}</p>;
  }

  // Filter products based on category
  let filteredProducts = data || [];
  if (category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category);
  }

  // Sort products based on user selection
  if (sortOption === "price") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "rating") {
    filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters Section */}
      <div className="flex justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md mb-6 text-white">
        {/* Category Filter */}
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="w-48 bg-white text-gray-900 rounded-md">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="jewelery">Jewelry</SelectItem>
            <SelectItem value="men's clothing">Men's Clothing</SelectItem>
            <SelectItem value="women's clothing">Women's Clothing</SelectItem>
          </SelectContent>
        </Select>

        {/* Sorting Filter */}
        <Select onValueChange={setSortOption} value={sortOption}>
          <SelectTrigger className="w-48 bg-white text-gray-900 rounded-md">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Sort By</SelectItem>
            <SelectItem value="price">Price (Low to High)</SelectItem>
            <SelectItem value="rating">Rating (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <Card key={product.id} className="p-4 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all">
            <img src={product.image} alt={product.title} className="h-48 w-full object-contain rounded-md" />
            <CardContent>
              <h2 className="text-lg font-bold text-gray-900">{product.title}</h2>
              <p className="text-sm text-gray-600">{product.description.slice(0, 80)}...</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-semibold text-purple-600">${product.price.toFixed(2)}</span>
                <div className="flex items-center">
                  <Star className="text-yellow-500 w-4 h-4" />
                  <span className="ml-1 text-gray-700">{product.rating.rate} ({product.rating.count})</span>
                </div>
              </div>
              <Button className="mt-3 w-full bg-purple-500 hover:bg-purple-700 text-white py-2 rounded-lg" onClick={() => addToCart(product)}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <Button className="mr-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </Button>
        <span className="text-lg text-gray-700 px-4">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductList;

