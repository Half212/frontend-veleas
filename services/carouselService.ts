import { CarouselSlide } from "@/types/carousel";

const CAROUSEL_STORAGE_KEY = "velas_sao_joao_carousel_slides_v1";
const CAROUSEL_EVENT = "velas_sao_joao_carousel_updated";

export const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "slide-1",
    image: "/images/velaartesanal.jpeg",
    title: "Velas Artesanais de Cera",
    description: "Desde 1922 iluminando lares, altares e momentos de profunda devoção.",
    buttonText: "Explorar Coleção",
    buttonLink: "/loja",
    active: true,
    order: 1,
  },
  {
    id: "slide-2",
    image: "/images/velaartesanal2.jpeg",
    title: "Velas Religiosas de Devoção",
    description: "Fé, oração e tradição moldadas à mão com o mais puro artesanato.",
    buttonText: "Ver Velas Religiosas",
    buttonLink: "/loja",
    active: true,
    order: 2,
  },
  {
    id: "slide-3",
    image: "/images/velaartesanal3.jpeg",
    title: "Velas Decorativas Aromáticas",
    description: "Ambientes acolhedores com aromas envolventes e luz serena.",
    buttonText: "Conhecer Linha Aromática",
    buttonLink: "/loja",
    active: true,
    order: 3,
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const carouselService = {
  async fetchFromBackend(): Promise<CarouselSlide[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/carousel`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.saveSlidesLocally(data);
          return data;
        }
      }
    } catch {
      // Backend endpoint /carousel ainda não implementado ou offline - usa fallback local
    }
    return null;
  },

  getSlides(): CarouselSlide[] {
    if (typeof window === "undefined") {
      return DEFAULT_CAROUSEL_SLIDES;
    }

    try {
      const stored = localStorage.getItem(CAROUSEL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => a.order - b.order);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar slides do carrossel:", e);
    }

    return DEFAULT_CAROUSEL_SLIDES;
  },

  getActiveSlides(): CarouselSlide[] {
    return this.getSlides().filter((slide) => slide.active);
  },

  saveSlidesLocally(slides: CarouselSlide[]): void {
    if (typeof window === "undefined") return;
    try {
      const sorted = slides.map((s, idx) => ({ ...s, order: idx + 1 }));
      localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(sorted));
      window.dispatchEvent(new CustomEvent(CAROUSEL_EVENT, { detail: sorted }));
    } catch (e) {
      console.error("Erro ao salvar slides localmente:", e);
    }
  },

  async saveSlides(slides: CarouselSlide[]): Promise<void> {
    this.saveSlidesLocally(slides);

    // Tenta sincronizar com o backend caso a rota exista
    try {
      await fetch(`${API_BASE_URL}/carousel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
      });
    } catch {
      // Falha silenciosa no backend, mantendo persistência no localStorage
    }
  },

  addSlide(slide: Omit<CarouselSlide, "id" | "order">): CarouselSlide {
    const current = this.getSlides();
    const newSlide: CarouselSlide = {
      ...slide,
      id: "slide-" + Date.now(),
      order: current.length + 1,
    };
    const updated = [...current, newSlide];
    this.saveSlides(updated);
    return newSlide;
  },

  updateSlide(id: string, updates: Partial<Omit<CarouselSlide, "id">>): void {
    const current = this.getSlides();
    const updated = current.map((slide) =>
      slide.id === id ? { ...slide, ...updates } : slide
    );
    this.saveSlides(updated);
  },

  deleteSlide(id: string): void {
    const current = this.getSlides();
    const updated = current.filter((slide) => slide.id !== id);
    this.saveSlides(updated);
  },

  toggleActive(id: string): void {
    const current = this.getSlides();
    const updated = current.map((slide) =>
      slide.id === id ? { ...slide, active: !slide.active } : slide
    );
    this.saveSlides(updated);
  },

  reorderSlides(reordered: CarouselSlide[]): void {
    this.saveSlides(reordered);
  },

  resetToDefaults(): void {
    this.saveSlides(DEFAULT_CAROUSEL_SLIDES);
  },

  onUpdate(callback: (slides: CarouselSlide[]) => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<CarouselSlide[]>;
      callback(customEvent.detail || this.getSlides());
    };

    window.addEventListener(CAROUSEL_EVENT, handler);
    return () => window.removeEventListener(CAROUSEL_EVENT, handler);
  },
};
