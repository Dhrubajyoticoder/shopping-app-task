// Import necessary modules and components
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingBag, CheckCircle, XCircle, Info } from "lucide-react";
import NasaAPOD from "../components/NasaAPOD";
import "tailwindcss";

// Define the Cart component
const Cart = () => {
  // Access cart data and removal functionality from context
  const { cart, removeFromCart } = useCart();

  // State for managing coupon input, discount details, and error messages
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState({
    applied: false,
    amount: 0,
    code: "",
  });
  const [couponError, setCouponError] = useState("");

  // Display error if cart data fails to load
  if (!cart)
    return <p className="p-6 text-red-500">Failed to load cart data.</p>;

  // Calculate various price details
  const platformFee = 5.0; // Fixed platform fee
  const shippingFee = cart.length > 0 ? 5.99 : 0; // Conditional shipping fee
  const totalMRP = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ); // Total price
  const discountMRP = totalMRP * 0.1; // 10% discount on MRP
  const finalTotal =
    totalMRP - discountMRP - discount.amount + platformFee + shippingFee; // Final amount payable

  // Predefined coupons for the user
  const availableCoupons = [
    { code: "SAVE10", description: "Get $10 off your order.", discount: 10 },
    {
      code: "HALFOFF",
      description: "Get 50% off your order.",
      discount: totalMRP * 0.5,
    },
  ];

  // Function to apply the entered coupon code
  const applyCoupon = () => {
    const matchedCoupon = availableCoupons.find((c) => c.code === coupon);
    if (matchedCoupon) {
      setDiscount({
        applied: true,
        amount: matchedCoupon.discount,
        code: matchedCoupon.code,
      });
      setCouponError("");
    } else {
      setDiscount({ applied: false, amount: 0, code: "" });
      setCouponError("Invalid coupon code!");
    }
  };

  // Render the Cart component
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Conditional rendering if the cart is empty */}
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 p-10 border rounded-lg shadow-md bg-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-500" />
          <p className="text-lg font-medium text-gray-700">
            Your bag is too light!
          </p>
          <p className="text-gray-500">Add some items to start shopping.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Display each item in the cart */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border-b border-gray-300 rounded-md shadow-sm bg-white relative"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 object-contain rounded-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.png";
                }}
              />
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  {item.title}
                </p>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
                <p className="text-gray-800 font-medium">
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              {/* Button to remove item from cart */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          ))}

          {/* Display available coupons */}
          <div className="p-4 bg-yellow-100 rounded-md shadow-sm">
            <p className="text-gray-800 font-semibold flex items-center gap-2">
              <Info className="w-5 h-5 text-yellow-600" /> Available Coupons
            </p>
            <ul className="mt-2 space-y-2">
              {availableCoupons.map(({ code, description }) => (
                <li
                  key={code}
                  className="flex justify-between p-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 cursor-pointer"
                  onClick={() => setCoupon(code)}
                >
                  <span className="text-gray-700">{description}</span>
                  <span className="text-blue-600 font-medium">{code}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coupon application section */}
          <div className="p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="text-gray-700 font-medium">Have a coupon?</p>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="p-2 border rounded-md flex-1"
              />
              <button
                onClick={applyCoupon}
                className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
            {/* Display success or error messages */}
            {discount.applied && (
              <p className="text-green-600 flex items-center gap-1 mt-2">
                <CheckCircle className="w-4 h-4" />
                Coupon Applied: -${discount.amount.toFixed(2)}
              </p>
            )}
            {couponError && <p className="text-red-500 mt-2">{couponError}</p>}
          </div>

          {/* Price breakdown section */}
          <div className="p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="text-lg font-semibold text-gray-800">Price Details</p>
            <div className="flex justify-between text-gray-700 mt-2">
              <span>Total MRP:</span> <span>${totalMRP.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Discount on MRP:</span>{" "}
              <span className="text-green-600">-${discountMRP.toFixed(2)}</span>
            </div>
            {discount.applied && (
              <div className="flex justify-between text-gray-700">
                <span>Coupon Discount:</span>{" "}
                <span className="text-green-600">
                  -${discount.amount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-gray-900 mt-3">
              <span>Total Payable:</span> <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place order button */}
          <button className="w-full py-3 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
            Place Order
          </button>

          {/* Trending section with NASA APOD */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Trending Beyond Earth ✨
            </h2>
            <NasaAPOD />
          </div>
        </div>
      )}
    </div>
  );
};

// Export the Cart component
export default Cart;

