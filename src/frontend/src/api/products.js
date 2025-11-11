import { get, post, patch } from './client';

export const addProduct = async (data) => {
  return post('/products', data);
};

export const listMyProducts = async ({ page = 1, pageSize = 20, artisanId } = {}) => {
  const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
  if (artisanId) params.append('artisanId', artisanId.toString());
  return get(`/products/mine?${params.toString()}`);
};

export const updateMyProduct = async (id, data) => {
  return patch(`/products/${id}`, data);
};

export const updateStock = async (id, { delta, stock }) => {
  return patch(`/products/${id}/stock`, { delta, stock });
};

export const setAvailability = async (id, isAvailable) => {
  return patch(`/products/${id}/availability`, { isAvailable });
};

export const listPublic = async (query = {}) => {
  const params = new URLSearchParams();
  Object.keys(query).forEach((key) => {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      params.append(key, query[key].toString());
    }
  });
  const queryString = params.toString();
  return get(`/products${queryString ? `?${queryString}` : ''}`);
};

