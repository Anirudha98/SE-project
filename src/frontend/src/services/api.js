import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const addProduct = async (data) => {
  const res = await API.post("/products", data);
  return res.data;
};

export default API;
