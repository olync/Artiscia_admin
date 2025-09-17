import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getAllCategories();
      setCategories(response.getcategory || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await categoryService.addCategory(categoryData);
      if (response.success) {
        await fetchCategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to add category');
    } catch (err) {
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      if (response.success) {
        await fetchCategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to update category');
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await categoryService.deleteCategory(id);
      await fetchCategories(); // Refresh the list
      return response;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
