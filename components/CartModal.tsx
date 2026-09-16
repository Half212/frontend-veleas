"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CartModal() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedStore, setSelectedStore] = useState<"matriz" | "filial">("matriz");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setCustomerName(savedName);
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    const phoneStore = selectedStore === "matriz" ? "5591980726020" : "5591980726020";
    const storeName = selectedStore === "matriz" ? "Loja Matriz (Cidade Velha)" : "Loja Filial (Shopping Pátio Belém)";

    const formattedItems = cart
      .map(
        (item, index) =>
          `${index + 1}. *${item.name}*\n   • Qtd: ${item.quantity}x\n   • Subtotal: ${new Intl.NumberFormat(
            "pt-BR",
            { style: "currency", currency: "BRL" }
          ).format(item.price * item.quantity)}`
      )
      .join("\n\n");

    const message = `🕯️ *NOVO PEDIDO - VELAS SÃO JOÃO* 🕯️\n\n` +
      `📍 *Unidade de Atendimento*: ${storeName}\n` +
      `👤 *Cliente*: ${customerName.trim() || "Não informado"}\n` +
      (customerPhone.trim() ? `📞 *Telefone*: ${customerPhone.trim()}\n` : "") +
      (deliveryNotes.trim() ? `📝 *Observações/Endereço*: ${deliveryNotes.trim()}\n` : "") +
      `----------------------------------------\n` +
      `📦 *ITENS DO PEDIDO*:\n\n${formattedItems}\n` +
      `----------------------------------------\n` +
      `💰 *VALOR TOTAL*: *${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalPrice)}*\n\n` +
      `Gostaria de confirmar a disponibilidade e finalizar o pagamento!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneStore}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-brand-dark-950/70 backdrop-blur-sm flex justify-end transition-opacity animate-fadeIn">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-brand-green-200 transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-brand-dark-200/80 flex items-center justify-between bg-brand-green-50/50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-brand-green-900 text-2xl">
              shopping_bag
            </span>
            <h2 className="font-display-lg text-2xl text-brand-green-900 font-bold">
              Seu Carrinho ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-brand-dark-500 hover:text-brand-green-900 hover:bg-brand-green-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-brand-dark-500">
              <span className="material-symbols-outlined text-6xl text-brand-green-300 mb-3">
                remove_shopping_cart
              </span>
              <p className="font-display-md text-xl text-brand-dark-800 mb-2">Seu carrinho está vazio</p>
              <p className="font-body-md text-sm text-brand-dark-500 max-w-xs">
                Explore nosso catálogo e adicione velas artesanais ao seu pedido.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-brand-dark-50/40 p-4 rounded-xl border border-brand-dark-200 flex gap-4 items-center shadow-sm"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-brand-green-100">
                  <Image
                    src={item.image || "/images/velaartesanal.jpeg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display-lg text-lg text-brand-dark-900 truncate">
                    {item.name}
                  </h3>
                  <p className="font-label-md text-brand-green-800 font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded border border-brand-dark-300 flex items-center justify-center text-brand-dark-700 hover:bg-brand-green-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-label-md px-2 text-brand-dark-900 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded border border-brand-dark-300 flex items-center justify-center text-brand-dark-700 hover:bg-brand-green-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 transition-colors"
                  title="Remover"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Controls */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-brand-dark-200 bg-brand-green-50/40 space-y-4">
            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-label-sm text-brand-dark-700 uppercase tracking-wider mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 text-sm bg-white border border-brand-dark-300 rounded-lg focus:outline-none focus:border-brand-green-700 text-brand-dark-900"
                />
              </div>

              <div>
                <label className="block text-xs font-label-sm text-brand-dark-700 uppercase tracking-wider mb-1">
                  Loja para Atendimento
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value as "matriz" | "filial")}
                  className="w-full px-3 py-2 text-sm bg-white border border-brand-dark-300 rounded-lg focus:outline-none focus:border-brand-green-700 text-brand-dark-900"
                >
                  <option value="matriz">Loja Matriz (Cidade Velha)</option>
                  <option value="filial">Loja Filial (Shopping Pátio Belém)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-sm text-brand-dark-700 uppercase tracking-wider mb-1">
                  Observações / Endereço (opcional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ex: Entrega na Cidade Velha / Retirada em loja"
                  className="w-full px-3 py-2 text-sm bg-white border border-brand-dark-300 rounded-lg focus:outline-none focus:border-brand-green-700 text-brand-dark-900"
                />
              </div>
            </div>

            {/* Subtotal */}
            <div className="pt-2 border-t border-brand-dark-200 flex justify-between items-center">
              <span className="font-label-lg uppercase tracking-wider text-brand-dark-700">Total:</span>
              <span className="font-display-lg text-2xl text-brand-green-900 font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalPrice)}
              </span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full bg-brand-green-900 hover:bg-brand-green-800 text-white font-label-lg uppercase tracking-widest py-3.5 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">chat</span>
              Finalizar Pedido via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
