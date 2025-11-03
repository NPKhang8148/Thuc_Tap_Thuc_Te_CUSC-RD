// client-user/src/contexts/CartContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import useUserStore from "../stores/userStore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useUserStore();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) return;
    try {
      await axios.post(
        "/api/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      await axios.put(
        "/api/cart/remove",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    try {
      await axios.put(
        "/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (!token) return;
    try {
      await axios.delete("/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err) {
      console.error("Lỗi khi xoá toàn bộ giỏ hàng:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
