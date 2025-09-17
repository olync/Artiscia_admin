import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAllOrders();
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      if (response.success) {
        await fetchOrders(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to update order status');
    } catch (err) {
      throw err;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      if (response.success) {
        await fetchOrders(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to cancel order');
    } catch (err) {
      throw err;
    }
  };

  const getOrderById = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response.orders;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderById,
  };
};
