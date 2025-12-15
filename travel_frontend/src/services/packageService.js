import api from "./api";

// Get all packages
export const getPackages = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/packages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Create new package
export const createPackage = async (data) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/packages", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update package
export const updatePackage = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/packages/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete package
export const deletePackage = async (id) => {
  const token = localStorage.getItem("token");
  return api.delete(`/packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
