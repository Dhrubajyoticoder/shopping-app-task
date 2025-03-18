import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define Product Interface
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

// Define Context Type
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom Hook to Use Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Define Props for Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Load cart from localStorage (initial state)
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to Cart
  const addToCart = (product: Product) => {
    if (!product || typeof product !== "object" || !product.id) {
      console.error("Invalid product data");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from Cart (Decrease quantity or remove)
  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          return prevCart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prevCart.filter((item) => item.id !== id);
        }
      }

      return prevCart;
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
