import { HomeCollectionItem, CollectionsSectionHeader } from "@/types/collection";
import { API_BASE_URL } from "@/services/apiConfig";

const COLLECTIONS_STORAGE_KEY = "velas_sao_joao_home_collections_v1";
const HEADER_STORAGE_KEY = "velas_sao_joao_home_collections_header_v1";
const COLLECTIONS_EVENT = "velas_sao_joao_collections_updated";

export const DEFAULT_COLLECTIONS: HomeCollectionItem[] = [
  {
    id: "collection-1",
    tag: "Tradição & Fé",
    title: "Velas Religiosas",
    subtitle: "Fé e devoção moldadas à mão para os seus momentos sagrados.",
    image: "/images/velareligiosa.png",
    buttonText: "Ver coleção",
    link: "/loja",
    active: true,
    order: 1,
  },
  {
    id: "collection-2",
    tag: "Sofisticação",
    title: "Velas Decorativas",
    subtitle: "Ambientes mais acolhedores, elegantes e iluminados.",
    image: "/images/veladecorativa2.png",
    buttonText: "Ver coleção",
    link: "/loja",
    active: true,
    order: 2,
  },
  {
    id: "collection-3",
    tag: "Sensações",
    title: "Velas Aromáticas",
    subtitle: "Aromas envolventes que transformam sua casa e bem-estar.",
    image: "/images/velaaromatica.jpeg",
    buttonText: "Ver coleção",
    link: "/loja",
    active: true,
    order: 3,
  },
  {
    id: "collection-4",
    tag: "Artesanal",
    title: "Sebo de Holanda",
    subtitle: "Tradição centenária e pureza para seu cuidado diário.",
    image: "/images/sebodeholanda.jpeg",
    buttonText: "Ver coleção",
    link: "/loja",
    active: true,
    order: 4,
  },
];

export const DEFAULT_SECTION_HEADER: CollectionsSectionHeader = {
  tag: "Artesanato & Fé",
  title: "Nossas Coleções",
};

const SERVER_ACTIVE_COLLECTIONS: HomeCollectionItem[] = DEFAULT_COLLECTIONS.filter((item) => item.active);



// Caches estáveis em memória para evitar loops em useSyncExternalStore
let cachedCollections: HomeCollectionItem[] | null = null;
let cachedActiveCollections: HomeCollectionItem[] | null = null;
let cachedHeader: CollectionsSectionHeader | null = null;

function readCollectionsFromStorage(): HomeCollectionItem[] {
  if (typeof window === "undefined") return DEFAULT_COLLECTIONS;
  try {
    const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.order - b.order);
      }
    }
  } catch (e) {
    console.error("Erro ao carregar coleções:", e);
  }
  return DEFAULT_COLLECTIONS;
}

function readHeaderFromStorage(): CollectionsSectionHeader {
  if (typeof window === "undefined") return DEFAULT_SECTION_HEADER;
  try {
    const stored = localStorage.getItem(HEADER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.title === "string") {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar cabeçalho:", e);
  }
  return DEFAULT_SECTION_HEADER;
}

function ensureCacheLoaded(): void {
  if (!cachedCollections) {
    const cols = readCollectionsFromStorage();
    cachedCollections = cols;
    cachedActiveCollections = cols.filter((item) => item.active);
  }
  if (!cachedHeader) {
    cachedHeader = readHeaderFromStorage();
  }
}

export const collectionService = {
  async fetchFromBackend(): Promise<{ collections: HomeCollectionItem[]; header: CollectionsSectionHeader } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/collections`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (Array.isArray(data.collections) && data.collections.length > 0) {
            this.saveCollectionsLocally(data.collections);
          }
          if (data.header && data.header.title) {
            cachedHeader = data.header;
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(HEADER_STORAGE_KEY, JSON.stringify(data.header));
              } catch (e) {
                console.error("Erro ao salvar header:", e);
              }
            }
          }
          return data;
        }
      }
    } catch {
      // Backend endpoint ainda não implementado ou offline
    }
    return null;
  },

  getCollections(): HomeCollectionItem[] {
    ensureCacheLoaded();
    return cachedCollections || DEFAULT_COLLECTIONS;
  },

  getActiveCollections(): HomeCollectionItem[] {
    ensureCacheLoaded();
    return cachedActiveCollections || SERVER_ACTIVE_COLLECTIONS;
  },

  getSectionHeader(): CollectionsSectionHeader {
    ensureCacheLoaded();
    return cachedHeader || DEFAULT_SECTION_HEADER;
  },

  // Snapshots estáveis para useSyncExternalStore
  getCollectionsSnapshot(): HomeCollectionItem[] {
    ensureCacheLoaded();
    return cachedCollections || DEFAULT_COLLECTIONS;
  },

  getActiveCollectionsSnapshot(): HomeCollectionItem[] {
    ensureCacheLoaded();
    return cachedActiveCollections || SERVER_ACTIVE_COLLECTIONS;
  },

  getHeaderSnapshot(): CollectionsSectionHeader {
    ensureCacheLoaded();
    return cachedHeader || DEFAULT_SECTION_HEADER;
  },

  getServerCollectionsSnapshot(): HomeCollectionItem[] {
    return DEFAULT_COLLECTIONS;
  },

  getServerActiveCollectionsSnapshot(): HomeCollectionItem[] {
    return SERVER_ACTIVE_COLLECTIONS;
  },

  getServerHeaderSnapshot(): CollectionsSectionHeader {
    return DEFAULT_SECTION_HEADER;
  },

  async syncWithBackend(collections: HomeCollectionItem[], header: CollectionsSectionHeader): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/collections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections, header }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.collections) && data.collections.length > 0) {
          this.saveCollectionsLocally(data.collections);
        }
      }
    } catch (e) {
      console.warn("Falha na sincronização de coleções com backend:", e);
    }
  },

  async saveSectionHeader(header: CollectionsSectionHeader): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      cachedHeader = header;
      localStorage.setItem(HEADER_STORAGE_KEY, JSON.stringify(header));
      window.dispatchEvent(
        new CustomEvent(COLLECTIONS_EVENT, {
          detail: { collections: this.getCollections(), header },
        })
      );
    } catch (e) {
      console.error("Erro ao salvar cabeçalho de coleções:", e);
    }
    await this.syncWithBackend(this.getCollections(), header);
  },

  saveCollectionsLocally(collections: HomeCollectionItem[]): void {
    if (typeof window === "undefined") return;
    try {
      const sorted = collections.map((item, idx) => ({ ...item, order: idx + 1 }));
      cachedCollections = sorted;
      cachedActiveCollections = sorted.filter((item) => item.active);
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(sorted));
      window.dispatchEvent(
        new CustomEvent(COLLECTIONS_EVENT, {
          detail: { collections: sorted, header: this.getSectionHeader() },
        })
      );
    } catch (e) {
      console.error("Erro ao salvar coleções localmente:", e);
    }
  },

  async saveCollections(collections: HomeCollectionItem[]): Promise<void> {
    this.saveCollectionsLocally(collections);
    await this.syncWithBackend(collections, this.getSectionHeader());
  },

  addCollection(item: Omit<HomeCollectionItem, "id" | "order">): HomeCollectionItem {
    const current = this.getCollections();
    const newItem: HomeCollectionItem = {
      ...item,
      id: "collection-" + Date.now(),
      order: current.length + 1,
    };
    const updated = [...current, newItem];
    this.saveCollections(updated);
    return newItem;
  },

  updateCollection(id: string, updates: Partial<Omit<HomeCollectionItem, "id">>): void {
    const current = this.getCollections();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    this.saveCollections(updated);
  },

  deleteCollection(id: string): void {
    const current = this.getCollections();
    const updated = current.filter((item) => item.id !== id);
    this.saveCollections(updated);
  },

  toggleActive(id: string): void {
    const current = this.getCollections();
    const updated = current.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    this.saveCollections(updated);
  },

  reorderCollections(reordered: HomeCollectionItem[]): void {
    this.saveCollections(reordered);
  },

  resetToDefaults(): void {
    this.saveCollections(DEFAULT_COLLECTIONS);
    this.saveSectionHeader(DEFAULT_SECTION_HEADER);
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = () => {
      const cols = readCollectionsFromStorage();
      cachedCollections = cols;
      cachedActiveCollections = cols.filter((item) => item.active);
      cachedHeader = readHeaderFromStorage();
      callback();
    };

    window.addEventListener(COLLECTIONS_EVENT, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(COLLECTIONS_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },

  onUpdate(
    callback: (data: {
      collections: HomeCollectionItem[];
      header: CollectionsSectionHeader;
    }) => void
  ): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        collections: HomeCollectionItem[];
        header: CollectionsSectionHeader;
      }>;
      callback(
        customEvent.detail || {
          collections: this.getCollections(),
          header: this.getSectionHeader(),
        }
      );
    };

    window.addEventListener(COLLECTIONS_EVENT, handler);
    return () => window.removeEventListener(COLLECTIONS_EVENT, handler);
  },
};
