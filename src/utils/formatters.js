/**
 * Centralized currency conversion factor: 1 USD = ₹96
 */
export const USD_TO_INR = 96;

/**
 * Formats monetary value in Indian compact notation:
 * - >= 1 Crore (10,000,000) -> ₹X.XX Cr
 * - >= 1 Lakh (100,000) -> ₹X.XX L
 * - >= 1 Thousand (1,000) -> ₹X,XXX
 * - otherwise -> ₹X.XX
 *
 * @param {number} value - Value in USD (or INR if convertUSD is false)
 * @param {boolean} [convertUSD=true] - Whether to multiply by USD_TO_INR
 */
export function formatCompactINR(value, convertUSD = true) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const val = convertUSD ? value * USD_TO_INR : value;
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
  }
  return `${sign}₹${abs.toFixed(2)}`;
}

/**
 * Formats full exact Indian Rupee currency with standard Indian numbering separators.
 * (e.g., ₹22,04,34,776.64, ₹1,25,000.00, -₹73,49,069.76).
 *
 * @param {number} value - Value in USD (or INR if convertUSD is false)
 * @param {boolean} [convertUSD=true] - Whether to multiply by USD_TO_INR
 */
export function formatINR(value, convertUSD = true) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const val = convertUSD ? value * USD_TO_INR : value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(val);
}

/**
 * Formats integer or count numbers with standard comma separators (e.g., 37,820).
 * Never converts to currency.
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/**
 * Formats percentage values with 2 decimal places (e.g., 12.47%).
 * Never converts to currency.
 */
export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return `${value.toFixed(2)}%`;
}
