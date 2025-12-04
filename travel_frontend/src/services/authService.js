import api from "./api";

// ======================
// LOGIN USER
// ======================
export const loginUser = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password,
  });
  return response.data;
};

// ======================
// REGISTER USER (SIGNUP)
// ======================
export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  return api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

