import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts(filters);
      setProducts(response.getproducts || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await productService.addProduct(productData);
      if (response.success) {
        await fetchProducts(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to add product');
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      if (response.success) {
        await fetchProducts(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to update product');
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await productService.deleteProduct(id);
      await fetchProducts(); // Refresh the list
      return response;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
