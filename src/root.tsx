import { CartProvider } from "./context/CartContext";
import App from "../src/App";

// Root component that wraps the App with the CartProvider for global cart state management
const root = () => {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
};

export default root;
