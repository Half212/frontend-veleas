"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  image?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function Loja() {
  const router = useRouter();
  const { addToCart, totalItems, setIsCartOpen } = useCart();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estados de gestão de produtos (Editar & Excluir)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
  });
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  const isStaff =
    userRole === "ROLE_ADMIN" ||
    userRole === "ROLE_SUPERVISOR" ||
    userRole === "ADMIN" ||
    userRole === "SUPERVISOR";

  const isAdmin = userRole === "ROLE_ADMIN" || userRole === "ADMIN";

  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/login");
    } else {
      setUserName(localStorage.getItem("userName") || "Visitante");
      setUserRole(localStorage.getItem("userRole") || "");
      loadProducts();
      loadCategories();
    }
  }, [router]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProdutos(data);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizingImage(true);
    try {
      const optimizedBase64 = await compressAndOptimizeImage(file);
      setEditImagePreview(optimizedBase64);
    } catch (err) {
      console.error("Erro ao otimizar imagem:", err);
      setActionError("Falha ao processar imagem.");
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleOpenEdit = (product: Product) => {
    setActionError("");
    setActionSuccess("");
    setEditingProduct(product);

    // Tenta encontrar o ID da categoria que corresponde ao categoryName
    const matchedCategory = categories.find((cat) => cat.name === product.categoryName);

    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      categoryId: matchedCategory ? String(matchedCategory.id) : (categories[0] ? String(categories[0].id) : "1"),
    });
    setEditImagePreview(product.image || null);
    setAdminPassword("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setActionError("");
    setIsActionSubmitting(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isAdmin) {
        if (!adminPassword.trim()) {
          throw new Error("Como Administrador, é necessário confirmar sua senha no campo específico.");
        }
        headers["X-Admin-Password"] = adminPassword;
      }

      const res = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: editFormData.name,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          stockQuantity: parseInt(editFormData.stockQuantity, 10),
          categoryId: parseInt(editFormData.categoryId, 10),
          image: editImagePreview || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Erro ao salvar alterações no produto.");
      }

      setActionSuccess("Produto atualizado com sucesso!");
      setEditingProduct(null);
      loadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError(String(err));
      }
    } finally {
      setIsActionSubmitting(false);
    }
  };

  const handleOpenDelete = (product: Product) => {
    setActionError("");
    setActionSuccess("");
    setDeletingProduct(product);
    setAdminPassword("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    setActionError("");
    setIsActionSubmitting(true);

    try {
      const headers: Record<string, string> = {};

      if (isAdmin) {
        if (!adminPassword.trim()) {
          throw new Error("Como Administrador, é necessário informar sua senha para confirmar a exclusão.");
        }
        headers["X-Admin-Password"] = adminPassword;
      }

      const res = await fetch(`${API_URL}/products/${deletingProduct.id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Erro ao excluir o produto.");
      }

      setActionSuccess("Produto excluído com sucesso!");
      setDeletingProduct(null);
      loadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message);
      } else {
        setActionError(String(err));
      }
    } finally {
      setIsActionSubmitting(false);
    }
  };

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
        {/* Mensagens Globais de Ação */}
        {actionSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 font-body-md">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess("")} className="text-green-800 hover:text-green-950 font-bold">
              &times;
            </button>
          </div>
        )}

        {/* Cabeçalho da Loja */}
        <header className="mb-12 border border-brand-dark-200 pb-6 flex flex-col md:flex-row justify-between md:items-end gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-green-800">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
              <span className="font-label-sm uppercase tracking-widest text-xs font-bold">Catálogo Oficial</span>
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-brand-dark-950 font-bold mb-2">Loja São João</h1>
            <p className="font-body-md text-brand-dark-600 text-base">
              Bem-vindo(a), <span className="font-semibold text-brand-dark-900">{userName}</span>!{" "}
              {isStaff && (
                <span className="inline-block ml-2 px-2.5 py-0.5 rounded text-xs font-label-sm uppercase tracking-wider bg-brand-green-100 text-brand-green-900 border border-brand-green-300 font-bold">
                  {userRole.replace("ROLE_", "")}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isStaff && (
              <Link
                href="/produtos/cadastro"
                className="bg-brand-green-900 hover:bg-brand-green-800 text-white font-label-sm uppercase tracking-widest transition-all flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                Painel Admin
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-brand-dark-50 border border-brand-dark-300 hover:bg-brand-green-50 text-brand-dark-900 font-label-sm uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm cursor-pointer text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px] text-brand-green-800">shopping_cart</span>
              Carrinho ({totalItems})
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                router.push("/");
              }}
              className="text-brand-dark-500 hover:text-red-700 border border-brand-dark-200 hover:border-red-200 font-label-sm uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sair
            </button>
          </div>
        </header>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white border border-brand-dark-200 p-5 rounded-2xl hover:shadow-xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1 relative"
            >
              {/* Imagem do Produto */}
              <div className="aspect-square bg-brand-dark-50 mb-5 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner">
                <Image
                  src={produto.image || "/images/velaartesanal.jpeg"}
                  alt={produto.name}
                  fill
                  unoptimized={Boolean(produto.image && produto.image.startsWith("data:"))}
                  className="object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-brand-green-950/0 group-hover:bg-brand-green-950/5 transition-colors z-10" />

                {/* Badge de Categoria */}
                <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-brand-green-900 font-label-sm text-[10px] uppercase tracking-wider border border-brand-green-200 font-bold">
                  {produto.categoryName}
                </div>
              </div>

              {/* Informações */}
              <div className="flex-grow flex flex-col">
                <h2 className="font-display-lg text-2xl text-brand-dark-950 mb-2 group-hover:text-brand-green-800 transition-colors font-bold">
                  {produto.name}
                </h2>
                <p className="font-body-md text-brand-dark-600 mb-6 flex-grow leading-relaxed text-sm">
                  {produto.description}
                </p>

                {/* Controles Administrativos (Editar & Excluir) */}
                {isStaff && (
                  <div className="mb-4 pt-3 border-t border-brand-dark-200 flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(produto)}
                      className="flex-1 bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-900 border border-brand-green-200 font-label-sm uppercase tracking-wider py-2 px-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer font-bold"
                      title="Editar este produto"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Editar
                    </button>

                    <button
                      onClick={() => handleOpenDelete(produto)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-label-sm uppercase tracking-wider py-2 px-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer font-bold"
                      title="Excluir este produto"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Excluir
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mt-auto border-t border-brand-dark-200 pt-4">
                  <span className="font-label-lg text-2xl text-brand-green-900 font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.price)}
                  </span>
                  <button
                    onClick={() =>
                      addToCart({
                        id: produto.id,
                        name: produto.name,
                        description: produto.description,
                        price: produto.price,
                      })
                    }
                    className="bg-brand-green-900 text-white hover:bg-brand-green-800 hover:shadow-md px-5 py-2.5 rounded-xl transition-all duration-300 font-label-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer text-xs font-bold"
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

      {/* Modal de Edição de Produto */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-brand-dark-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-dark-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-brand-green-50 px-6 py-4 border-b border-brand-dark-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-brand-green-900 font-display-lg text-xl font-bold">
                <span className="material-symbols-outlined text-[22px]">edit_note</span>
                <span>Editar Produto #{editingProduct.id}</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-brand-dark-500 hover:text-brand-green-900 transition-colors p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto flex-grow">
              {actionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{actionError}</span>
                </div>
              )}

              {/* Nome */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Descrição
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md resize-none text-brand-dark-900"
                />
              </div>

              {/* Preço e Estoque */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.stockQuantity}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, stockQuantity: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Categoria *
                </label>
                <select
                  value={editFormData.categoryId}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imagem Otimizada */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Imagem do Produto
                </label>
                <input
                  type="file"
                  id="edit-image-file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="flex items-center gap-4 border border-brand-dark-200 bg-brand-dark-50/40 p-3 rounded-xl">
                  <div className="relative w-20 h-20 rounded-lg border border-brand-dark-200 overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={editImagePreview || "/images/velaartesanal.jpeg"}
                      alt="Preview"
                      fill
                      unoptimized={Boolean(editImagePreview && editImagePreview.startsWith("data:"))}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="edit-image-file"
                      className="px-3 py-1.5 bg-brand-green-100 hover:bg-brand-green-200 text-brand-green-900 font-label-sm text-xs uppercase tracking-wider rounded-lg border border-brand-green-300 cursor-pointer inline-flex items-center gap-1 w-fit font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      {isOptimizingImage ? "Otimizando..." : "Alterar Imagem"}
                    </label>
                    {editImagePreview && (
                      <button
                        type="button"
                        onClick={() => setEditImagePreview(null)}
                        className="text-red-700 hover:text-red-900 text-xs font-label-sm uppercase tracking-wider text-left font-bold"
                      >
                        Remover Imagem
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Se for Admin, solicita a senha de confirmação */}
              {isAdmin && (
                <div className="pt-2 border-t border-brand-dark-200">
                  <label className="block font-label-sm text-brand-green-900 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Confirmação de Senha do Administrador *
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Digite sua senha de administrador"
                    required={isAdmin}
                    className="w-full px-4 py-2.5 bg-brand-green-50/50 border border-brand-green-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900"
                  />
                  <p className="text-[11px] text-brand-dark-500 mt-1">
                    Exigido para registrar a auditoria de alterações efetuadas por administradores.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-dark-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-brand-dark-300 rounded-xl text-brand-dark-700 hover:bg-brand-dark-100 font-label-sm uppercase tracking-wider text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isActionSubmitting || isOptimizingImage}
                  className="px-5 py-2 bg-brand-green-900 hover:bg-brand-green-800 text-white rounded-xl font-label-sm uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer text-xs font-bold shadow-sm"
                >
                  {isActionSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão de Produto */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-brand-dark-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-red-800 font-display-lg text-xl font-bold">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <span>Excluir Produto</span>
              </div>
              <button
                onClick={() => setDeletingProduct(null)}
                className="text-brand-dark-500 hover:text-red-700 p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {actionError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{actionError}</span>
                </div>
              )}

              <p className="font-body-md text-brand-dark-700 text-sm leading-relaxed">
                Tem certeza que deseja excluir permanentemente o produto{" "}
                <strong className="text-red-700 font-bold">{deletingProduct.name}</strong> (ID #{deletingProduct.id})? Esta ação não poderá ser desfeita no banco de dados.
              </p>

              {isAdmin && (
                <div>
                  <label className="block font-label-sm text-brand-dark-800 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Confirmação de Senha do Administrador *
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Digite sua senha de administrador"
                    required={isAdmin}
                    className="w-full px-4 py-2.5 bg-red-50/60 border border-red-300 rounded-xl focus:outline-none focus:border-red-600 font-body-md text-brand-dark-900"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  className="px-4 py-2 border border-brand-dark-300 rounded-xl text-brand-dark-700 hover:bg-brand-dark-100 font-label-sm uppercase tracking-wider text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isActionSubmitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-label-sm uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow text-xs font-bold"
                >
                  {isActionSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                      Confirmar Exclusão
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
