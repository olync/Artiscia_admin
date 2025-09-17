import { useState, useEffect } from 'react';
import { contactService } from '../services/contactService';

export const useContact = () => {
  const [queries, setQueries] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0,
    total: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQueries: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  // Fetch queries using the new filtered API endpoint
  const fetchQueries = async (customFilters = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToUse = customFilters || filters;
      const response = await contactService.getFilteredContactQueries(filtersToUse);
      
      if (response.success) {
        setQueries(response.queries || []);
        setStats(response.stats || {});
        setPagination(response.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch queries');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contact queries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed statistics
  const fetchStats = async (timeframe = 'all') => {
    try {
      const response = await contactService.getContactQueryStats(timeframe);
      return response;
    } catch (err) {
      console.error('Error fetching contact stats:', err);
      throw err;
    }
  };

  // Update filters and fetch new data
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Reset to page 1 when filters change (except when only page changes)
    if (newFilters.status !== undefined || newFilters.search !== undefined) {
      updatedFilters.page = 1;
    }
    
    setFilters(updatedFilters);
    fetchQueries(updatedFilters);
  };

  // Update query status using real API
  const updateQueryStatus = async (queryId, status, adminNote = '') => {
    try {
      const response = await contactService.updateContactQueryStatus(queryId, status, adminNote);
      
      if (response.success) {
        // Refresh queries to get updated data
        await fetchQueries();
        return response;
      }
      throw new Error(response.message || 'Failed to update query status');
    } catch (err) {
      throw err;
    }
  };

  // Bulk update queries using real API
  const bulkUpdateQueries = async (queryIds, status, adminNote = '') => {
    try {
      const response = await contactService.bulkUpdateContactQueries(queryIds, status, adminNote);
      
      if (response.success) {
        // Refresh queries to get updated data
        await fetchQueries();
        return response;
      }
      throw new Error(response.message || 'Failed to bulk update queries');
    } catch (err) {
      throw err;
    }
  };

  // Delete query using real API
  const deleteQuery = async (queryId) => {
    try {
      const response = await contactService.deleteContactQuery(queryId);
      
      if (response.success) {
        // Refresh queries to get updated data
        await fetchQueries();
        return response;
      }
      throw new Error(response.message || 'Failed to delete query');
    } catch (err) {
      throw err;
    }
  };

  // Get single query details using real API
  const getSingleQuery = async (queryId) => {
    try {
      const response = await contactService.getSingleContactQuery(queryId);
      
      if (response.success) {
        return response.query;
      }
      throw new Error(response.message || 'Failed to fetch query details');
    } catch (err) {
      throw err;
    }
  };

  // Refresh data
  const refreshQueries = () => {
    fetchQueries();
  };

  // Get query from current list (faster than API call for already loaded data)
  const getQueryFromList = (queryId) => {
    return queries.find(query => query._id === queryId) || null;
  };

  // Initial load
  useEffect(() => {
    fetchQueries();
  }, []);

  // Auto-refresh filters when they change
  useEffect(() => {
    if (!loading) { // Prevent double loading on initial mount
      fetchQueries();
    }
  }, [filters.status, filters.search, filters.page, filters.limit]);

  return {
    // Data
    queries,
    stats,
    pagination,
    loading,
    error,
    filters,
    
    // Actions
    updateFilters,
    fetchQueries,
    refreshQueries,
    updateQueryStatus,
    bulkUpdateQueries,
    deleteQuery,
    getSingleQuery,
    getQueryFromList,
    fetchStats,
  };
};