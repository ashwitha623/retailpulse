import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useDataset } from '../../hooks/useDataset';
import { getPageUrl } from '../../utils/navigation';
import { formatCompactINR } from '../../utils/formatters';
import {
  LayoutDashboard,
  LineChart,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';

/**
 * Page 1: Home Page for RetailPulse.
 */
export default function HomePage() {
  const { rawData, isLoading, loadError, kpiMetrics } = useDataset();

  const navigationCards = [
    {
      id: 'dashboard',
      title: 'Interactive Dashboard',
      subtitle: 'Executive Performance Summary',
      description: 'Explore 4 core KPIs, 5 dynamic filters, 6 interactive business charts, and real-time dynamic insights.',
      icon: LayoutDashboard,
      iconBg: 'bg-blue-50 text-[#2563EB]',
      badge: 'Core Analytics',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      actionText: 'Explore Dashboard',
      path: 'dashboard/',
    },
    {
      id: 'charts',
      title: 'Dedicated Charts',
      subtitle: 'Comparative Visualizations',
      description: 'Examine the 6 business-focused interactive charts comparing categories, sub-categories, discount levels, regions, segments, and states / locations.',
      icon: LineChart,
      iconBg: 'bg-emerald-50 text-[#16A34A]',
      badge: '6 Charts',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'View Charts',
      path: 'charts/',
    },
    {
      id: 'insights',
      title: 'Dynamic Insights',
      subtitle: 'Data-Driven Findings',
      description: 'Discover key executive findings across product categories, top-earning sub-categories, discount performance, and top states / locations.',
      icon: Lightbulb,
      iconBg: 'bg-amber-50 text-amber-600',
      badge: 'Executive Takeaways',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      actionText: 'View Insights',
      path: 'insights/',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      <Header
        currentPage="home"
        totalCount={rawData.length}
        filteredCount={rawData.length}
        isLoading={isLoading}
        error={loadError}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full space-y-12">
        
        {/* HERO SECTION */}
        <section aria-label="Project Overview" className="text-center max-w-3xl mx-auto space-y-5 pt-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            RETAILPULSE
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-600">
            E-Commerce Sales & Profit Analytics
          </p>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            RetailPulse analyzes e-commerce sales data to understand sales, profit, categories, regions, customer segments and discounts.
          </p>
        </section>

        {/* DATASET METRICS STRIP */}
        <section aria-label="Dataset Highlights" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Sales
              </span>
              <span className="text-2xl font-bold text-[#16A34A] mt-0.5">
                {kpiMetrics ? formatCompactINR(kpiMetrics.totalSales) : '₹22.04 Cr'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Portfolio Revenue</span>
            </div>

            <div className="flex flex-col items-center text-center p-2 pt-4 sm:pt-2">
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                <Percent className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Profit Margin
              </span>
              <span className="text-2xl font-bold text-[#0F172A] mt-0.5">
                {kpiMetrics ? `${kpiMetrics.profitMargin.toFixed(2)}%` : '12.47%'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Overall Portfolio</span>
            </div>

          </div>
        </section>

        {/* 3 CORE NAVIGATION CARDS */}
        <section aria-label="Explore Analytics" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
                EXPLORE ANALYTICS
              </h2>
              <p className="text-xs text-[#64748B]">
                Interactive business intelligence and reporting modules
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Core Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {navigationCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {card.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                    <a
                      href={getPageUrl(card.path)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1 transition-transform"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
