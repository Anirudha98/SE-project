import { get } from './client';

export const listOrdersByArtisan = async ({ page = 1, pageSize = 20, artisanId, start, end } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (artisanId) params.append('artisanId', artisanId.toString());
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  return get(`/orders/by-artisan?${params.toString()}`);
};

export const getOrderDetailForArtisan = async (id, { artisanId } = {}) => {
  const params = new URLSearchParams();
  if (artisanId) params.append('artisanId', artisanId.toString());
  const queryString = params.toString();
  return get(`/orders/by-artisan/${id}${queryString ? `?${queryString}` : ''}`);
};

