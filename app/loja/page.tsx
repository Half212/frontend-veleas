"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function Loja() {
  const router = useRouter();
  const { addToCart, totalItems, setIsCartOpen } = useCart();
  const [userName, setUserName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryName: string;
  }

  const [produtos, setProdutos] = useState<Product[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      setUserName(localStorage.getItem("userName") || "Visitante");
      
      // Fetch products from backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
          setProdutos(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao carregar produtos:", err);
          setIsLoading(false);
        });
    }
  }, [router]);

  if (!isClient || isLoading) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-golden-honey border-t-heritage-red rounded-full animate-spin mb-4"></div>
        <p className="font-body-md text-heritage-red text-xl animate-pulse">Carregando a loja...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop relative">
      <div className="max-w-max-width mx-auto">
        
        {/* Cabeçalho da Loja */}
        <header className="mb-12 border-b border-golden-honey/30 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-6 bg-wax-cream/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2 text-saojoao">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
              <span className="font-label-sm uppercase tracking-widest text-sm">Catálogo de Produtos</span>
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl text-heritage-red mb-2">Loja São João</h1>
            <p className="font-body-md text-deep-earth text-lg">
              Bem-vindo(a), <span className="font-semibold">{userName}</span>! Escolha suas velas para iluminar seus momentos.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-surface border border-golden-honey/50 hover:bg-golden-honey/20 text-deep-earth font-label-sm uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-3 rounded shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              Carrinho ({totalItems})
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userName");
                router.push("/");
              }}
              className="text-on-surface-variant hover:text-heritage-red border border-transparent hover:border-heritage-red/30 font-label-sm uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-3 rounded"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sair
            </button>
          </div>
        </header>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-wax-cream border border-golden-honey/20 p-5 rounded-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
              {/* Imagem do Produto */}
              <div className="aspect-square bg-surface mb-5 rounded flex items-center justify-center overflow-hidden relative shadow-inner">
                <Image 
                  src="/images/velaartesanal.jpeg" 
                  alt={produto.name}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-heritage-red/0 group-hover:bg-heritage-red/5 transition-colors z-10" />
                <div className="absolute top-3 right-3 z-20 bg-wax-cream p-2 rounded-full shadow-md text-heritage-red opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </div>
              </div>

              {/* Informações */}
              <div className="flex-grow flex flex-col">
                <h2 className="font-display-lg text-2xl text-saojoao mb-2 group-hover:text-heritage-red transition-colors">{produto.name}</h2>
                <p className="font-body-md text-deep-earth/80 mb-6 flex-grow leading-relaxed">
                  {produto.description}
                </p>
                
                <div className="flex justify-between items-center mt-auto border-t border-golden-honey/20 pt-4">
                  <span className="font-label-lg text-2xl text-heritage-red font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)}
                  </span>
                  <button 
                    onClick={() => addToCart({ id: produto.id, name: produto.name, description: produto.description, price: produto.price })}
                    className="bg-heritage-red text-wax-cream hover:bg-saojoao hover:shadow-lg px-5 py-2.5 rounded transition-all duration-300 font-label-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </main>
  );
}
