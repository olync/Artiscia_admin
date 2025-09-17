import { useState, useEffect } from 'react';
import { subcategoryService } from '../services/subcategoryService';

export const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subcategoryService.getAllSubcategories();
      setSubcategories(response.getsubcategory || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await subcategoryService.getSubcategoriesByCategory(categoryId);
      setSubcategories(response.getsubcategories || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching subcategories by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSubcategory = async (subcategoryData) => {
    try {
      const response = await subcategoryService.addSubcategory(subcategoryData);
      if (response.success) {
        await fetchSubcategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to add subcategory');
    } catch (err) {
      throw err;
    }
  };

  const updateSubcategory = async (id, subcategoryData) => {
    try {
      const response = await subcategoryService.updateSubcategory(id, subcategoryData);
      if (response.success) {
        await fetchSubcategories(); // Refresh the list
        return response;
      }
      throw new Error(response.message || 'Failed to update subcategory');
    } catch (err) {
      throw err;
    }
  };

  const deleteSubcategory = async (id) => {
    try {
      const response = await subcategoryService.deleteSubcategory(id);
      await fetchSubcategories(); // Refresh the list
      return response;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return {
    subcategories,
    loading,
    error,
    fetchSubcategories,
    fetchSubcategoriesByCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
};
