"use client";

import { useState, useEffect, useCallback } from "react";
import { reportService } from "@/services/reportService";
import { orderService } from "@/services/orderService";
import { FullReportData, ReportPeriod } from "@/types/reports";
import { Order } from "@/types/orders";

interface Props {
  products?: Array<{
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
    categoryName?: string;
  }>;
}

export default function AdminReportsDashboard({ products = [] }: Props) {
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromDatabase, setIsFromDatabase] = useState(false);
  const [isCreatingTestOrder, setIsCreatingTestOrder] = useState(false);
  const [showRecentOrdersTable, setShowRecentOrdersTable] = useState(true);

  // Função centralizada para carregar pedidos do banco de dados
  const fetchOrders = useCallback(async (currentPeriod?: ReportPeriod) => {
    setIsLoading(true);
    try {
      const result = await orderService.getOrders(currentPeriod || period);
      setOrders(result.orders);
      setIsFromDatabase(result.isFromDatabase);
    } catch (err) {
      console.error("Erro ao carregar pedidos do banco de dados:", err);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    fetchOrders(period);

    // Inscrição reativa para atualizar métricas automaticamente quando novos pedidos forem feitos
    const unsubscribe = orderService.subscribe(() => {
      fetchOrders(period);
    });

    return () => unsubscribe();
  }, [fetchOrders, period]);

  // Dispara novo cálculo quando o período ou a lista de pedidos muda
  const report: FullReportData | null = isClient
    ? reportService.generateReport(period, products, orders, isFromDatabase)
    : null;

  // Cria um pedido de teste rápido no banco de dados para demonstrar a reatividade ao vivo
  const handleCreateTestOrder = async () => {
    setIsCreatingTestOrder(true);
    try {
      const randomProducts = products.length > 0 ? products : [
        { id: 1, name: "Vela 7 dias Branca", price: 10.0, stockQuantity: 50, categoryName: "Classicas" },
        { id: 2, name: "Vela Lavanda", price: 20.0, stockQuantity: 30, categoryName: "Aromaticas" },
        { id: 3, name: "Porta Velas", price: 35.0, stockQuantity: 20, categoryName: "Decoracao" },
      ];

      const sampleProduct = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const sampleProduct2 = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const qty1 = Math.floor(Math.random() * 3) + 1;
      const qty2 = Math.floor(Math.random() * 2) + 1;
      const total = sampleProduct.price * qty1 + (sampleProduct.id !== sampleProduct2.id ? sampleProduct2.price * qty2 : 0);

      const clients = [
        "Benedita do Carmo",
        "Raimundo Nonato",
        "Tereza de Fátima",
        "João Bosco",
        "Socorro Alencar",
      ];
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const store = Math.random() > 0.5 ? "matriz" : "filial";

      const items = [
        {
          productId: sampleProduct.id,
          productName: sampleProduct.name,
          categoryName: sampleProduct.categoryName || "Geral",
          quantity: qty1,
          unitPrice: sampleProduct.price,
        },
      ];

      if (sampleProduct.id !== sampleProduct2.id) {
        items.push({
          productId: sampleProduct2.id,
          productName: sampleProduct2.name,
          categoryName: sampleProduct2.categoryName || "Geral",
          quantity: qty2,
          unitPrice: sampleProduct2.price,
        });
      }

      await orderService.createOrder({
        customerName: randomClient,
        customerPhone: "9199" + Math.floor(1000000 + Math.random() * 9000000),
        deliveryNotes: "Pedido teste inserido pelo painel de Analytics",
        storeLocation: store,
        totalAmount: total,
        items,
      });

      await fetchOrders(period);
    } catch (e) {
      console.error("Erro ao criar pedido de teste:", e);
    } finally {
      setIsCreatingTestOrder(false);
    }
  };

  if (!isClient || !report) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-brand-dark-200 shadow-sm">
        <div className="w-10 h-10 border-4 border-brand-green-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-brand-dark-600 font-body-md text-sm font-semibold">
          Conectando ao banco de dados e calculando métricas em tempo real...
        </p>
      </div>
    );
  }

  // Filtragem na tabela Curva ABC
  const filteredProducts = report.productRanking.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.categoryName === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoriesList = Array.from(new Set(report.productRanking.map((p) => p.categoryName)));

  // Calcula o valor máximo para a escala do gráfico
  const maxTimeSeriesRevenue = Math.max(...report.timeSeries.map((t) => t.revenue), 1);

  return (
    <div className="space-y-8 animate-fadeIn printable-report">
      {/* Barra de Filtros & Ações de Exportação */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-brand-dark-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-brand-green-800 mb-1">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
            <span className="font-label-sm uppercase tracking-widest text-xs font-bold">Business Intelligence</span>
            
            {/* Status do Banco de Dados Neon */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                report.isRealDatabaseData
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
              title="Origem dos dados apresentados neste painel"
            >
              <span className={`w-2 h-2 rounded-full ${report.isRealDatabaseData ? "bg-emerald-600 animate-pulse" : "bg-amber-500"}`}></span>
              <span>{report.databaseSource || "PostgreSQL Neon"} ({orders.length} pedidos)</span>
            </span>
          </div>

          <h2 className="font-display-lg text-2xl md:text-3xl text-brand-dark-950 font-bold">
            Relatórios Estratégicos & Vendas
          </h2>
          <p className="font-body-md text-brand-dark-600 text-sm mt-1">
            Painel alimentado diretamente pelos pedidos armazenados no banco de dados, com análise de faturamento, giro e curva ABC.
          </p>
        </div>

        {/* Controles de Período, Atualização & Exportação */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Período */}
          <div className="bg-brand-dark-100 p-1 rounded-xl flex items-center gap-1 border border-brand-dark-200">
            {[
              { label: "Hoje", value: "today" },
              { label: "7 Dias", value: "7days" },
              { label: "30 Dias", value: "30days" },
              { label: "Mês", value: "month" },
              { label: "Ano", value: "year" },
              { label: "Tudo", value: "all" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  const newPeriod = p.value as ReportPeriod;
                  setPeriod(newPeriod);
                  fetchOrders(newPeriod);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-sm uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  period === p.value
                    ? "bg-white text-brand-green-900 shadow-sm"
                    : "text-brand-dark-600 hover:text-brand-dark-950"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Botão de Sincronizar / Atualizar em Tempo Real */}
          <button
            onClick={() => fetchOrders(period)}
            disabled={isLoading}
            className="p-2.5 bg-brand-dark-50 hover:bg-brand-dark-100 text-brand-dark-700 rounded-xl border border-brand-dark-200 transition-colors shadow-xs cursor-pointer flex items-center justify-center disabled:opacity-50"
            title="Atualizar dados do banco em tempo real"
          >
            <span className={`material-symbols-outlined text-[20px] ${isLoading ? "animate-spin text-brand-green-800" : ""}`}>
              sync
            </span>
          </button>

          {/* Botão Injetar Pedido Teste */}
          <button
            onClick={handleCreateTestOrder}
            disabled={isCreatingTestOrder}
            className="px-3 py-2 bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-900 rounded-xl font-label-sm text-xs uppercase tracking-wider border border-brand-green-300 font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Insere um pedido de teste no banco para ver o recálculo ao vivo"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            {isCreatingTestOrder ? "Salvando..." : "+ Pedido Teste"}
          </button>

          {/* Botões de Exportar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => reportService.exportToCSV(report)}
              className="px-3.5 py-2.5 bg-white hover:bg-brand-dark-50 text-brand-dark-800 rounded-xl font-label-sm text-xs uppercase tracking-wider border border-brand-dark-300 font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Baixar planilha compatível com Excel"
            >
              <span className="material-symbols-outlined text-[18px]">table_view</span>
              Exportar CSV
            </button>

            <button
              onClick={() => reportService.printPDFReport()}
              className="px-4 py-2.5 bg-brand-dark-900 hover:bg-brand-dark-800 text-white rounded-xl font-label-sm text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Visualizar para impressão ou salvar em PDF"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Relatório PDF
            </button>
          </div>
        </div>
      </div>

      {/* 5 Cards de KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Faturamento */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Receita Total
            </span>
            <span className="p-2 bg-brand-green-100 text-brand-green-900 rounded-xl">
              <span className="material-symbols-outlined text-[20px]">attach_money</span>
            </span>
          </div>
          <div className="text-2xl font-display-lg font-bold text-brand-green-900">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(report.kpis.totalRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-label-sm text-emerald-700 font-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+{report.kpis.revenueGrowth}% no ritmo atual</span>
          </div>
        </div>

        {/* KPI 2: Total de Pedidos */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Pedidos Realizados
            </span>
            <span className="p-2 bg-brand-dark-100 text-brand-dark-800 rounded-xl">
              <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
            </span>
          </div>
          <div className="text-2xl font-display-lg font-bold text-brand-dark-950">
            {report.kpis.totalOrders} <span className="text-sm font-body-md text-brand-dark-400 font-normal">pedidos</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-label-sm text-emerald-700 font-bold">
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>Registrados no banco</span>
          </div>
        </div>

        {/* KPI 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Ticket Médio
            </span>
            <span className="p-2 bg-amber-50 text-amber-800 rounded-xl">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </span>
          </div>
          <div className="text-2xl font-display-lg font-bold text-brand-dark-950">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(report.kpis.averageTicket)}
          </div>
          <div className="mt-2 text-xs font-body-md text-brand-dark-500">
            Média por pedido concluído
          </div>
        </div>

        {/* KPI 4: Top Produto */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Produto Campeão
            </span>
            <span className="p-2 bg-accent-gold/20 text-accent-gold-hover rounded-xl">
              <span className="material-symbols-outlined text-[20px]">emoji_events</span>
            </span>
          </div>
          <div className="text-sm font-display-lg font-bold text-brand-dark-950 truncate" title={report.kpis.topSellingProduct.name}>
            {report.kpis.topSellingProduct.name}
          </div>
          <div className="mt-2 text-xs font-label-sm text-brand-green-800 font-bold">
            {report.kpis.topSellingProduct.quantity} un. ({new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(report.kpis.topSellingProduct.revenue)})
          </div>
        </div>

        {/* KPI 5: Alerta de Estoque Crítico */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Alerta de Estoque
            </span>
            <span className={`p-2 rounded-xl ${report.kpis.criticalStockCount > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
          </div>
          <div className={`text-2xl font-display-lg font-bold ${report.kpis.criticalStockCount > 0 ? "text-red-700" : "text-emerald-700"}`}>
            {report.kpis.criticalStockCount} <span className="text-sm font-body-md text-brand-dark-400 font-normal">itens</span>
          </div>
          <div className="mt-2 text-xs font-body-md text-brand-dark-500">
            {report.kpis.criticalStockCount > 0 ? "Requer reposição na fábrica" : "Estoque 100% equilibrado"}
          </div>
        </div>
      </div>

      {/* Grid: Gráfico de Vendas + Desempenho por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolução Temporal */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-brand-dark-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display-lg text-xl text-brand-dark-950 font-bold">
                Evolução do Faturamento & Pedidos
              </h3>
              <p className="font-body-md text-brand-dark-500 text-xs mt-0.5">
                Distribuição temporal dos pedidos registrados no banco de dados
              </p>
            </div>
            <span className="text-xs font-label-sm text-brand-green-800 bg-brand-green-50 px-2.5 py-1 rounded-full border border-brand-green-200 font-bold">
              Dados em Tempo Real
            </span>
          </div>

          {/* Gráfico de Barras Customizado Responsivo */}
          <div className="h-64 flex items-end gap-3 md:gap-6 pt-8 pb-2 border-b border-brand-dark-200">
            {report.timeSeries.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.revenue / maxTimeSeriesRevenue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip Hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark-950 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 font-label-sm">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.revenue)}
                    <span className="block text-brand-dark-300 text-[10px]">{item.orders} pedidos</span>
                  </div>

                  {/* Barra do Gráfico */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-brand-green-900 to-brand-green-600 rounded-t-xl group-hover:from-brand-green-800 group-hover:to-accent-gold transition-all duration-300 relative shadow-sm"
                  >
                    <div className="absolute top-1 left-0 right-0 text-center text-[10px] text-white/90 font-bold hidden md:block">
                      {item.revenue >= 1000 ? `${Math.round(item.revenue / 1000)}k` : `${item.revenue}`}
                    </div>
                  </div>

                  {/* Rótulo Eixo X */}
                  <span className="text-[11px] font-label-sm text-brand-dark-600 mt-2 text-center truncate max-w-full font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desempenho por Categoria / Coleção */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-brand-dark-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display-lg text-xl text-brand-dark-950 font-bold mb-1">
              Vendas por Categoria
            </h3>
            <p className="font-body-md text-brand-dark-500 text-xs mb-6">
              Participação de cada linha de produtos nos pedidos faturados
            </p>

            <div className="space-y-4">
              {report.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-label-sm">
                    <span className="text-brand-dark-900 font-bold">{cat.categoryName}</span>
                    <span className="text-brand-green-900 font-bold">{cat.percentage}%</span>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full h-2.5 bg-brand-dark-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? "bg-brand-green-900"
                          : idx === 1
                          ? "bg-brand-green-700"
                          : idx === 2
                          ? "bg-accent-gold"
                          : "bg-brand-dark-500"
                      }`}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-brand-dark-500">
                    <span>{cat.unitsSold} unidades vendidas</span>
                    <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cat.totalRevenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dados de Canais e Lojas */}
          <div className="pt-5 border-t border-brand-dark-200 mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="bg-brand-green-50 p-2.5 rounded-xl border border-brand-green-200">
              <span className="block text-[11px] uppercase tracking-wider text-brand-dark-500 font-bold">Loja Matriz</span>
              <span className="text-base font-bold text-brand-green-900">{report.customerMetrics.matrizSalesPercentage}%</span>
            </div>
            <div className="bg-brand-dark-50 p-2.5 rounded-xl border border-brand-dark-200">
              <span className="block text-[11px] uppercase tracking-wider text-brand-dark-500 font-bold">Loja Shopping</span>
              <span className="text-base font-bold text-brand-dark-950">{report.customerMetrics.shoppingSalesPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* NOVA SEÇÃO: Últimos Pedidos Registrados no Banco de Dados */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-brand-dark-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-green-800 text-[22px]">receipt</span>
              <h3 className="font-display-lg text-xl text-brand-dark-950 font-bold">
                Pedidos Registrados no Banco de Dados
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                {orders.length} pedidos totais
              </span>
            </div>
            <p className="font-body-md text-brand-dark-500 text-xs mt-0.5">
              Histórico persistido em tempo real no PostgreSQL (Neon Cloud) a partir do checkout dos clientes
            </p>
          </div>

          <button
            onClick={() => setShowRecentOrdersTable(!showRecentOrdersTable)}
            className="text-xs font-label-sm font-bold text-brand-green-900 hover:text-brand-green-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{showRecentOrdersTable ? "Ocultar Pedidos" : "Visualizar Pedidos"}</span>
            <span className="material-symbols-outlined text-[18px]">
              {showRecentOrdersTable ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>

        {showRecentOrdersTable && (
          <div className="overflow-x-auto pt-2">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-brand-dark-500 bg-brand-dark-50/50 rounded-xl border border-dashed border-brand-dark-200">
                <span className="material-symbols-outlined text-4xl text-brand-dark-400 mb-2">inbox</span>
                <p className="text-sm font-semibold">Nenhum pedido registrado ainda no banco de dados.</p>
                <p className="text-xs text-brand-dark-400 mt-1">
                  Clique no botão &quot;+ Pedido Teste&quot; acima para registrar um pedido imediatamente e ver o painel atualizar ao vivo!
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-body-md">
                <thead>
                  <tr className="border-b border-brand-dark-200 text-brand-dark-500 uppercase font-label-sm text-[11px] tracking-wider bg-brand-dark-50/50">
                    <th className="py-3 px-3"># ID</th>
                    <th className="py-3 px-3">Data / Hora</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-3">Unidade</th>
                    <th className="py-3 px-4">Itens do Pedido</th>
                    <th className="py-3 px-3 text-right">Valor Total</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-dark-100 text-brand-dark-800">
                  {orders.slice(0, 8).map((order) => {
                    const formattedDate = order.createdAt
                      ? new Date(order.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recente";

                    return (
                      <tr key={order.id} className="hover:bg-brand-green-50/30 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-brand-dark-700">
                          #{order.id}
                        </td>
                        <td className="py-3.5 px-3 text-brand-dark-500 whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-brand-dark-950">
                          <div>{order.customerName}</div>
                          {order.customerPhone && (
                            <div className="text-[10px] text-brand-dark-400 font-normal">{order.customerPhone}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              (order.storeLocation || "").toLowerCase().includes("matriz")
                                ? "bg-brand-green-100 text-brand-green-900"
                                : "bg-purple-100 text-purple-900"
                            }`}
                          >
                            {order.storeLocation || "Matriz"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-brand-dark-700 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="bg-brand-dark-100 text-brand-dark-800 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap font-medium"
                                  title={`${item.quantity}x ${item.productName}`}
                                >
                                  {item.quantity}x {item.productName}
                                </span>
                              ))
                            ) : (
                              <span className="text-brand-dark-400">1 item</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-brand-green-900 whitespace-nowrap">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            order.totalAmount || 0
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            {order.status || "Concluído"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Relatório de Curva ABC & Ranking Detalhado */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-brand-dark-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display-lg text-xl md:text-2xl text-brand-dark-950 font-bold">
                Ranking de Produtos & Curva ABC
              </h3>
              <span className="text-xs bg-brand-green-100 text-brand-green-900 font-bold px-2.5 py-0.5 rounded-full border border-brand-green-300">
                {filteredProducts.length} itens analisados
              </span>
            </div>
            <p className="font-body-md text-brand-dark-500 text-xs mt-1">
              Classificação baseada nas vendas reais: <strong className="text-emerald-800">Classe A (80% da receita)</strong>,{" "}
              <strong className="text-amber-800">Classe B (15% da receita)</strong> e{" "}
              <strong className="text-zinc-600">Classe C (5% da receita)</strong>.
            </p>
          </div>

          {/* Filtros da Tabela */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-3.5 py-2 text-xs bg-brand-dark-50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 w-full sm:w-48"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-brand-dark-50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900 cursor-pointer"
            >
              <option value="ALL">Todas as Categorias</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body-md">
            <thead>
              <tr className="border-b border-brand-dark-200 text-brand-dark-500 uppercase font-label-sm text-[11px] tracking-wider bg-brand-dark-50/50">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-3 text-right">Qtd Vendida</th>
                <th className="py-3 px-3 text-right">Preço Unit.</th>
                <th className="py-3 px-4 text-right">Receita Total</th>
                <th className="py-3 px-3 text-right">% Receita</th>
                <th className="py-3 px-3 text-center">Curva ABC</th>
                <th className="py-3 px-3 text-center">Estoque Atual</th>
                <th className="py-3 px-3 text-center">Previsão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark-100 text-brand-dark-800">
              {filteredProducts.map((p, idx) => (
                <tr key={p.id || idx} className="hover:bg-brand-green-50/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-brand-dark-400">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-dark-950 max-w-[220px] truncate" title={p.name}>
                    {p.name}
                  </td>
                  <td className="py-3.5 px-4 text-brand-dark-600">{p.categoryName}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-brand-dark-900">{p.unitsSold} un.</td>
                  <td className="py-3.5 px-3 text-right text-brand-dark-600">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.unitPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-brand-green-900">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.totalRevenue)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-brand-dark-700">{p.revenueShare}%</td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-label-sm font-bold text-[10px] uppercase tracking-wider ${
                        p.abcClassification === "A"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : p.abcClassification === "B"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                      }`}
                    >
                      Classe {p.abcClassification}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                        p.stockStatus === "out_of_stock"
                          ? "bg-red-100 text-red-700"
                          : p.stockStatus === "critical"
                          ? "bg-red-50 text-red-600"
                          : p.stockStatus === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "text-brand-dark-800"
                      }`}
                    >
                      {p.stockQuantity} un.
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center text-[11px]">
                    {p.stockQuantity <= 0 ? (
                      <span className="text-red-600 font-bold">Esgotado</span>
                    ) : (
                      <span className={p.daysOfStockRemaining < 7 ? "text-amber-700 font-bold" : "text-brand-dark-500"}>
                        {p.daysOfStockRemaining} dias
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relatório de Fidelização e Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-brand-dark-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-green-100 text-brand-green-900 rounded-2xl">
            <span className="material-symbols-outlined text-[28px]">group</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-dark-500 font-bold block">Base de Clientes Únicos</span>
            <span className="text-2xl font-bold font-display-lg text-brand-dark-950">{report.customerMetrics.totalCustomers}</span>
            <span className="text-xs text-brand-dark-500 block">Compradores com pedidos no período</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-dark-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <span className="material-symbols-outlined text-[28px]">repeat</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-dark-500 font-bold block">Taxa de Recompra</span>
            <span className="text-2xl font-bold font-display-lg text-emerald-800">{report.customerMetrics.recurringCustomersPercentage}%</span>
            <span className="text-xs text-brand-dark-500 block">Clientes fiéis e recorrentes</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-dark-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
            <span className="material-symbols-outlined text-[28px]">person_add</span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-dark-500 font-bold block">Novos Clientes</span>
            <span className="text-2xl font-bold font-display-lg text-amber-800">{report.customerMetrics.newCustomersPercentage}%</span>
            <span className="text-xs text-brand-dark-500 block">Primeira compra na loja</span>
          </div>
        </div>
      </div>
    </div>
  );
}
