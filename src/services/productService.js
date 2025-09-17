const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5063/api';

// Helper function to make API requests with auth
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const config = {
    ...options,
    headers: {
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

// Helper function for FormData requests
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

// Helper function to properly handle arrays for FormData
const appendArrayToFormData = (formData, fieldName, array) => {
  if (array && Array.isArray(array) && array.length > 0) {
    // Send each array item individually
    array.forEach((item, index) => {
      formData.append(`${fieldName}[${index}]`, item);
    });
  }
};

export const productService = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      
      const url = `/product/getallproducts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeAuthenticatedRequest(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/product/getsingleproduct/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Add all text fields
      const textFields = [
        'productName', 'description', 'material', 'type', 'Product_length', 
        'Product_breadth', 'Product_height', 'brand', 'category', 'subcategory',
        'color', 'price', 'discountPrice', 'currency', 'stockQuantity', 
        'availabilityStatus', 'videoUrl', 'metaTitle', 'metaDescription', 
        'handlingTime', 'returnPolicy', 'shippingWeight', 'featured', 'featuredDisplayOrder'
      ];

      textFields.forEach(field => {
        if (productData[field] !== undefined && productData[field] !== '') {
          formData.append(field, productData[field]);
        }
      });

      // Handle arrays properly - send individual items instead of stringifying
      if (productData.keywords && Array.isArray(productData.keywords) && productData.keywords.length > 0) {
        appendArrayToFormData(formData, 'keywords', productData.keywords);
      }
      
      if (productData.tags && Array.isArray(productData.tags) && productData.tags.length > 0) {
        appendArrayToFormData(formData, 'tags', productData.tags);
      }

      // Handle shipping dimensions
      if (productData.shippingDimensions) {
        if (productData.shippingDimensions.length) {
          formData.append('shippingDimensions[length]', productData.shippingDimensions.length);
        }
        if (productData.shippingDimensions.width) {
          formData.append('shippingDimensions[width]', productData.shippingDimensions.width);
        }
        if (productData.shippingDimensions.height) {
          formData.append('shippingDimensions[height]', productData.shippingDimensions.height);
        }
      }

      // Add main image
      if (productData.mainImage) {
        formData.append('mainImage', productData.mainImage);
      }

      // Add additional images
      if (productData.additionalImages && productData.additionalImages.length > 0) {
        productData.additionalImages.forEach((image) => {
          formData.append('additionalImages', image);
        });
      }

      const response = await makeFormDataRequest('/product/addproduct', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

// Update your productService.js updateProduct function

// Update product
updateProduct: async (id, productData) => {
  try {
    const formData = new FormData();
    
    // Add all text fields
    const textFields = [
      'productName', 'description', 'material', 'type', 'Product_length', 
      'Product_breadth', 'Product_height', 'brand', 'category', 'subcategory',
      'color', 'price', 'discountPrice', 'currency', 'stockQuantity', 
      'availabilityStatus', 'videoUrl', 'metaTitle', 'metaDescription', 
      'handlingTime', 'returnPolicy', 'shippingWeight', 'featured', 'featuredDisplayOrder'
    ];

    textFields.forEach(field => {
      if (productData[field] !== undefined && productData[field] !== '') {
        formData.append(field, productData[field]);
      }
    });

    // Handle image removal flags
    if (productData.mainImageRemoved) {
      formData.append('mainImageRemoved', productData.mainImageRemoved);
    }
    
    if (productData.removedAdditionalImages) {
      formData.append('removedAdditionalImages', productData.removedAdditionalImages);
    }
    
    if (productData.keepAdditionalImages) {
      formData.append('keepAdditionalImages', productData.keepAdditionalImages);
    }

    // Handle arrays properly - send individual items instead of stringifying
    if (productData.keywords && Array.isArray(productData.keywords) && productData.keywords.length > 0) {
      appendArrayToFormData(formData, 'keywords', productData.keywords);
    }
    
    if (productData.tags && Array.isArray(productData.tags) && productData.tags.length > 0) {
      appendArrayToFormData(formData, 'tags', productData.tags);
    }

    // Handle shipping dimensions
    if (productData.shippingDimensions) {
      if (productData.shippingDimensions.length) {
        formData.append('shippingDimensions[length]', productData.shippingDimensions.length);
      }
      if (productData.shippingDimensions.width) {
        formData.append('shippingDimensions[width]', productData.shippingDimensions.width);
      }
      if (productData.shippingDimensions.height) {
        formData.append('shippingDimensions[height]', productData.shippingDimensions.height);
      }
    }

    // Add main image if updated
    if (productData.mainImage instanceof File) {
      formData.append('mainImage', productData.mainImage);
    }

    // Add additional images if updated
    if (productData.additionalImages && productData.additionalImages.length > 0) {
      productData.additionalImages.forEach((image) => {
        if (image instanceof File) {
          formData.append('additionalImages', image);
        }
      });
    }

    const response = await makeFormDataRequest(`/product/updateproduct/${id}`, formData, 'PUT');
    return response;
  } catch (error) {
    throw error;
  }
},

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/product/deleteproduct/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};