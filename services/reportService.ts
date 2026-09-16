import { FullReportData, ReportPeriod, ProductSalesReport, CategorySalesReport, SalesTimeSeriesPoint } from "@/types/reports";

interface ProductInput {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  categoryName?: string;
}

// Catálogo base de produtos e vendas simuladas calibradas para o perfil de Velas São João
const BASE_PRODUCTS = [
  { id: 1, name: "Vela Votiva 7 Dias Tradicional", categoryName: "Velas Religiosas", price: 18.90, stockQuantity: 120, baseSales: 450 },
  { id: 2, name: "Vela Nossa Senhora de Nazaré (Círio)", categoryName: "Velas Religiosas", price: 34.90, stockQuantity: 45, baseSales: 380 },
  { id: 3, name: "Vela Aromática Canela & Especiarias", categoryName: "Velas Aromáticas", price: 29.90, stockQuantity: 28, baseSales: 290 },
  { id: 4, name: "Vela Aromática Lavanda e Alecrim", categoryName: "Velas Aromáticas", price: 32.50, stockQuantity: 14, baseSales: 260 },
  { id: 5, name: "Vela Cilíndrica Artesanal Marfim 15cm", categoryName: "Velas Decorativas", price: 42.00, stockQuantity: 3, baseSales: 210 },
  { id: 6, name: "Vela Decorativa Rústica Canelada", categoryName: "Velas Decorativas", price: 49.90, stockQuantity: 18, baseSales: 175 },
  { id: 7, name: "Sebo de Holanda Artesanal 100g", categoryName: "Sebo de Holanda", price: 22.00, stockQuantity: 85, baseSales: 160 },
  { id: 8, name: "Vela São Jorge Guerreiro Vermelha", categoryName: "Velas Religiosas", price: 24.50, stockQuantity: 0, baseSales: 140 },
  { id: 9, name: "Vela Aromática Baunilha de Madagascar", categoryName: "Velas Aromáticas", price: 35.00, stockQuantity: 6, baseSales: 110 },
  { id: 10, name: "Sebo de Holanda Puro em Barra 250g", categoryName: "Sebo de Holanda", price: 45.00, stockQuantity: 32, baseSales: 95 },
  { id: 11, name: "Vela Piramidal Dourada Festiva", categoryName: "Velas Decorativas", price: 58.00, stockQuantity: 15, baseSales: 60 },
  { id: 12, name: "Vela Pequena Réchaud (Kit com 10)", categoryName: "Velas Decorativas", price: 15.00, stockQuantity: 90, baseSales: 50 },
];

export const reportService = {
  /**
   * Gera o relatório completo com base no período e produtos disponíveis
   */
  generateReport(period: ReportPeriod = "month", liveProducts: ProductInput[] = []): FullReportData {
    // Multiplicador de escala conforme o período selecionado
    let periodMultiplier = 1;
    let timeSeriesPoints: SalesTimeSeriesPoint[] = [];

    switch (period) {
      case "today":
        periodMultiplier = 0.04;
        timeSeriesPoints = [
          { label: "08h-10h", revenue: 420, orders: 8 },
          { label: "10h-12h", revenue: 1150, orders: 22 },
          { label: "12h-14h", revenue: 890, orders: 16 },
          { label: "14h-16h", revenue: 1420, orders: 28 },
          { label: "16h-18h", revenue: 1680, orders: 34 },
          { label: "18h-20h", revenue: 980, orders: 19 },
        ];
        break;
      case "7days":
        periodMultiplier = 0.28;
        timeSeriesPoints = [
          { label: "Segunda", revenue: 3200, orders: 58 },
          { label: "Terça", revenue: 3850, orders: 64 },
          { label: "Quarta", revenue: 4100, orders: 72 },
          { label: "Quinta", revenue: 4600, orders: 80 },
          { label: "Sexta", revenue: 6200, orders: 110 },
          { label: "Sábado", revenue: 7800, orders: 135 },
          { label: "Domingo", revenue: 3400, orders: 52 },
        ];
        break;
      case "30days":
      case "month":
        periodMultiplier = 1.0;
        timeSeriesPoints = [
          { label: "Semana 1", revenue: 18450, orders: 310 },
          { label: "Semana 2", revenue: 21300, orders: 365 },
          { label: "Semana 3", revenue: 24800, orders: 420 },
          { label: "Semana 4", revenue: 26950, orders: 460 },
        ];
        break;
      case "year":
      case "all":
        periodMultiplier = 11.5;
        timeSeriesPoints = [
          { label: "Jan", revenue: 58000, orders: 1050 },
          { label: "Fev", revenue: 62400, orders: 1120 },
          { label: "Mar", revenue: 68900, orders: 1210 },
          { label: "Abr", revenue: 74500, orders: 1340 },
          { label: "Mai", revenue: 81200, orders: 1450 },
          { label: "Jun", revenue: 89000, orders: 1600 },
          { label: "Jul", revenue: 83400, orders: 1480 },
          { label: "Ago", revenue: 91500, orders: 1640 },
          { label: "Set", revenue: 98000, orders: 1750 },
          { label: "Out (Círio)", revenue: 185000, orders: 3200 },
          { label: "Nov", revenue: 110000, orders: 1950 },
          { label: "Dez (Natal)", revenue: 165000, orders: 2900 },
        ];
        break;
    }

    // Mescla produtos do banco com o catálogo padrão para obter preços/estoques em tempo real
    const mergedList = BASE_PRODUCTS.map((base) => {
      const live = liveProducts.find((p) => p.name.toLowerCase() === base.name.toLowerCase() || p.id === base.id);
      return {
        id: live?.id || base.id,
        name: live?.name || base.name,
        categoryName: live?.categoryName || base.categoryName,
        price: Number(live?.price) || base.price,
        stockQuantity: typeof live?.stockQuantity === "number" ? live.stockQuantity : base.stockQuantity,
        unitsSold: Math.max(1, Math.round(base.baseSales * periodMultiplier)),
      };
    });

    // Se houver produtos criados recentemente que não estão no base, adiciona com estimativa
    liveProducts.forEach((live) => {
      if (!mergedList.some((m) => m.id === live.id)) {
        mergedList.push({
          id: live.id,
          name: live.name,
          categoryName: live.categoryName || "Geral",
          price: Number(live.price) || 25,
          stockQuantity: live.stockQuantity || 10,
          unitsSold: Math.max(1, Math.round(35 * periodMultiplier)),
        });
      }
    });

    // 1. Calcula o Faturamento por Produto
    const withRevenue = mergedList.map((p) => {
      const totalRevenue = p.unitsSold * p.price;
      return {
        ...p,
        totalRevenue,
      };
    });

    // Ordena do maior faturamento para o menor (essencial para a Curva ABC)
    withRevenue.sort((a, b) => b.totalRevenue - a.totalRevenue);

    const grandTotalRevenue = withRevenue.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    const grandTotalUnits = withRevenue.reduce((acc, curr) => acc + curr.unitsSold, 0);

    // 2. Calcula Participação Percentual e Curva ABC
    let runningCumulativeRevenue = 0;
    let criticalCount = 0;

    const productRanking: ProductSalesReport[] = withRevenue.map((p) => {
      runningCumulativeRevenue += p.totalRevenue;
      const revenueShare = (p.totalRevenue / (grandTotalRevenue || 1)) * 100;
      const cumulativeShare = (runningCumulativeRevenue / (grandTotalRevenue || 1)) * 100;

      // Classificação Curva ABC
      let abcClassification: "A" | "B" | "C" = "C";
      if (cumulativeShare <= 80 || revenueShare >= 15) {
        abcClassification = "A";
      } else if (cumulativeShare <= 95) {
        abcClassification = "B";
      } else {
        abcClassification = "C";
      }

      // Status do Estoque e Previsão de Término (Dias de Cobertura)
      const dailyConsumption = Math.max(0.2, p.unitsSold / (period === "today" ? 1 : period === "7days" ? 7 : 30));
      const daysOfStockRemaining = Math.round(p.stockQuantity / dailyConsumption);

      let stockStatus: "normal" | "warning" | "critical" | "out_of_stock" = "normal";
      if (p.stockQuantity <= 0) {
        stockStatus = "out_of_stock";
        criticalCount++;
      } else if (p.stockQuantity < 5 || daysOfStockRemaining < 3) {
        stockStatus = "critical";
        criticalCount++;
      } else if (p.stockQuantity < 15 || daysOfStockRemaining < 7) {
        stockStatus = "warning";
      }

      return {
        id: p.id,
        name: p.name,
        categoryName: p.categoryName,
        unitsSold: p.unitsSold,
        unitPrice: p.price,
        totalRevenue: p.totalRevenue,
        revenueShare: Number(revenueShare.toFixed(1)),
        cumulativeShare: Number(cumulativeShare.toFixed(1)),
        abcClassification,
        stockQuantity: p.stockQuantity,
        stockStatus,
        daysOfStockRemaining,
      };
    });

    // 3. Agrupamento por Categoria
    const categoryMap = new Map<string, { units: number; revenue: number; ordersCount: number }>();

    productRanking.forEach((p) => {
      const cat = p.categoryName || "Outros";
      const curr = categoryMap.get(cat) || { units: 0, revenue: 0, ordersCount: 0 };
      curr.units += p.unitsSold;
      curr.revenue += p.totalRevenue;
      curr.ordersCount += Math.round(p.unitsSold * 0.7);
      categoryMap.set(cat, curr);
    });

    const categoryBreakdown: CategorySalesReport[] = Array.from(categoryMap.entries()).map(
      ([categoryName, data]) => ({
        categoryName,
        unitsSold: data.units,
        totalRevenue: data.revenue,
        percentage: Number(((data.revenue / (grandTotalRevenue || 1)) * 100).toFixed(1)),
        averageTicket: Number((data.revenue / (data.ordersCount || 1)).toFixed(2)),
      })
    );

    categoryBreakdown.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // 4. Totais e KPIs
    const totalOrders = Math.round(grandTotalUnits * 0.65);
    const averageTicket = grandTotalRevenue / (totalOrders || 1);
    const topProd = productRanking[0] || { name: "Nenhum", unitsSold: 0, totalRevenue: 0 };

    return {
      period,
      kpis: {
        totalRevenue: grandTotalRevenue,
        revenueGrowth: 14.8, // +14.8% no período
        totalOrders,
        ordersGrowth: 11.2,
        averageTicket,
        topSellingProduct: {
          name: topProd.name,
          quantity: topProd.unitsSold,
          revenue: topProd.totalRevenue,
        },
        criticalStockCount: criticalCount,
      },
      timeSeries: timeSeriesPoints,
      productRanking,
      categoryBreakdown,
      customerMetrics: {
        totalCustomers: Math.round(totalOrders * 0.82),
        newCustomersPercentage: 42,
        recurringCustomersPercentage: 58,
        matrizSalesPercentage: 54,
        shoppingSalesPercentage: 46,
      },
    };
  },

  /**
   * Exporta a tabela de vendas e produtos em formato CSV para Excel
   */
  exportToCSV(report: FullReportData): void {
    const headers = [
      "Ranking",
      "Produto",
      "Categoria",
      "Qtd Vendida",
      "Preco Unitario (R$)",
      "Receita Total (R$)",
      "Participacao (%)",
      "Curva ABC",
      "Estoque Atual",
      "Status Estoque",
      "Dias de Cobertura",
    ];

    const rows = report.productRanking.map((p, idx) => [
      idx + 1,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categoryName}"`,
      p.unitsSold,
      p.unitPrice.toFixed(2),
      p.totalRevenue.toFixed(2),
      `${p.revenueShare}%`,
      p.abcClassification,
      p.stockQuantity,
      p.stockStatus.toUpperCase(),
      p.daysOfStockRemaining,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_vendas_velassaojoao_${report.period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Aciona a impressão do relatório executivo em PDF
   */
  printPDFReport(): void {
    window.print();
  },
};
