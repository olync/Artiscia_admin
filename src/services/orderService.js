const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5063/api';

const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { authorization: token }),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await makeAuthenticatedRequest('/order/getallorders');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by user ID
  getOrdersByUser: async (userId) => {
    try {
      const response = await makeAuthenticatedRequest(`/order/getOrdersOfaParticularUser/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get order by order ID
  getOrderById: async (orderId) => {
    try {
      const response = await makeAuthenticatedRequest(`/order/getOrderByOrderid/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await makeAuthenticatedRequest(`/order/updateorderstatus/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await makeAuthenticatedRequest(`/order/cancelorder/${orderId}`, {
        method: 'PUT',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
