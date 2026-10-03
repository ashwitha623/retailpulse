import React, { useState } from 'react';
import {
  BarChart3,
  Database,
  Loader2,
  AlertCircle,
  Menu,
  X,
  Home,
  LayoutDashboard,
  LineChart,
  Lightbulb,
} from 'lucide-react';
import { NAV_ITEMS, getPageUrl } from '../utils/navigation';

/**
 * Universal Header with MPA Navigation Bar for RetailPulse.
 * Features 4 core pages: Home, Dashboard, Charts, Insights.
 */
export default function Header({
  currentPage = 'home',
  totalCount = 0,
  filteredCount = 0,
  isLoading = false,
  error = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Icon mapping for navigation items
  const getNavIcon = (id) => {
    switch (id) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'dashboard':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'charts':
        return <LineChart className="w-4 h-4" />;
      case 'insights':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <a
            href={getPageUrl('')}
            className="flex items-center space-x-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/15 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.2} />
            </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  RETAILPULSE
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 font-normal">
                  E-Commerce Sales & Profit Analytics
                </p>
              </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/90 shadow-inner"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={getPageUrl(item.path)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {getNavIcon(item.id)}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Meta Controls: Dataset Status & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            
            {/* Dataset Status Badge */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-[#0EA5E9] animate-spin" />
                  <span className="text-[11px]">Loading dataset...</span>
                </>
              ) : error ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span className="text-red-400 text-[11px]">Dataset Error</span>
                </>
              ) : totalCount > 0 ? (
                <>
                  <Database className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span className="text-[11px]">
                    Dataset:{' '}
                    <span className="font-medium text-white">
                      {filteredCount < totalCount
                        ? `${filteredCount.toLocaleString()} / ${totalCount.toLocaleString()} Rows`
                        : `${totalCount.toLocaleString()} Rows`}
                    </span>
                  </span>
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse ml-0.5"
                    title="Dataset connected and verified"
                  ></span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span className="text-[11px]">final_dataset.csv</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          
          {/* Dataset Status for Mobile */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 mb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Status:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {isLoading ? (
                <span className="text-sky-300 flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Loading CSV...</span>
                </span>
              ) : error ? (
                <span className="text-red-400">Failed to load</span>
              ) : (
                <span className="font-semibold text-white">
                  {totalCount > 0 ? `${totalCount.toLocaleString()} Rows Connected` : 'Ready'}
                </span>
              )}
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={getPageUrl(item.path)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {getNavIcon(item.id)}
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto text-[10px] bg-blue-700 px-2 py-0.5 rounded text-blue-100 font-semibold">
                      Current
                    </span>
                  )}
                </a>
              );
            })}
          </div>

        </div>
      )}
    </header>
  );
}
