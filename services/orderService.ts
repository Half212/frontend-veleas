import { API_URL } from "@/services/apiConfig";
import { Order, CreateOrderPayload } from "@/types/orders";

const ORDERS_STORAGE_KEY = "velas_sao_joao_orders_cache_v1";
const ORDERS_EVENT = "velas_sao_joao_orders_updated";

export const orderService = {
  /**
   * Registra um novo pedido no banco de dados através da API REST
   */
  async createOrder(payload: CreateOrderPayload): Promise<Order | null> {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const order: Order = await res.json();
        this.saveOrderLocally(order);
        this.notifyChange();
        return order;
      } else {
        console.warn("Falha no status da API de pedidos:", res.status);
      }
    } catch (err) {
      console.warn("API de pedidos indisponível no momento, persistindo localmente:", err);
    }

    // Fallback: caso a API remota esteja em deploy ou offline, salva com ID temporário
    const fallbackOrder: Order = {
      id: Date.now(),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryNotes: payload.deliveryNotes,
      storeLocation: payload.storeLocation,
      totalAmount: payload.totalAmount,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      userEmail: payload.userEmail || null,
      items: payload.items.map((i, idx) => ({
        id: idx + 1,
        productId: i.productId,
        productName: i.productName,
        categoryName: i.categoryName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity,
      })),
    };

    this.saveOrderLocally(fallbackOrder);
    this.notifyChange();
    return fallbackOrder;
  },

  /**
   * Busca a lista de pedidos do banco de dados (com suporte a filtro por período)
   */
  async getOrders(period?: string): Promise<{ orders: Order[]; isFromDatabase: boolean }> {
    try {
      const url = period ? `${API_URL}/orders?period=${encodeURIComponent(period)}` : `${API_URL}/orders`;
      const res = await fetch(url, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          this.syncLocalCache(data);
          return { orders: data, isFromDatabase: true };
        }
      }
    } catch (err) {
      console.warn("Não foi possível conectar à API de pedidos, recuperando cache:", err);
    }

    const cached = this.getOrdersLocally();
    return { orders: cached, isFromDatabase: false };
  },

  /**
   * Salva pedido localmente no navegador para redundância
   */
  saveOrderLocally(order: Order): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getOrdersLocally();
      // Evita duplicatas por ID
      const filtered = current.filter((o) => o.id !== order.id);
      const updated = [order, ...filtered];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Erro ao salvar pedido em localStorage:", e);
    }
  },

  /**
   * Sincroniza dados obtidos do banco com o cache local
   */
  syncLocalCache(serverOrders: Order[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(serverOrders));
    } catch (e) {
      console.error("Erro ao sincronizar pedidos:", e);
    }
  },

  /**
   * Lê os pedidos armazenados localmente
   */
  getOrdersLocally(): Order[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Erro ao ler cache local de pedidos:", e);
    }
    return [];
  },

  /**
   * Deleta um pedido pelo ID
   */
  async deleteOrder(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        this.removeOrderLocally(id);
        this.notifyChange();
        return true;
      }
    } catch (err) {
      console.warn("Erro ao deletar pedido no backend:", err);
    }

    this.removeOrderLocally(id);
    this.notifyChange();
    return true;
  },

  removeOrderLocally(id: number): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getOrdersLocally();
      const updated = current.filter((o) => o.id !== id);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Erro ao remover pedido local:", e);
    }
  },

  notifyChange(): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(ORDERS_EVENT));
    }
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(ORDERS_EVENT, callback);
    return () => window.removeEventListener(ORDERS_EVENT, callback);
  },
};
