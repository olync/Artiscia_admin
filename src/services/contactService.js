const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5063/api';

// Helper function to make API requests with auth
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

export const contactService = {
  // Get all contact queries (original API - for backward compatibility)
  getAllContactQueries: async () => {
    try {
      const response = await makeAuthenticatedRequest('/user/getContactUsQueries');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Get filtered contact queries with pagination
  getFilteredContactQueries: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      
      const url = `/user/contact/queries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await makeAuthenticatedRequest(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Get single contact query
  getSingleContactQuery: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/user/contact/queries/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Update contact query status
  updateContactQueryStatus: async (id, status, adminNote = '') => {
    try {
      const response = await makeAuthenticatedRequest(`/user/contact/updateContactQuery/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, adminNote }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Bulk update contact queries
  bulkUpdateContactQueries: async (queryIds, status, adminNote = '') => {
    try {
      const response = await makeAuthenticatedRequest('/user/contact/bulkUpdateContactQueries', {
        method: 'POST',
        body: JSON.stringify({ queryIds, status, adminNote }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Delete contact query
  deleteContactQuery: async (id) => {
    try {
      const response = await makeAuthenticatedRequest(`/user/contact/deleteContactQuery/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // NEW: Get contact query statistics
  getContactQueryStats: async (timeframe = 'all') => {
    try {
      const url = `/user/contact/stats${timeframe !== 'all' ? `?timeframe=${timeframe}` : ''}`;
      const response = await makeAuthenticatedRequest(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add contact query (for reference, used by users)
  addContactQuery: async (userId, queryData) => {
    try {
      const response = await makeAuthenticatedRequest(`/user/addcontactUsQuery/${userId}`, {
        method: 'POST',
        body: JSON.stringify(queryData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Client-side helper functions (now less needed with backend pagination)
  getFilteredQueriesLocal: (queries, filters = {}) => {
    let filteredQueries = [...queries];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filteredQueries = filteredQueries.filter(query => 
        query.status === filters.status
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredQueries = filteredQueries.filter(query =>
        query.firstName.toLowerCase().includes(searchTerm) ||
        query.lastName.toLowerCase().includes(searchTerm) ||
        query.email.toLowerCase().includes(searchTerm) ||
        query.query.toLowerCase().includes(searchTerm)
      );
    }

    return filteredQueries;
  },

  // Client-side statistics calculation (backup for when not using stats API)
  calculateStatsLocal: (queries) => {
    const stats = {
      pending: 0,
      inReview: 0,
      resolved: 0,
      rejected: 0,
      total: queries.length
    };

    queries.forEach(query => {
      if (stats.hasOwnProperty(query.status)) {
        stats[query.status]++;
      }
    });

    return stats;
  },

  // Client-side pagination (backup for when not using paginated API)
  getPaginatedQueriesLocal: (queries, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQueries = queries.slice(startIndex, endIndex);

    return {
      queries: paginatedQueries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(queries.length / limit),
        totalQueries: queries.length,
        limit: limit,
        hasNextPage: page < Math.ceil(queries.length / limit),
        hasPrevPage: page > 1
      }
    };
  }
};