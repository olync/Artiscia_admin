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

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await makeAuthenticatedRequest('/category/getallcategory');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/category/getCategoryByid/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get category with subcategories
  getCategoryWithSubcategories: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/category/getCategoryWithSubcategories/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new category
  addCategory: async (categoryData) => {
    try {
      const formData = new FormData();
      
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description || '');
      formData.append('status', categoryData.status || 'active');
      
      if (categoryData.categoryImageUrl) {
        formData.append('categoryImageUrl', categoryData.categoryImageUrl);
      }

      const response = await makeFormDataRequest('/category/addcategory', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const formData = new FormData();
      
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description || '');
      formData.append('status', categoryData.status || 'active');
      
      if (categoryData.categoryImageUrl instanceof File) {
        formData.append('categoryImageUrl', categoryData.categoryImageUrl);
      }

      const response = await makeFormDataRequest(`/category/updateCategory/${id}`, formData, 'PUT');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/category/deleteCategory/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
