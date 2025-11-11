import { get } from './client';

export const getOverview = async ({ start, end, artisanId } = {}) => {
  const params = new URLSearchParams();
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  if (artisanId) params.append('artisanId', artisanId.toString());
  return get(`/reports/overview?${params.toString()}`);
};

export const getLowStock = async ({ threshold, start, end, artisanId } = {}) => {
  const params = new URLSearchParams();
  if (threshold !== undefined) params.append('threshold', threshold.toString());
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  if (artisanId) params.append('artisanId', artisanId.toString());
  return get(`/reports/low-stock?${params.toString()}`);
};

export const getSalesDaily = async ({ start, end, artisanId } = {}) => {
  const params = new URLSearchParams();
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  if (artisanId) params.append('artisanId', artisanId.toString());
  return get(`/reports/sales-daily?${params.toString()}`);
};

