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

const makeFormDataRequest = async (url, formData, method = 'POST') => {
  const token = localStorage.getItem('adminToken');
  
  const config = {
    method,
    headers: {
      ...(token && { authorization: token }),
    },
    body: formData,
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

export const subcategoryService = {
  // Get all subcategories
  getAllSubcategories: async () => {
    try {
      const response = await makeAuthenticatedRequest('/subcategory/getallSubcategory');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get subcategories by category ID
  getSubcategoriesByCategory: async (categoryId) => {
    try {
      const response = await makeAuthenticatedRequest(`/subcategory/getAllSubcategoriesofCategory/${categoryId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new subcategory
  addSubcategory: async (subcategoryData) => {
    try {
      const formData = new FormData();
      
      formData.append('name', subcategoryData.name);
      formData.append('description', subcategoryData.description || '');
      formData.append('status', subcategoryData.status || 'active');
      formData.append('categoryId', subcategoryData.categoryId);
      
      if (subcategoryData.subcategoryImageUrl) {
        formData.append('subcategoryImageUrl', subcategoryData.subcategoryImageUrl);
      }

      const response = await makeFormDataRequest('/subcategory/addSubcategory', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update subcategory
  updateSubcategory: async (id, subcategoryData) => {
    try {
      const formData = new FormData();
      
      formData.append('name', subcategoryData.name);
      formData.append('description', subcategoryData.description || '');
      formData.append('status', subcategoryData.status || 'active');
      formData.append('parentCategory', subcategoryData.parentCategory);
      
      if (subcategoryData.subcategoryImageUrl instanceof File) {
        formData.append('subcategoryImageUrl', subcategoryData.subcategoryImageUrl);
      }

      const response = await makeFormDataRequest(`/subcategory/updatesubCategory/${id}`, formData, 'PUT');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete subcategory
  deleteSubcategory: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/subcategory/deletesubCategory/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
