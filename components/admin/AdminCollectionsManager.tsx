"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { collectionService } from "@/services/collectionService";
import { HomeCollectionItem } from "@/types/collection";

interface AdminCollectionsManagerProps {
  isSupervisor?: boolean;
}

const PRESET_IMAGES = [
  { label: "Religiosa", url: "/images/velareligiosa.png" },
  { label: "Decorativa", url: "/images/veladecorativa2.png" },
  { label: "Aromática", url: "/images/velaaromatica.jpeg" },
  { label: "Sebo de Holanda", url: "/images/sebodeholanda.jpeg" },
  { label: "Artesanal 1", url: "/images/velaartesanal.jpeg" },
  { label: "Artesanal 2", url: "/images/velaartesanal2.jpeg" },
  { label: "Artesanal 3", url: "/images/velaartesanal3.jpeg" },
];

export default function AdminCollectionsManager({ isSupervisor = false }: AdminCollectionsManagerProps) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const collections = useSyncExternalStore(
    collectionService.subscribe,
    collectionService.getCollectionsSnapshot,
    collectionService.getServerCollectionsSnapshot
  );

  const headerData = useSyncExternalStore(
    collectionService.subscribe,
    collectionService.getHeaderSnapshot,
    collectionService.getServerHeaderSnapshot
  );

  useEffect(() => {
    collectionService.fetchFromBackend();
  }, []);

  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerTagInput, setHeaderTagInput] = useState("");
  const [headerTitleInput, setHeaderTitleInput] = useState("");

  // Estados de Edição/Criação de Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tag: "Tradição & Fé",
    title: "",
    subtitle: "",
    buttonText: "Ver coleção",
    link: "/loja",
    active: true,
  });

  const [imagePreview, setImagePreview] = useState<string>("/images/velareligiosa.png");
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleStartEditHeader = () => {
    setHeaderTagInput(headerData.tag);
    setHeaderTitleInput(headerData.title);
    setIsEditingHeader(true);
  };

  // Compressão e otimização de imagem via Canvas (mesmo padrão do Carrossel)
  const compressAndOptimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
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
            const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.86);
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

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Selecione um arquivo de imagem válido (PNG, JPG, WEBP, etc).");
      return;
    }

    setIsOptimizingImage(true);
    try {
      const optimizedBase64 = await compressAndOptimizeImage(file);
      setImagePreview(optimizedBase64);
    } catch (err) {
      console.error("Erro ao otimizar imagem da coleção:", err);
      setErrorMsg("Falha ao processar a imagem da coleção.");
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItemId(null);
    setFormData({
      tag: "Tradição & Fé",
      title: "",
      subtitle: "",
      buttonText: "Ver coleção",
      link: "/loja",
      active: true,
    });
    setImagePreview("/images/velareligiosa.png");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: HomeCollectionItem) => {
    setEditingItemId(item.id);
    setFormData({
      tag: item.tag,
      title: item.title,
      subtitle: item.subtitle,
      buttonText: item.buttonText || "Ver coleção",
      link: item.link || "/loja",
      active: item.active,
    });
    setImagePreview(item.image);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Informe o título da coleção.");
      return;
    }

    if (!formData.subtitle.trim()) {
      setErrorMsg("Informe o subtítulo / descrição da coleção.");
      return;
    }

    if (!imagePreview) {
      setErrorMsg("Selecione uma imagem para a coleção.");
      return;
    }

    if (editingItemId) {
      collectionService.updateCollection(editingItemId, {
        tag: formData.tag.trim() || "Coleção",
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        buttonText: formData.buttonText.trim() || "Ver coleção",
        link: formData.link.trim() || "/loja",
        image: imagePreview,
        active: formData.active,
      });
      setSuccessMsg("Coleção atualizada com sucesso!");
    } else {
      collectionService.addCollection({
        tag: formData.tag.trim() || "Coleção",
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        buttonText: formData.buttonText.trim() || "Ver coleção",
        link: formData.link.trim() || "/loja",
        image: imagePreview,
        active: formData.active,
      });
      setSuccessMsg("Nova coleção cadastrada e publicada no site!");
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteItem = (id: string) => {
    if (collections.length <= 1) {
      alert("A seção deve conter pelo menos 1 coleção cadastrada.");
      return;
    }

    if (confirm("Tem certeza que deseja excluir esta coleção da página inicial?")) {
      collectionService.deleteCollection(id);
      setSuccessMsg("Coleção removida com sucesso.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleToggleActive = (id: string) => {
    collectionService.toggleActive(id);
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= collections.length) return;

    const copy = [...collections];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    collectionService.reorderCollections(copy);
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerTitleInput.trim()) return;

    const newHeader = {
      tag: headerTagInput.trim() || "Artesanato & Fé",
      title: headerTitleInput.trim() || "Nossas Coleções",
    };
    collectionService.saveSectionHeader(newHeader);
    setIsEditingHeader(false);
    setSuccessMsg("Cabeçalho da seção atualizado com sucesso!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleResetDefaults = () => {
    if (confirm("Deseja restaurar as coleções e fotos padrão de fábrica da Velas São João?")) {
      collectionService.resetToDefaults();
      setSuccessMsg("Coleções restauradas para a versão padrão.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (!isClient) return null;

  // Verificação de Segurança de Supervisor
  if (!isSupervisor) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm my-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        <h3 className="font-display-lg text-2xl text-amber-950 font-bold mb-2">
          Acesso Restrito ao Perfil Supervisor
        </h3>
        <p className="font-body-md text-amber-800 text-sm leading-relaxed mb-4">
          Somente usuários com perfil <strong>Supervisor (ROLE_SUPERVISOR)</strong> têm permissão para editar as fotos, títulos e subtítulos da seção &quot;Nossas Coleções&quot;.
        </p>
        <span className="inline-block bg-white text-amber-900 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-amber-300">
          Permissão de Supervisor necessária
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header do Módulo com Identificação SUPERVISOR */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-brand-dark-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-green-800 mb-1">
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
            <span className="font-label-sm uppercase tracking-widest text-xs font-bold">Gestão da Home</span>
            <span className="bg-brand-green-100 text-brand-green-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-brand-green-300">
              ACESSO SUPERVISOR
            </span>
          </div>
          <h2 className="font-display-lg text-2xl md:text-3xl text-brand-dark-950 font-bold">
            Seção &quot;Nossas Coleções&quot;
          </h2>
          <p className="font-body-md text-brand-dark-600 text-sm mt-1">
            Edite as fotos, títulos, subtítulos e ordem dos blocos em destaque no meio da página inicial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-brand-dark-100 hover:bg-brand-dark-200 text-brand-dark-700 rounded-xl font-label-sm text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            title="Restaurar fotos e textos originais"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Padrões
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-brand-green-900 hover:bg-brand-green-800 text-white rounded-xl font-label-sm text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            Nova Coleção
          </button>
        </div>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="p-4 bg-brand-green-100 border border-brand-green-300 text-brand-green-900 rounded-xl flex items-center gap-2 font-body-md text-sm shadow-xs animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-brand-green-800 text-[20px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor do Título da Seção (Artesanato & Fé / Nossas Coleções) */}
      <div className="bg-white p-6 rounded-2xl border border-brand-dark-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[11px] font-label-sm uppercase tracking-wider text-brand-green-800 font-bold block">
              Cabeçalho da Seção na Home
            </span>
            <h3 className="font-display-lg text-lg text-brand-dark-900 font-bold">
              Título e Subtítulo Principal
            </h3>
          </div>
          <button
            onClick={() => isEditingHeader ? setIsEditingHeader(false) : handleStartEditHeader()}
            className="text-xs font-label-sm uppercase tracking-wider px-3 py-1.5 rounded-lg border border-brand-dark-300 hover:border-brand-green-800 text-brand-dark-700 hover:text-brand-green-900 transition-colors flex items-center gap-1 font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEditingHeader ? "close" : "edit"}
            </span>
            {isEditingHeader ? "Cancelar" : "Editar Cabeçalho"}
          </button>
        </div>

        {isEditingHeader ? (
          <form onSubmit={handleSaveHeader} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-dark-100">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-brand-dark-600 mb-1 font-bold">
                Tag Superior (Ex: Artesanato & Fé)
              </label>
              <input
                type="text"
                value={headerTagInput}
                onChange={(e) => setHeaderTagInput(e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl text-sm focus:outline-none focus:border-brand-green-800 text-brand-dark-900"
                placeholder="Ex: Artesanato & Fé"
              />
            </div>
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-brand-dark-600 mb-1 font-bold">
                Título Principal (Ex: Nossas Coleções)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={headerTitleInput}
                  onChange={(e) => setHeaderTitleInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl text-sm focus:outline-none focus:border-brand-green-800 text-brand-dark-900"
                  placeholder="Ex: Nossas Coleções"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-green-900 hover:bg-brand-green-800 text-white rounded-xl text-xs font-label-sm uppercase tracking-wider font-bold transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-4 bg-brand-dark-50/60 p-4 rounded-xl border border-brand-dark-200">
            <div>
              <span className="text-[11px] font-label-sm uppercase tracking-widest text-brand-green-700 font-bold block">
                {headerData.tag}
              </span>
              <h4 className="font-headline-md text-xl text-brand-dark-950 font-bold">
                {headerData.title}
              </h4>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Coleções Cadastradas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {collections.map((item, index) => (
          <div
            key={item.id}
            className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col ${
              item.active ? "border-brand-dark-200" : "border-dashed border-brand-dark-300 opacity-60"
            }`}
          >
            {/* Visual Thumbnail do Card (Simulando a Home) */}
            <div className="relative h-60 w-full bg-brand-dark-900 overflow-hidden group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized={Boolean(item.image && item.image.startsWith("data:"))}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/95 via-brand-dark-950/40 to-transparent"></div>

              {/* Status & Posição */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-brand-dark-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  Posição #{item.order}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    item.active ? "bg-emerald-600 text-white" : "bg-zinc-700 text-zinc-200"
                  }`}
                >
                  {item.active ? "Visível na Home" : "Oculto"}
                </span>
              </div>

              {/* Controles de Ordem */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-brand-dark-900/80 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => handleMoveItem(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-white hover:text-accent-gold disabled:opacity-30 transition-colors"
                  title="Mover para cima"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
                <button
                  onClick={() => handleMoveItem(index, "down")}
                  disabled={index === collections.length - 1}
                  className="p-1 text-white hover:text-accent-gold disabled:opacity-30 transition-colors"
                  title="Mover para baixo"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
              </div>

              {/* Preview dos Textos do Card */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="inline-block text-[10px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-2.5 py-0.5 rounded mb-1.5 backdrop-blur-sm font-bold">
                  {item.tag}
                </span>
                <h3 className="font-headline-sm text-xl text-white font-bold leading-tight drop-shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Detalhes e Ações */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-label-sm uppercase tracking-wider text-brand-dark-400 font-bold block mb-1">
                  Subtítulo / Descrição Exibida no Site:
                </span>
                <p className="font-body-md text-brand-dark-700 text-xs line-clamp-2 leading-relaxed bg-brand-dark-50/50 p-2.5 rounded-lg border border-brand-dark-100">
                  {item.subtitle}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs font-label-sm border-t border-brand-dark-100 pt-3">
                  <span className="text-brand-dark-400">Botão de Ação:</span>
                  <span className="text-brand-green-900 font-bold bg-brand-green-50 px-2.5 py-0.5 rounded border border-brand-green-200">
                    &quot;{item.buttonText}&quot; → {item.link}
                  </span>
                </div>
              </div>

              {/* Barra de Ações */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-brand-dark-100">
                <button
                  onClick={() => handleToggleActive(item.id)}
                  className={`text-xs font-label-sm uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 font-bold ${
                    item.active
                      ? "border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                      : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {item.active ? "visibility_off" : "visibility"}
                  </span>
                  {item.active ? "Ocultar" : "Ativar"}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 text-brand-green-900 hover:bg-brand-green-50 border border-brand-green-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Editar fotos e textos da coleção"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-brand-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir coleção"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação / Edição de Coleção */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-dark-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-brand-green-50 px-6 py-4 border-b border-brand-dark-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-brand-green-900 font-display-lg text-xl font-bold">
                <span className="material-symbols-outlined text-[24px]">
                  {editingItemId ? "edit_note" : "add_photo_alternate"}
                </span>
                <span>{editingItemId ? "Editar Coleção" : "Nova Coleção para a Home"}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-dark-500 hover:text-brand-green-900 p-1 rounded-full cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-5 overflow-y-auto flex-grow">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Tag / Etiqueta e Título */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Etiqueta / Tag *
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                    placeholder="Ex: Tradição & Fé"
                    required
                    className="w-full px-3.5 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Título da Coleção *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Velas Religiosas"
                    required
                    className="w-full px-3.5 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900 text-sm"
                  />
                </div>
              </div>

              {/* Subtítulo / Descrição */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Subtítulo / Descrição (Texto Explicativo) *
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Ex: Fé e devoção moldadas à mão para os seus momentos sagrados."
                  rows={2}
                  required
                  className="w-full px-3.5 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md resize-none text-brand-dark-900 text-sm"
                />
              </div>

              {/* Foto da Coleção & Live Preview */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Foto da Coleção *
                </label>

                <div className="space-y-3">
                  {/* Live Preview estilo Bento Card da Home */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-brand-dark-200 bg-brand-dark-950 shadow-inner">
                    <Image
                      src={imagePreview}
                      alt="Collection Preview"
                      fill
                      unoptimized={Boolean(imagePreview && imagePreview.startsWith("data:"))}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="inline-block text-[10px] font-label-sm uppercase tracking-widest text-white bg-brand-green-900/90 px-2 py-0.5 rounded mb-1">
                        {formData.tag || "Tag"}
                      </span>
                      <h4 className="text-white font-headline-sm text-lg font-bold truncate">
                        {formData.title || "Título da Coleção"}
                      </h4>
                      <p className="text-white/80 text-xs truncate">
                        {formData.subtitle || "Subtítulo / Descrição"}
                      </p>
                      <div className="mt-1 text-white/70 text-[11px] flex items-center gap-1">
                        <span>{formData.buttonText || "Ver coleção"}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload e Presets */}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      id="collection-image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="collection-image-upload"
                      className="px-4 py-2 bg-brand-green-100 hover:bg-brand-green-200 text-brand-green-900 font-label-sm text-xs uppercase tracking-wider rounded-xl border border-brand-green-300 cursor-pointer inline-flex items-center gap-2 font-bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      {isOptimizingImage ? "Otimizando Imagem..." : "Fazer Upload de Foto"}
                    </label>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-label-sm text-brand-dark-500">
                      <span>Presets:</span>
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setImagePreview(preset.url)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            imagePreview === preset.url
                              ? "bg-brand-green-900 text-white font-bold"
                              : "bg-brand-dark-100 hover:bg-brand-dark-200 text-brand-dark-700"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Ação & Link de Destino */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Ex: Ver coleção"
                    className="w-full px-3.5 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Link de Destino
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                    placeholder="Ex: /loja ou /loja?categoria=1"
                    className="w-full px-3.5 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900 text-sm"
                  />
                </div>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="collection-active"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                  className="w-5 h-5 accent-brand-green-900 rounded cursor-pointer"
                />
                <label htmlFor="collection-active" className="text-sm font-body-md text-brand-dark-800 font-semibold cursor-pointer">
                  Exibir esta coleção imediatamente na página inicial do site
                </label>
              </div>

              {/* Ações do Modal */}
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-dark-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-brand-dark-300 rounded-xl text-brand-dark-700 hover:bg-brand-dark-100 font-label-sm uppercase tracking-wider text-xs font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isOptimizingImage}
                  className="px-6 py-2.5 bg-brand-green-900 hover:bg-brand-green-800 text-white rounded-xl font-label-sm uppercase tracking-wider transition-colors flex items-center gap-2 text-xs font-bold shadow-md disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Salvar Coleção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
