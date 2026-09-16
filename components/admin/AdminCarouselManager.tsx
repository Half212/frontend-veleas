"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { carouselService } from "@/services/carouselService";
import { CarouselSlide } from "@/types/carousel";

export default function AdminCarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    return typeof window !== "undefined" ? carouselService.getSlides() : [];
  });
  const [isClient, setIsClient] = useState(false);

  // Estados de Edição/Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "Explorar Coleção",
    buttonLink: "/loja",
    active: true,
  });

  const [imagePreview, setImagePreview] = useState<string>("/images/velaartesanal.jpeg");
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadSlides = useCallback(() => {
    setSlides(carouselService.getSlides());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSlides();
  }, [loadSlides]);

  const compressAndOptimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 720;
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
            const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
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
      console.error("Erro ao otimizar imagem:", err);
      setErrorMsg("Falha ao processar a imagem do banner.");
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingSlideId(null);
    setFormData({
      title: "",
      description: "",
      buttonText: "Explorar Coleção",
      buttonLink: "/loja",
      active: true,
    });
    setImagePreview("/images/velaartesanal.jpeg");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: CarouselSlide) => {
    setEditingSlideId(slide.id);
    setFormData({
      title: slide.title,
      description: slide.description,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      active: slide.active,
    });
    setImagePreview(slide.image);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Informe o título do banner.");
      return;
    }

    if (!imagePreview) {
      setErrorMsg("Selecione uma imagem para o banner.");
      return;
    }

    if (editingSlideId) {
      carouselService.updateSlide(editingSlideId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        buttonText: formData.buttonText.trim(),
        buttonLink: formData.buttonLink.trim(),
        image: imagePreview,
        active: formData.active,
      });
      setSuccessMsg("Banner atualizado com sucesso!");
    } else {
      carouselService.addSlide({
        title: formData.title.trim(),
        description: formData.description.trim(),
        buttonText: formData.buttonText.trim(),
        buttonLink: formData.buttonLink.trim(),
        image: imagePreview,
        active: formData.active,
      });
      setSuccessMsg("Novo banner cadastrado e publicado na Home!");
    }

    setIsModalOpen(false);
    loadSlides();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert("O carrossel deve conter pelo menos 1 slide.");
      return;
    }

    if (confirm("Tem certeza que deseja remover este slide do carrossel?")) {
      carouselService.deleteSlide(id);
      loadSlides();
      setSuccessMsg("Slide removido com sucesso.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleToggleActive = (id: string) => {
    carouselService.toggleActive(id);
    loadSlides();
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    carouselService.reorderSlides(copy);
    loadSlides();
  };

  const handleResetDefaults = () => {
    if (confirm("Deseja restaurar os banners padrão da Velas São João?")) {
      carouselService.resetToDefaults();
      loadSlides();
      setSuccessMsg("Banners restaurados para a versão padrão de fábrica.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (!isClient) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header do Módulo */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-brand-dark-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-green-800 mb-1">
            <span className="material-symbols-outlined text-[24px]">view_carousel</span>
            <span className="font-label-sm uppercase tracking-widest text-xs font-bold">Gestão Visual</span>
          </div>
          <h2 className="font-display-lg text-2xl md:text-3xl text-brand-dark-950 font-bold">
            Banners do Carrossel Principal
          </h2>
          <p className="font-body-md text-brand-dark-600 text-sm mt-1">
            Personalize as imagens de destaque, títulos, textos e links de ação exibidos na página inicial da loja.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-brand-dark-100 hover:bg-brand-dark-200 text-brand-dark-700 rounded-xl font-label-sm text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            title="Restaurar slides originais"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            Padrões
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-brand-green-900 hover:bg-brand-green-800 text-white rounded-xl font-label-sm text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            Novo Slide
          </button>
        </div>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="p-4 bg-brand-green-100 border border-brand-green-300 text-brand-green-900 rounded-xl flex items-center gap-2 font-body-md text-sm shadow-xs">
          <span className="material-symbols-outlined text-brand-green-800 text-[20px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Lista de Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col ${
              slide.active ? "border-brand-dark-200" : "border-dashed border-brand-dark-300 opacity-60"
            }`}
          >
            {/* Banner Thumbnail */}
            <div className="relative h-48 w-full bg-brand-dark-900 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                unoptimized={Boolean(slide.image && slide.image.startsWith("data:"))}
                className="object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-transparent to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-brand-dark-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  Slide #{slide.order}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    slide.active ? "bg-emerald-600 text-white" : "bg-zinc-700 text-zinc-200"
                  }`}
                >
                  {slide.active ? "Visível" : "Inativo"}
                </span>
              </div>

              {/* Ordem de Exibição */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-brand-dark-900/80 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => handleMoveSlide(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-white hover:text-accent-gold disabled:opacity-30 transition-colors"
                  title="Mover para cima/anterior"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
                <button
                  onClick={() => handleMoveSlide(index, "down")}
                  disabled={index === slides.length - 1}
                  className="p-1 text-white hover:text-accent-gold disabled:opacity-30 transition-colors"
                  title="Mover para baixo/seguinte"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
              </div>

              {/* Título Preview */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-display-lg text-lg text-white font-bold truncate">
                  {slide.title}
                </h3>
              </div>
            </div>

            {/* Conteúdo e Configurações */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="font-body-md text-brand-dark-600 text-xs line-clamp-2 leading-relaxed">
                  {slide.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs font-label-sm border-t border-brand-dark-100 pt-3">
                  <span className="text-brand-dark-400">Botão CTA:</span>
                  <span className="text-brand-green-900 font-bold bg-brand-green-50 px-2 py-0.5 rounded border border-brand-green-200">
                    &quot;{slide.buttonText}&quot; → {slide.buttonLink}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-brand-dark-100">
                <button
                  onClick={() => handleToggleActive(slide.id)}
                  className={`text-xs font-label-sm uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                    slide.active
                      ? "border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                      : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {slide.active ? "visibility_off" : "visibility"}
                  </span>
                  {slide.active ? "Ocultar" : "Ativar"}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 text-brand-dark-600 hover:text-brand-green-900 hover:bg-brand-green-50 rounded-lg transition-colors"
                    title="Editar slide"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 text-brand-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir slide"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação / Edição de Slide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-dark-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-brand-green-50 px-6 py-4 border-b border-brand-dark-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-brand-green-900 font-display-lg text-xl font-bold">
                <span className="material-symbols-outlined text-[24px]">
                  {editingSlideId ? "edit_note" : "add_photo_alternate"}
                </span>
                <span>{editingSlideId ? "Editar Slide do Carrossel" : "Novo Slide do Carrossel"}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-dark-500 hover:text-brand-green-900 p-1 rounded-full cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlide} className="p-6 space-y-5 overflow-y-auto flex-grow">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Título Principal do Banner *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Velas Artesanais de Cera Pura"
                  required
                  className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Subtítulo / Texto Explicativo *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Desde 1922 iluminando altares, lares e momentos especiais com artesanato manual."
                  rows={2}
                  required
                  className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md resize-none text-brand-dark-900 text-sm"
                />
              </div>

              {/* Imagem do Banner */}
              <div>
                <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                  Imagem de Fundo do Banner *
                </label>

                <div className="space-y-3">
                  {/* Live Preview */}
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-brand-dark-200 bg-brand-dark-950 shadow-inner">
                    <Image
                      src={imagePreview}
                      alt="Banner Preview"
                      fill
                      unoptimized={Boolean(imagePreview && imagePreview.startsWith("data:"))}
                      className="object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-950/90 via-brand-dark-950/30 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold">Preview em tempo real</span>
                      <h4 className="text-white font-display-lg text-lg truncate font-bold">{formData.title || "Título do Slide"}</h4>
                      <p className="text-white/80 text-xs truncate">{formData.description || "Descrição do slide"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      id="carousel-image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="carousel-image-upload"
                      className="px-4 py-2 bg-brand-green-100 hover:bg-brand-green-200 text-brand-green-900 font-label-sm text-xs uppercase tracking-wider rounded-xl border border-brand-green-300 cursor-pointer inline-flex items-center gap-2 font-bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      {isOptimizingImage ? "Otimizando Imagem..." : "Fazer Upload de Foto"}
                    </label>

                    {/* Presets Rápidos */}
                    <div className="flex items-center gap-2 text-xs font-label-sm text-brand-dark-500">
                      <span>Ou selecionar padrão:</span>
                      <button
                        type="button"
                        onClick={() => setImagePreview("/images/velaartesanal.jpeg")}
                        className="px-2 py-1 bg-brand-dark-100 hover:bg-brand-dark-200 rounded text-brand-dark-700"
                      >
                        Foto 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePreview("/images/velaartesanal2.jpeg")}
                        className="px-2 py-1 bg-brand-dark-100 hover:bg-brand-dark-200 rounded text-brand-dark-700"
                      >
                        Foto 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePreview("/images/velaartesanal3.jpeg")}
                        className="px-2 py-1 bg-brand-dark-100 hover:bg-brand-dark-200 rounded text-brand-dark-700"
                      >
                        Foto 3
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Ação & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Texto do Botão (CTA)
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Ex: Explorar Coleção"
                    className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-brand-dark-700 mb-1 uppercase tracking-wider text-[11px] font-bold">
                    Link de Destino
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData((prev) => ({ ...prev, buttonLink: e.target.value }))}
                    placeholder="Ex: /loja ou /historia"
                    className="w-full px-4 py-2.5 bg-brand-dark-50/50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 font-body-md text-brand-dark-900 text-sm"
                  />
                </div>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="slide-active"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                  className="w-5 h-5 accent-brand-green-900 rounded cursor-pointer"
                />
                <label htmlFor="slide-active" className="text-sm font-body-md text-brand-dark-800 font-semibold cursor-pointer">
                  Exibir este slide imediatamente no carrossel da Home
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
                  Salvar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
