const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Network error during login:", error);
      throw new Error(
        "Unable to connect to server. Please check if the server is running."
      );
    }
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  verify: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/product`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`);
    return handleResponse(response);
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/product/featured`);
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/product/categories`);
    return handleResponse(response);
  },
};

// Cart API
export const cartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addToCart: async (product_id, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id, quantity }),
    });
    return handleResponse(response);
  },

  updateCartItem: async (id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/item/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  removeFromCart: async (id) => {
    const response = await fetch(`${API_BASE_URL}/cart/item/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};
