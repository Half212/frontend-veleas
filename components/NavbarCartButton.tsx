"use client";

import { useCart } from "@/context/CartContext";

export default function NavbarCartButton() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      aria-label="Carrinho"
      className="relative text-brand-green-900 hover:text-brand-green-700 transition-all duration-300 flex items-center justify-center p-1"
    >
      <span className="material-symbols-outlined text-[24px] md:text-[28px]">
        shopping_bag
      </span>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-green-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
          {totalItems}
        </span>
      )}
    </button>
  );
}
