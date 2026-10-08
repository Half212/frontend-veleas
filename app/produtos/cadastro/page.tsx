"use client";

import { useEffect, useState, FormEvent, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminCarouselManager from "@/components/admin/AdminCarouselManager";
import AdminCollectionsManager from "@/components/admin/AdminCollectionsManager";
import AdminReportsDashboard from "@/components/admin/AdminReportsDashboard";
import { API_URL } from "@/services/apiConfig";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  categoryName?: string;
  description?: string;
  image?: string;
  images?: string[];
  waxComposition?: string;
  burnTime?: string;
  traditionInfo?: string;
}

type AdminTab = "products" | "carousel" | "collections" | "reports";

export default function PainelAdministrativo() {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const userRole = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => (typeof window !== "undefined" ? localStorage.getItem("userRole") || "" : ""),
    () => ""
  );

  const isAuthorized = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      if (typeof window === "undefined") return null;
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole") || "";
      return (
        isLoggedIn &&
        (role === "ROLE_ADMIN" ||
          role === "ROLE_SUPERVISOR" ||
          role === "ADMIN" ||
          role === "SUPERVISOR")
      );
    },
    () => null
  );

  const isSupervisor =
    userRole === "ROLE_SUPERVISOR" ||
    userRole === "SUPERVISOR" ||
    userRole === "ROLE_ADMIN" ||
    userRole === "ADMIN";

  // Dados do backend
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // Form de Produto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    waxComposition: "",
    burnTime: "",
    traditionInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");

  // Modal de Categoria
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  // Imagens do Produto (Até 3)
  const [imagesPreview, setImagesPreview] = useState<(string | null)[]>([null, null, null]);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);

  // Carregamento de dados após autorização confirmada
  useEffect(() => {
    if (isAuthorized) {
      loadCategories();
      loadProducts();
    }
  }, [isAuthorized]);

  async function loadCategories() {
    setIsLoadingCategories(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Falha ao carregar categorias");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

  const compressAndOptimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
            resolve(optimizedDataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSlotImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProductError("Selecione um arquivo de imagem válido (PNG, JPG, WEBP, etc).");
      return;
    }

    setIsOptimizingImage(true);
    try {
      const optimizedBase64 = await compressAndOptimizeImage(file);
      setImagesPreview((prev) => {
        const next = [...prev];
        next[index] = optimizedBase64;
        return next;
      });
    } catch (err) {
      console.error("Erro ao otimizar imagem:", err);
      setProductError("Falha ao processar a imagem selecionada.");
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleRemoveSlotImage = (index: number) => {
    setImagesPreview((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProductError("");
    setProductSuccess("");

    if (!formData.name.trim()) {
      setProductError("Informe o nome do produto.");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setProductError("Informe um preço válido maior que zero.");
      return;
    }
    if (!formData.stockQuantity || parseInt(formData.stockQuantity, 10) < 0) {
      setProductError("Informe a quantidade de estoque inicial.");
      return;
    }
    if (!formData.categoryId) {
      setProductError("Selecione uma categoria para o produto.");
      return;
    }

    setIsSubmitting(true);

    try {
      const validImages = imagesPreview.filter((img): img is string => Boolean(img));
      const primaryImage = validImages[0] || null;

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
        image: primaryImage,
        images: validImages,
        waxComposition: formData.waxComposition.trim(),
        burnTime: formData.burnTime.trim(),
        traditionInfo: formData.traditionInfo.trim(),
      };

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Falha ao cadastrar o produto.");
      }

      setProductSuccess("Produto cadastrado com sucesso!");
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
        waxComposition: "",
        burnTime: "",
        traditionInfo: "",
      });
      setImagesPreview([null, null, null]);
      loadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setProductError(err.message);
      } else {
        setProductError(String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    setCategoryError("");

    if (!newCategoryName.trim()) {
      setCategoryError("Informe o nome da categoria.");
      return;
    }

    setIsCategorySubmitting(true);

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!res.ok) {
        throw new Error("Erro ao cadastrar a categoria. Ela pode já existir.");
      }

      const createdCategory: Category = await res.json();
      setCategories((prev) => [...prev, createdCategory]);
      setFormData((prev) => ({ ...prev, categoryId: String(createdCategory.id) }));
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCategoryError(err.message);
      } else {
        setCategoryError(String(err));
      }
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  if (!isClient || isAuthorized === null) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center bg-brand-dark-50">
        <div className="w-12 h-12 border-4 border-brand-green-300 border-t-brand-green-900 rounded-full animate-spin mb-4"></div>
        <p className="font-body-md text-brand-green-900 text-xl font-bold">Verificando permissões de acesso...</p>
      </main>
    );
  }

  // Acesso negado
  if (!isAuthorized) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center bg-brand-dark-50">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-red-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-700">
            <span className="material-symbols-outlined text-[36px]">block</span>
          </div>
          <h1 className="font-display-lg text-2xl text-red-900 mb-2 font-bold">Acesso Restrito</h1>
          <p className="font-body-md text-brand-dark-600 mb-6 text-sm leading-relaxed">
            Apenas usuários com perfil de <strong className="text-brand-dark-900 font-bold">Administrador</strong> ou <strong className="text-brand-dark-900 font-bold">Supervisor</strong> podem acessar o painel de controle.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/loja"
              className="w-full bg-brand-green-900 text-white font-label-lg uppercase tracking-widest py-3 rounded-xl hover:bg-brand-green-800 transition-colors shadow font-bold text-xs"
            >
              Ir para a Loja
            </Link>
            <Link
              href="/login"
              className="w-full text-brand-dark-500 hover:text-brand-green-900 font-label-sm uppercase tracking-wider py-2 transition-colors text-xs font-bold"
            >
              Fazer Login com outra conta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-margin-mobile md:px-margin-desktop bg-brand-dark-50/70">
      <div className="max-w-max-width mx-auto">
        {/* Cabeçalho Principal do Painel */}
        <div className="mb-8 border border-brand-dark-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1 text-brand-green-800">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
              <span className="font-label-sm uppercase tracking-widest text-xs font-bold">Painel de Controle Oficial</span>
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-brand-dark-950 font-bold">
              Administração Velas São João
            </h1>
            <p className="font-body-md text-brand-dark-600 text-sm mt-1">
              Perfil: <strong className="uppercase text-brand-green-900 font-bold">{userRole.replace("ROLE_", "")}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/loja"
              className="flex items-center gap-2 text-brand-dark-700 hover:text-brand-green-900 font-label-sm uppercase tracking-widest transition-colors border border-brand-dark-300 hover:border-brand-green-800 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-dark-50/50"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Ver Loja
            </Link>
          </div>
        </div>

        {/* Abas de Navegação do Painel */}
        <div className="flex items-center gap-2 border-b border-brand-dark-200 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "products"
                ? "bg-brand-green-900 text-white shadow-md"
                : "bg-white text-brand-dark-700 hover:bg-brand-dark-100 border border-brand-dark-200"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span>📦 Produtos & Categorias</span>
          </button>

          <button
            onClick={() => setActiveTab("carousel")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "carousel"
                ? "bg-brand-green-900 text-white shadow-md"
                : "bg-white text-brand-dark-700 hover:bg-brand-dark-100 border border-brand-dark-200"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">view_carousel</span>
            <span>🖼️ Banners & Carrossel</span>
          </button>

          {/* Aba de Coleções liberada para Supervisor */}
          {isSupervisor && (
            <button
              onClick={() => setActiveTab("collections")}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "collections"
                  ? "bg-brand-green-900 text-white shadow-md"
                  : "bg-white text-brand-dark-700 hover:bg-brand-dark-100 border border-brand-dark-200"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>✨ Nossas Coleções</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">SUPERVISOR</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-label-sm text-xs md:text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "reports"
                ? "bg-brand-green-900 text-white shadow-md"
                : "bg-white text-brand-dark-700 hover:bg-brand-dark-100 border border-brand-dark-200"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span>📊 Relatórios & Analytics</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* ABA 1: PRODUTOS & CATEGORIAS */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            {/* Mensagens de Sucesso ou Erro */}
            {productSuccess && (
              <div className="p-4 bg-brand-green-100 border border-brand-green-300 text-brand-green-900 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 font-body-md text-sm font-bold">
                  <span className="material-symbols-outlined text-brand-green-800">check_circle</span>
                  <span>{productSuccess}</span>
                </div>
                <Link href="/loja" className="font-label-sm uppercase tracking-wider text-brand-green-900 underline text-xs font-bold">
                  Ver no Catálogo &rarr;
                </Link>
              </div>
            )}

            {productError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2 font-body-md text-sm shadow-xs">
                <span className="material-symbols-outlined text-red-600">error</span>
                <span>{productError}</span>
              </div>
            )}

            {/* Form de Cadastro */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-brand-dark-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green-900 via-brand-green-700 to-accent-gold"></div>

              <div className="mb-6">
                <h2 className="font-display-lg text-2xl text-brand-dark-950 font-bold">Cadastrar Novo Produto</h2>
                <p className="font-body-md text-brand-dark-600 text-xs mt-1">Preencha as informações para disponibilizar o item na loja.</p>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                {/* Fotos do Produto (Até 3 Imagens) */}
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                    Fotos do Produto (Até 3 Imagens Otimizadas)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[0, 1, 2].map((idx) => {
                      const imgPreview = imagesPreview[idx];
                      return (
                        <div key={idx} className="border border-brand-dark-200 bg-brand-dark-50/50 p-3 rounded-2xl flex flex-col items-center gap-2">
                          <span className="text-[11px] font-label-sm uppercase font-bold text-brand-dark-700">
                            {idx === 0 ? "Foto 1 (Capa)" : `Foto ${idx + 1}`}
                          </span>

                          <div className="relative w-full aspect-square rounded-xl border border-brand-dark-200 overflow-hidden bg-white shadow-inner flex items-center justify-center">
                            {imgPreview ? (
                              <Image
                                src={imgPreview}
                                alt={`Preview ${idx + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-4xl text-brand-dark-300">add_a_photo</span>
                            )}
                          </div>

                          <input
                            type="file"
                            id={`create-image-file-${idx}`}
                            accept="image/*"
                            onChange={(e) => handleSlotImageChange(idx, e)}
                            className="hidden"
                          />

                          <div className="flex flex-col w-full gap-1.5 mt-1">
                            <label
                              htmlFor={`create-image-file-${idx}`}
                              className="w-full text-center px-3 py-1.5 bg-brand-green-100 hover:bg-brand-green-200 text-brand-green-900 text-xs font-label-sm uppercase tracking-wider rounded-lg border border-brand-green-300 transition-colors cursor-pointer font-bold truncate"
                            >
                              {isOptimizingImage ? "Otimizando..." : imgPreview ? "Trocar" : "Selecionar"}
                            </label>
                            {imgPreview && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSlotImage(idx)}
                                className="w-full text-center text-red-700 hover:text-red-900 text-xs font-label-sm uppercase tracking-wider font-bold py-1"
                              >
                                Remover
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Especificações Técnicas (Informações Básicas) */}
                <div className="pt-4 border-t border-brand-dark-200 space-y-4">
                  <span className="block font-label-sm text-brand-green-900 font-bold uppercase tracking-wider text-xs">
                    Especificações Técnicas (Exibidas em INFORMAÇÕES BÁSICAS)
                  </span>

                  <div>
                    <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                      Composição da Cera
                    </label>
                    <input
                      type="text"
                      name="waxComposition"
                      value={formData.waxComposition}
                      onChange={handleInputChange}
                      placeholder="Ex: 100% Cera natural purificada de alta qualidade"
                      className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                      Tempo Estimado de Queima
                    </label>
                    <input
                      type="text"
                      name="burnTime"
                      value={formData.burnTime}
                      onChange={handleInputChange}
                      placeholder="Ex: Aproximadamente 35 a 50 horas de chama uniforme"
                      className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                      Tradição / Origem Artesanal
                    </label>
                    <input
                      type="text"
                      name="traditionInfo"
                      value={formData.traditionInfo}
                      onChange={handleInputChange}
                      placeholder="Ex: Produção 100% manual em Belém do Pará desde 1938"
                      className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                    />
                  </div>
                </div>

                {/* Nome do Produto */}
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Vela Aromática de Canela & Especiarias"
                    className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Descreva dimensões, tempo de queima, aroma e características artesanais..."
                    className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md resize-none"
                  />
                </div>

                {/* Preço e Estoque */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                      Preço Unitário (R$) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-brand-dark-400 font-body-md">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                      Estoque Inicial *
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: 50"
                      className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                    />
                  </div>
                </div>

                {/* Categoria + Botão de Modal */}
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                    Categoria do Produto *
                  </label>
                  <div className="flex gap-3">
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoadingCategories}
                      className="flex-grow px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                    >
                      <option value="">
                        {isLoadingCategories ? "Carregando categorias..." : "-- Selecione uma Categoria --"}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="bg-brand-green-50 border border-brand-green-300 hover:bg-brand-green-100 text-brand-green-900 font-label-sm uppercase tracking-wider px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap font-bold text-xs cursor-pointer shadow-xs"
                      title="Cadastrar nova categoria"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Nova Categoria
                    </button>
                  </div>
                </div>

                {/* Botão de Envio */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isOptimizingImage}
                    className="w-full bg-brand-green-900 text-white font-label-lg uppercase tracking-widest py-4 hover:bg-brand-green-800 transition-all duration-300 rounded-xl shadow-lg flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 font-bold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Salvando Produto...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">save</span>
                        Cadastrar Produto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 2: BANNERS & CARROSSEL */}
        {/* ======================================================== */}
        {activeTab === "carousel" && (
          <div className="animate-fadeIn">
            <AdminCarouselManager />
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 3: NOSSAS COLEÇÕES (SUPERVISOR) */}
        {/* ======================================================== */}
        {activeTab === "collections" && (
          <div className="animate-fadeIn">
            <AdminCollectionsManager isSupervisor={isSupervisor} />
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 3: RELATÓRIOS & ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === "reports" && (
          <div className="animate-fadeIn">
            <AdminReportsDashboard products={products} />
          </div>
        )}
      </div>

      {/* Modal de Cadastro de Categoria */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-dark-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Cabeçalho Modal */}
            <div className="bg-brand-green-50 px-6 py-4 border-b border-brand-dark-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-brand-green-900 font-display-lg text-xl font-bold">
                <span className="material-symbols-outlined text-[22px]">category</span>
                <span>Nova Categoria</span>
              </div>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryError("");
                }}
                className="text-brand-dark-500 hover:text-brand-green-900 transition-colors p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Corpo do Modal */}
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              {categoryError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{categoryError}</span>
                </div>
              )}

              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-2 uppercase tracking-wider text-[11px] font-bold">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Decorativas, Aromáticas, Votivas..."
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 font-body-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryError("");
                  }}
                  className="px-4 py-2.5 border border-brand-dark-300 rounded-xl text-brand-dark-700 hover:bg-brand-dark-100 font-label-sm uppercase tracking-wider text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCategorySubmitting}
                  className="px-5 py-2.5 bg-brand-green-900 text-white rounded-xl hover:bg-brand-green-800 font-label-sm uppercase tracking-wider transition-colors shadow flex items-center gap-1.5 disabled:opacity-50 text-xs font-bold"
                >
                  {isCategorySubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      Salvar Categoria
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
