export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  categoryName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone?: string;
  deliveryNotes?: string;
  storeLocation: "matriz" | "filial" | string;
  totalAmount: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED" | string;
  createdAt: string;
  userEmail?: string | null;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone?: string;
  deliveryNotes?: string;
  storeLocation: "matriz" | "filial" | string;
  totalAmount: number;
  userEmail?: string;
  items: {
    productId: number;
    productName: string;
    categoryName?: string;
    quantity: number;
    unitPrice: number;
  }[];
}
