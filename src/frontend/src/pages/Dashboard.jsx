import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard/artisan").then((res) => setData(res.data));
  }, []);

  if (!data) return <h2>Loading dashboard...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user?.name}'s Dashboard</h2>
      <p>Total Products: {data.totalProducts}</p>
      <p>Total Stock: {data.totalStock}</p>
      <p>Total Sales: ₹{data.totalSales}</p>
      <h3>Products:</h3>
      <ul>
        {data.products.map((p) => (
          <li key={p.id}>{p.name} — {p.stock} left</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
