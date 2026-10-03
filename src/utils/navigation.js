/**
 * Centralized navigation configuration for RetailPulse Multi-Page Application (MPA).
 * 4 Core Pages: Home, Dashboard, Charts, Insights.
 */

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '' },
  { id: 'dashboard', label: 'Dashboard', path: 'dashboard/' },
  { id: 'charts', label: 'Charts', path: 'charts/' },
  { id: 'insights', label: 'Insights', path: 'insights/' },
];

/**
 * Resolves full path taking Vite's BASE_URL into account.
 * Works seamlessly in local dev, subpaths, and Vercel production.
 *
 * @param {string} path - Target path (e.g., 'dashboard/', 'charts/', '' for home)
 * @returns {string} - Absolute URL path
 */
export function getPageUrl(path) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  if (!path || path === 'home' || path === '') return cleanBase;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const finalPath = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${cleanBase}${finalPath}`;
}
