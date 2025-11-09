import axios from "axios";

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const unwrap = (promise) => promise.then((response) => response.data);

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const addProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data;
};

export const registerUser = (payload) => unwrap(API.post("/auth/register", payload));
export const loginUser = (payload) => unwrap(API.post("/auth/login", payload));
export const fetchCurrentUser = () => unwrap(API.get("/auth/me"));

export const createOrder = (items) => unwrap(API.post("/orders", { items }));
export const getMyOrders = async () => {
  const res = await API.get("/orders/my");
  return res.data.orders || [];
};

export const downloadInvoice = async (orderId) => {
  const response = await API.get(`/orders/${orderId}/invoice`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice_${orderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default API;
