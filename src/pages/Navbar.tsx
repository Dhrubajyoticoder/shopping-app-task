import { NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext"; // Importing the custom cart context
import "tailwindcss";

const Navbar = () => {
  // Extracting cart data from context
  const { cart } = useCart(); // Assuming cart is an array of cart items

  return (
    <nav className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white flex justify-between items-center shadow-md rounded-b-xl">
      {/* Brand Name with Navigation */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-2xl font-extrabold tracking-wide uppercase transition-all duration-300 ${
            isActive
              ? "text-[#FFD700] drop-shadow-[0_0_12px_#FFD700]" 
              : "text-white hover:text-[#FFD700] hover:drop-shadow-[0_0_12px_#FFD700]"
          }`
        }
      >
        ✨ HYPE HAVEN ⚡
      </NavLink>

      {/* Cart Icon with Badge */}
      <NavLink to="/cart" className="relative">
        {/* Shopping Cart Icon */}
        <ShoppingBag className="w-8 h-8 text-white hover:text-[#FFD700] transition-all duration-300 drop-shadow-lg" />
        
        {/* Display cart item count if greater than 0 */}
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg animate-pulse drop-shadow-[0_0_10px_#FFD700]">
            {cart.length}
          </span>
        )}
      </NavLink>
    </nav>
  );
};

export default Navbar;


