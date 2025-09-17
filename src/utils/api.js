const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5063/api';

// API configuration
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Request interceptor to add auth token
const makeRequest = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers,
      ...(token && { authorization: token }),
    },
  };

  try {
    const response = await fetch(`${apiConfig.baseURL}${url}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// For FormData requests (file uploads)
const makeFormDataRequest = async (url, formData, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const config = {
    method: 'POST',
    ...options,
    headers: {
      ...(token && { authorization: token }),
      ...options.headers,
    },
    body: formData,
  };

  try {
    const response = await fetch(`${apiConfig.baseURL}${url}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export { makeRequest, makeFormDataRequest, API_BASE_URL };
