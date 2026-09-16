"use client";

import { useState, useEffect } from "react";
import { reportService } from "@/services/reportService";
import { FullReportData, ReportPeriod } from "@/types/reports";

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const report = isClient ? reportService.generateReport(period, products) : null;

  if (!isClient || !report) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-brand-green-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-brand-dark-600 font-body-md text-sm">Calculando métricas e relatórios...</p>
      </div>
    );
  }

  // Filtragem na tabela
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
          <div className="flex items-center gap-2 text-brand-green-800 mb-1">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
            <span className="font-label-sm uppercase tracking-widest text-xs font-bold">Business Intelligence</span>
          </div>
          <h2 className="font-display-lg text-2xl md:text-3xl text-brand-dark-950 font-bold">
            Relatórios Estratégicos & Vendas
          </h2>
          <p className="font-body-md text-brand-dark-600 text-sm mt-1">
            Análise aprofundada de receita, curva ABC de produtos, giro de estoque e comportamento de clientes.
          </p>
        </div>

        {/* Controles de Período & Exportação */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Período */}
          <div className="bg-brand-dark-100 p-1 rounded-xl flex items-center gap-1 border border-brand-dark-200">
            {[
              { label: "Hoje", value: "today" },
              { label: "7 Dias", value: "7days" },
              { label: "30 Dias", value: "30days" },
              { label: "Mês", value: "month" },
              { label: "Ano", value: "year" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value as ReportPeriod)}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-sm uppercase tracking-wider font-bold transition-all ${
                  period === p.value
                    ? "bg-white text-brand-green-900 shadow-sm"
                    : "text-brand-dark-600 hover:text-brand-dark-950"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Botões de Exportar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => reportService.exportToCSV(report)}
              className="px-4 py-2.5 bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-900 rounded-xl font-label-sm text-xs uppercase tracking-wider border border-brand-green-300 font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Baixar planilha compatível com Excel"
            >
              <span className="material-symbols-outlined text-[18px]">table_view</span>
              Exportar CSV
            </button>

            <button
              onClick={() => reportService.printPDFReport()}
              className="px-4 py-2.5 bg-brand-dark-900 hover:bg-brand-dark-800 text-white rounded-xl font-label-sm text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 shadow-sm"
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
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden">
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
            <span>+{report.kpis.revenueGrowth}% vs. período anterior</span>
          </div>
        </div>

        {/* KPI 2: Total de Pedidos */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden">
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
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+{report.kpis.ordersGrowth}% no ritmo</span>
          </div>
        </div>

        {/* KPI 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden">
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
            Média por pedido fechado
          </div>
        </div>

        {/* KPI 4: Top Produto */}
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Produto Mais Vendido
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
        <div className="bg-white p-5 rounded-2xl border border-brand-dark-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-label-sm uppercase tracking-wider text-brand-dark-500 font-bold">
              Ruptura de Estoque
            </span>
            <span className={`p-2 rounded-xl ${report.kpis.criticalStockCount > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
          </div>
          <div className={`text-2xl font-display-lg font-bold ${report.kpis.criticalStockCount > 0 ? "text-red-700" : "text-emerald-700"}`}>
            {report.kpis.criticalStockCount} <span className="text-sm font-body-md text-brand-dark-400 font-normal">itens</span>
          </div>
          <div className="mt-2 text-xs font-body-md text-brand-dark-500">
            {report.kpis.criticalStockCount > 0 ? "Requer reposição urgente" : "Estoque 100% equilibrado"}
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
                Desempenho distribuído ao longo do período selecionado
              </p>
            </div>
            <span className="text-xs font-label-sm text-brand-green-800 bg-brand-green-50 px-2.5 py-1 rounded-full border border-brand-green-200 font-bold">
              Tendência Positiva
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
                      {Math.round(item.revenue / 1000)}k
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
              Participação de cada linha de produtos na receita
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
                      className={`h-full rounded-full ${
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
              Classificação: <strong className="text-emerald-800">Classe A (80% da receita)</strong>,{" "}
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
              className="px-3 py-2 text-xs bg-brand-dark-50 border border-brand-dark-300 rounded-xl focus:outline-none focus:border-brand-green-800 text-brand-dark-900"
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
                <th className="py-3 px-3 text-center">Estoque</th>
                <th className="py-3 px-3 text-center">Previsão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark-100 text-brand-dark-800">
              {filteredProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-brand-green-50/40 transition-colors">
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
            <span className="text-xs uppercase tracking-wider text-brand-dark-500 font-bold block">Base de Clientes Ativos</span>
            <span className="text-2xl font-bold font-display-lg text-brand-dark-950">{report.customerMetrics.totalCustomers}</span>
            <span className="text-xs text-brand-dark-500 block">Compradores no período</span>
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
