"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { API_URL } from "@/services/apiConfig";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  image?: string;
  images?: string[];
  waxComposition?: string;
  burnTime?: string;
  traditionInfo?: string;
}

export default function DetalhesProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId ? String(rawId) : "";
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Imagem ativa selecionada na galeria
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Controle de quantidade para compra
  const [quantity, setQuantity] = useState(1);
  
  // Controle de abas de descrição
  const [activeTab, setActiveTab] = useState<"basica" | "cuidados" | "envio">("basica");

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        // 1. Tenta buscar o produto especificamente pelo ID: GET /products/:id
        const resSingle = await fetch(`${API_URL}/products/${productId}`);
        if (resSingle.ok) {
          const singleProduct: Product = await resSingle.json();
          if (isMounted && singleProduct && singleProduct.id) {
            setProduct(singleProduct);

            // Carrega os produtos relacionados em segundo plano
            fetch(`${API_URL}/products`)
              .then((r) => (r.ok ? r.json() : []))
              .then((all: Product[]) => {
                if (isMounted && Array.isArray(all)) {
                  setRelatedProducts(all.filter((p) => String(p.id) !== productId).slice(0, 3));
                }
              })
              .catch(() => {});

            setIsLoading(false);
            return;
          }
        }

        // 2. Fallback: Se o endpoint por ID falhar, busca a lista completa /products
        const resAll = await fetch(`${API_URL}/products`);
        if (!resAll.ok) {
          throw new Error("Não foi possível carregar os dados dos produtos.");
        }
        const allProducts: Product[] = await resAll.json();
        const found = allProducts.find((p) => String(p.id) === productId);

        if (isMounted) {
          if (found) {
            setProduct(found);
            setRelatedProducts(allProducts.filter((p) => String(p.id) !== productId).slice(0, 3));
          } else {
            setError("Produto não encontrado no catálogo.");
          }
        }
      } catch (err: unknown) {
        console.error("Erro ao carregar detalhes do produto:", err);
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erro inesperado ao buscar detalhes.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center bg-brand-dark-50">
        <div className="w-12 h-12 border-4 border-brand-green-300 border-t-brand-green-900 rounded-full animate-spin mb-4"></div>
        <p className="font-body-md text-brand-green-900 text-lg font-bold animate-pulse">
          Carregando detalhes do produto...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center bg-brand-dark-50">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl text-center border border-brand-dark-200">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-3">
            search_off
          </span>
          <h1 className="font-display-lg text-2xl text-brand-dark-950 font-bold mb-2">
            Produto Não Encontrado
          </h1>
          <p className="font-body-md text-brand-dark-600 text-sm mb-6">
            {error || "O produto que você procura não está disponível ou foi removido do catálogo."}
          </p>
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 bg-brand-green-900 hover:bg-brand-green-800 text-white font-label-sm uppercase tracking-widest px-6 py-3 rounded-xl transition-all font-bold text-xs shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Voltar para a Loja
          </Link>
        </div>
      </main>
    );
  }

  // Galeria com NO MÁXIMO 3 IMAGENS (suporta array de fotos cadastradas ou fallbacks elegantes)
  const rawGallery = product.images && product.images.length > 0
    ? product.images
    : [product.image || "/images/velaartesanal.jpeg", "/images/velaartesanal2.jpeg", "/images/velaartesanal3.jpeg"];
  
  const galleryImages = rawGallery.filter(Boolean).slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
      });
    }
    setIsCartOpen(true);
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <main className="min-h-screen pt-28 pb-24 px-margin-mobile md:px-margin-desktop bg-brand-dark-50/60">
      <div className="max-w-max-width mx-auto">
        {/* Breadcrumb / Navegação Rápida */}
        <nav className="flex items-center gap-2 text-xs font-label-sm text-brand-dark-500 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-brand-green-800 transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/loja" className="hover:text-brand-green-800 transition-colors">
            Loja
          </Link>
          <span>/</span>
          <span className="text-brand-dark-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Card Principal de Detalhes */}
        <div className="bg-white rounded-3xl border border-brand-dark-200 shadow-xl overflow-hidden p-6 md:p-10 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Coluna 1: Galeria de Imagens (Máximo 3 Imagens) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Visualizador Principal */}
            <div className="relative aspect-square w-full bg-brand-dark-50 rounded-2xl overflow-hidden border border-brand-dark-200 shadow-inner group">
              <Image
                src={galleryImages[selectedImageIndex] || "/images/velaartesanal.jpeg"}
                alt={`${product.name} - Imagem ${selectedImageIndex + 1}`}
                fill
                priority
                unoptimized={Boolean(galleryImages[selectedImageIndex]?.startsWith("data:"))}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-xs text-brand-green-900 font-label-sm text-[11px] uppercase tracking-wider border border-brand-green-200 font-bold">
                {product.categoryName || "Edição Limitada"}
              </div>
            </div>

            {/* Miniaturas (Limitadas a no máximo 3) */}
            <div className="grid grid-cols-3 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-brand-dark-50 ${
                    selectedImageIndex === idx
                      ? "border-brand-green-800 ring-2 ring-brand-green-800/30 scale-102 shadow-md"
                      : "border-brand-dark-200 hover:border-brand-green-400 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    unoptimized={Boolean(img?.startsWith("data:"))}
                    className="object-cover"
                  />
                  {selectedImageIndex === idx && (
                    <div className="absolute inset-0 bg-brand-green-900/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-body-md text-brand-dark-400 text-center italic">
              📸 Fotos reais da produção artesanal (Máximo de 3 ângulos exclusivos)
            </p>
          </div>

          {/* Coluna 2: Informações de Venda & Valor Evidente */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <h1 className="font-display-lg text-3xl md:text-4xl text-brand-dark-950 font-bold mb-4 leading-tight">
                {product.name}
              </h1>

              {/* VALOR EVIDENTE */}
              <div className="bg-brand-green-50/70 p-6 rounded-2xl border border-brand-green-200/80 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-label-sm text-xs text-brand-dark-600 uppercase tracking-widest font-semibold">Preço:</span>
                  <span className="font-display-lg text-3xl md:text-4xl text-brand-green-900 font-bold drop-shadow-xs">
                    {formattedPrice}
                  </span>
                </div>
                <p className="font-body-md text-xs text-brand-green-800 mt-2 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  Pronta entrega para Belém e região metropolitana
                </p>
              </div>

              {/* Breve resumo da descrição */}
              <p className="font-body-lg text-brand-dark-700 leading-relaxed mb-6 text-base">
                {product.description ||
                  "Vela artesanal confeccionada com matérias-primas nobres, proporcionando uma iluminação suave, envolvente e com essências selecionadas para momentos inesquecíveis."}
              </p>
            </div>

            {/* Controles de Compra e Quantidade */}
            <div className="space-y-4 pt-4 border-t border-brand-dark-200">
              <div className="flex items-center gap-4">
                <span className="font-label-sm text-xs text-brand-dark-700 uppercase tracking-wider font-bold">Quantidade:</span>
                <div className="flex items-center border border-brand-dark-300 rounded-xl bg-brand-dark-50/50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-brand-dark-800 hover:bg-white rounded-lg transition-colors cursor-pointer font-bold"
                    aria-label="Diminuir quantidade"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-4 font-label-lg font-bold text-brand-dark-950 text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-brand-dark-800 hover:bg-white rounded-lg transition-colors cursor-pointer font-bold"
                    aria-label="Aumentar quantidade"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-brand-green-900 hover:bg-brand-green-800 text-white font-label-lg uppercase tracking-widest py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  Adicionar ao Carrinho
                </button>

                <button
                  onClick={() => {
                    handleAddToCart();
                  }}
                  className="bg-accent-gold hover:bg-accent-hover text-white font-label-lg uppercase tracking-widest py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO DE ABAS COM ELEMENTO REQUERIDO ESPECÍFICO:
            <button type="button" class="button -open" data-description-tab="">INFORMAÇÕES BÁSICAS</button>
        */}
        <div className="bg-white rounded-3xl border border-brand-dark-200 shadow-lg p-6 md:p-10 mb-16">
          <div className="flex flex-wrap items-center gap-3 border-b border-brand-dark-200 pb-4 mb-8">
            {/* ELEMENTO MANTIDO EXATAMENTE CONFORME EXIGIDO PELO USUÁRIO */}
            <button
              type="button"
              className={`button ${activeTab === "basica" ? "-open bg-brand-green-900 text-white" : "bg-brand-dark-50 text-brand-dark-700 hover:bg-brand-dark-100"} font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold px-6 py-3 rounded-xl transition-all cursor-pointer border border-brand-dark-200`}
              data-description-tab=""
              onClick={() => setActiveTab("basica")}
            >
              INFORMAÇÕES BÁSICAS
            </button>

            <button
              type="button"
              className={`font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold px-6 py-3 rounded-xl transition-all cursor-pointer border border-brand-dark-200 ${
                activeTab === "cuidados"
                  ? "bg-brand-green-900 text-white"
                  : "bg-brand-dark-50 text-brand-dark-700 hover:bg-brand-dark-100"
              }`}
              onClick={() => setActiveTab("cuidados")}
            >
              CUIDADOS DE USO & SEGURANÇA
            </button>

            <button
              type="button"
              className={`font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold px-6 py-3 rounded-xl transition-all cursor-pointer border border-brand-dark-200 ${
                activeTab === "envio"
                  ? "bg-brand-green-900 text-white"
                  : "bg-brand-dark-50 text-brand-dark-700 hover:bg-brand-dark-100"
              }`}
              onClick={() => setActiveTab("envio")}
            >
              ENTREGA & RETIRADA EM LOJA
            </button>
          </div>

          {/* Conteúdo da Aba Ativa com suporte a dados dinâmicos do produto */}
          {activeTab === "basica" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-display-lg text-2xl text-brand-dark-950 font-bold">
                Especificações Técnicas e Artesanais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-5 bg-brand-dark-50/60 rounded-2xl border border-brand-dark-200">
                  <div className="flex items-center gap-2 text-brand-green-800 font-label-sm uppercase tracking-wider text-xs font-bold mb-2">
                    <span className="material-symbols-outlined text-[20px]">eco</span>
                    Composição da Cera
                  </div>
                  <p className="font-body-md text-sm text-brand-dark-700 leading-relaxed">
                    {product.waxComposition || "100% Cera natural purificada de alta qualidade, sem parafinas tóxicas ou aditivos nocivos à saúde."}
                  </p>
                </div>

                <div className="p-5 bg-brand-dark-50/60 rounded-2xl border border-brand-dark-200">
                  <div className="flex items-center gap-2 text-brand-green-800 font-label-sm uppercase tracking-wider text-xs font-bold mb-2">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                    Tempo Estimado de Queima
                  </div>
                  <p className="font-body-md text-sm text-brand-dark-700 leading-relaxed">
                    {product.burnTime || "Aproximadamente 35 a 50 horas de chama uniforme e aroma contínuo do início ao fim."}
                  </p>
                </div>

                <div className="p-5 bg-brand-dark-50/60 rounded-2xl border border-brand-dark-200">
                  <div className="flex items-center gap-2 text-brand-green-800 font-label-sm uppercase tracking-wider text-xs font-bold mb-2">
                    <span className="material-symbols-outlined text-[20px]">history_edu</span>
                    Tradição Familiar
                  </div>
                  <p className="font-body-md text-sm text-brand-dark-700 leading-relaxed">
                    {product.traditionInfo || "Produção 100% manual e tradicional em Belém do Pará desde 1938, preservando o saber secular."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cuidados" && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-display-lg text-2xl text-brand-dark-950 font-bold mb-2">
                Recomendações para Melhor Aproveitamento
              </h3>
              <ul className="space-y-3 font-body-md text-brand-dark-700 text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-brand-green-700 text-[18px] mt-0.5">check_circle</span>
                  <span><strong>Apare o pavio:</strong> Mantenha o pavio sempre cortado a cerca de 0,5cm antes de acender novamente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-brand-green-700 text-[18px] mt-0.5">check_circle</span>
                  <span><strong>Piscina de cera:</strong> Deixe a cera derreter até a borda na primeira queima para evitar a formação de túneis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-brand-green-700 text-[18px] mt-0.5">check_circle</span>
                  <span><strong>Superfície estável:</strong> Acenda sempre sobre uma superfície plana, resistente ao calor e fora de correntes de ar.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "envio" && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-display-lg text-2xl text-brand-dark-950 font-bold mb-2">
                Opções de Entrega & Unidades Físicas
              </h3>
              <p className="font-body-md text-brand-dark-700 text-sm leading-relaxed">
                Você pode optar por receber seu pedido diretamente no seu endereço em Belém/PA ou retirar sem custos adicionais em uma de nossas unidades:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-brand-green-50/50 rounded-xl border border-brand-green-200">
                  <strong className="block text-brand-green-900 font-bold text-sm">📍 Loja Matriz</strong>
                  <span className="text-xs text-brand-dark-700">Rua Dr. Assis, 52 - Cidade Velha, Belém - PA</span>
                </div>
                <div className="p-4 bg-brand-green-50/50 rounded-xl border border-brand-green-200">
                  <strong className="block text-brand-green-900 font-bold text-sm">🛍️ Loja Filial</strong>
                  <span className="text-xs text-brand-dark-700">Shopping Pátio Belém, 3° piso</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-display-lg text-2xl md:text-3xl text-brand-dark-950 font-bold mb-6">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/loja/${rel.id}`}
                  className="bg-white border border-brand-dark-200 p-4 rounded-2xl hover:shadow-lg transition-all group flex flex-col"
                >
                  <div className="aspect-square bg-brand-dark-50 rounded-xl overflow-hidden relative mb-4">
                    <Image
                      src={rel.image || "/images/velaartesanal.jpeg"}
                      alt={rel.name}
                      fill
                      unoptimized={Boolean(rel.image && rel.image.startsWith("data:"))}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-display-lg text-lg text-brand-dark-950 group-hover:text-brand-green-800 font-bold mb-1">
                    {rel.name}
                  </h4>
                  <span className="font-label-lg text-brand-green-900 font-bold mt-auto pt-2">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(rel.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
