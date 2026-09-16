export type ReportPeriod = "today" | "7days" | "30days" | "month" | "year" | "all";

export interface SalesKPIs {
  totalRevenue: number;
  revenueGrowth: number; // Porcentagem de crescimento vs período anterior
  totalOrders: number;
  ordersGrowth: number;
  averageTicket: number;
  topSellingProduct: {
    name: string;
    quantity: number;
    revenue: number;
  };
  criticalStockCount: number;
}

export interface ProductSalesReport {
  id: number;
  name: string;
  categoryName: string;
  unitsSold: number;
  unitPrice: number;
  totalRevenue: number;
  revenueShare: number; // % do faturamento total
  cumulativeShare: number; // % acumulada para Curva ABC
  abcClassification: "A" | "B" | "C"; // A: 80%, B: 15%, C: 5%
  stockQuantity: number;
  stockStatus: "normal" | "warning" | "critical" | "out_of_stock";
  daysOfStockRemaining: number;
}

export interface CategorySalesReport {
  categoryName: string;
  unitsSold: number;
  totalRevenue: number;
  percentage: number;
  averageTicket: number;
}

export interface SalesTimeSeriesPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface CustomerReportData {
  totalCustomers: number;
  newCustomersPercentage: number;
  recurringCustomersPercentage: number;
  matrizSalesPercentage: number;
  shoppingSalesPercentage: number;
}

export interface FullReportData {
  period: ReportPeriod;
  kpis: SalesKPIs;
  timeSeries: SalesTimeSeriesPoint[];
  productRanking: ProductSalesReport[];
  categoryBreakdown: CategorySalesReport[];
  customerMetrics: CustomerReportData;
}
