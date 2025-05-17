// src/context/CartContext.js
import React, { createContext, useState } from "react";

// Create the context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [localCart, setLocalCart] = useState([]);

  // Add product to local cart
  const addToLocalCart = (product) => {
    setLocalCart((prevCart) => {
      const existing = prevCart.find(
        (item) =>
          item.productId === product.productId &&
          item.quantity === product.quantity
      );

      if (existing) return prevCart; // Avoid duplicate entries

      return [...prevCart, product];
    });
  };

  // Delete product from local cart
  const removeFromLocalCart = (productId) => {
    setLocalCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  return (
    <CartContext.Provider
      value={{ localCart, addToLocalCart, removeFromLocalCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
