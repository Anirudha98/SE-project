import axios from "axios";

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  let token = authToken;
  if (!token) {
    token = localStorage.getItem("token");
  }
  if (!token) {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        token = JSON.parse(storedAuth)?.token;
      } catch (err) {
        // ignore parsing issues
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = (promise) => promise.then((response) => response.data);

export const getProducts = async () => {
  const res = await API.get("/products");
  // Handle both old array format and new paginated format
  if (Array.isArray(res.data)) {
    return res.data;
  }
  return res.data.items || [];
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
