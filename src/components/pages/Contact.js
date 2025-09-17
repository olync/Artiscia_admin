import React, { useState } from 'react';
import { useContact } from '../../hooks/useContact';
import LoadingSpinner from '../common/LoadingSpinner';

const Contact = () => {
  const {
    queries,
    stats,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    refreshQueries,
    updateQueryStatus,
    bulkUpdateQueries,
    deleteQuery,
    getSingleQuery,
    getQueryFromList
  } = useContact();

  const [selectedQueries, setSelectedQueries] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAdminNote, setShowAdminNote] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [updateAction, setUpdateAction] = useState(null);

  const handleStatusFilter = (status) => {
    updateFilters({ status, page: 1 });
  };

  const handleSearch = () => {
    updateFilters({ search: searchInput, page: 1 });
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value === '') {
      updateFilters({ search: '', page: 1 });
    }
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  const handleQuerySelect = (queryId) => {
    setSelectedQueries(prev => {
      const newSelected = prev.includes(queryId)
        ? prev.filter(id => id !== queryId)
        : [...prev, queryId];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedQueries.length === queries.length) {
      setSelectedQueries([]);
      setShowBulkActions(false);
    } else {
      setSelectedQueries(queries.map(q => q._id));
      setShowBulkActions(true);
    }
  };

  const handleStatusUpdate = async (queryId, newStatus, note = '') => {
    try {
      setIsUpdating(true);
      await updateQueryStatus(queryId, newStatus, note);
      
      // Show success message
      const query = getQueryFromList(queryId);
      alert(`Query for ${query?.firstName} ${query?.lastName} has been updated to ${newStatus}`);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus, note = '') => {
    try {
      setIsUpdating(true);
      const result = await bulkUpdateQueries(selectedQueries, newStatus, note);
      alert(result.message);
      setSelectedQueries([]);
      setShowBulkActions(false);
    } catch (err) {
      alert('Failed to bulk update: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    const query = getQueryFromList(queryId);
    if (window.confirm(`Are you sure you want to delete the query from ${query?.firstName} ${query?.lastName}?`)) {
      try {
        setIsUpdating(true);
        const result = await deleteQuery(queryId);
        alert(result.message);
      } catch (err) {
        alert('Failed to delete query: ' + err.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleViewDetails = async (queryId) => {
    try {
      // First try to get from local list for speed
      let query = getQueryFromList(queryId);
      
      if (!query) {
        // If not found locally, fetch from API
        query = await getSingleQuery(queryId);
      }
      
      setSelectedQuery(query);
      setShowQueryDetails(true);
    } catch (err) {
      alert('Failed to load query details: ' + err.message);
    }
  };

  const openAdminNoteDialog = (action, queryId = null, status = null) => {
    setUpdateAction({ action, queryId, status });
    setAdminNote('');
    setShowAdminNote(true);
  };

  const handleAdminNoteSubmit = async () => {
    const { action, queryId, status } = updateAction;
    
    try {
      if (action === 'single') {
        await handleStatusUpdate(queryId, status, adminNote);
      } else if (action === 'bulk') {
        await handleBulkStatusUpdate(status, adminNote);
      }
      setShowAdminNote(false);
      setUpdateAction(null);
      setAdminNote('');
    } catch (err) {
      // Error already handled in the individual functions
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'inReview': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '🔴';
      case 'inReview': return '🟡';
      case 'resolved': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  if (loading) return <LoadingSpinner message="Loading contact queries..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Contact & Support</h2>
          <p className="text-gray-600 mt-1">Manage customer queries and support tickets</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={refreshQueries}
            disabled={isUpdating}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.pending || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">Needs attention</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Review</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.inReview || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-600 text-sm font-medium">Being processed</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Resolved</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.resolved || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">Completed</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Queries</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.total || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-teal-600 text-sm font-medium">All time</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by name, email, or query..." 
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pl-11"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="lg:w-64">
            <select 
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="inReview">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button 
            onClick={handleSearch}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-700 font-medium">{selectedQueries.length} queries selected</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openAdminNoteDialog('bulk', null, 'inReview')}
                disabled={isUpdating}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
              >
                Mark In Review
              </button>
              <button
                onClick={() => openAdminNoteDialog('bulk', null, 'resolved')}
                disabled={isUpdating}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => {
                  setSelectedQueries([]);
                  setShowBulkActions(false);
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-800">
              Contact Queries ({pagination.totalQueries})
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedQueries.length === queries.length && queries.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="text-sm text-gray-600">Select All</label>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {queries.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-900">No contact queries found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              queries.map((query) => (
                <div key={query._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedQueries.includes(query._id)}
                        onChange={() => handleQuerySelect(query._id)}
                        className="mt-1 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-teal-600 font-bold text-sm">#{query._id.slice(-6)}</span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(query.status)}`}>
                            <span className="mr-1">{getStatusIcon(query.status)}</span>
                            {query.status}
                          </span>
                          <span className="text-xs text-gray-500">{getTimeAgo(query.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {query.firstName ? query.firstName[0].toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {query.firstName} {query.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">{query.email}</p>
                            {query.phoneNumber && (
                              <p className="text-sm text-gray-500">📞 {query.phoneNumber}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <h5 className="font-medium text-gray-800 mb-1">Query:</h5>
                          <p className="text-sm text-gray-600 line-clamp-2">{query.query}</p>
                        </div>
                        
                        {query.adminNote && (
                          <div className="mb-2 p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-1">Admin Note:</h5>
                            <p className="text-sm text-blue-700">{query.adminNote}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          <span>User ID: {query.userid}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-3">
                      <button 
                        onClick={() => handleViewDetails(query._id)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      
                      <div className="relative group">
                        <button 
                          disabled={isUpdating}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
                        >
                          Update Status
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="py-2">
                            <button
                              onClick={() => openAdminNoteDialog('single', query._id, 'pending')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              🔴 Mark as Pending
                            </button>
                            <button
                              onClick={() => openAdminNoteDialog('single', query._id, 'inReview')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              🟡 Mark as In Review
                            </button>
                            <button
                              onClick={() => openAdminNoteDialog('single', query._id, 'resolved')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              ✅ Mark as Resolved
                            </button>
                            <button
                              onClick={() => openAdminNoteDialog('single', query._id, 'rejected')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              ❌ Mark as Rejected
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteQuery(query._id)}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {queries.length} of {pagination.totalQueries} queries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          page === pagination.currentPage
                            ? 'bg-teal-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {pagination.totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          pagination.totalPages === pagination.currentPage
                            ? 'bg-teal-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Note Dialog */}
      {showAdminNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add Admin Note</h3>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note about this status change (optional)..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                rows="4"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowAdminNote(false);
                    setUpdateAction(null);
                    setAdminNote('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminNoteSubmit}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Query Details Modal */}
      {showQueryDetails && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Query Details</h3>
              <button 
                onClick={() => setShowQueryDetails(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <p className="text-gray-900 font-semibold">{selectedQuery.firstName} {selectedQuery.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedQuery.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p className="text-gray-900">{selectedQuery.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedQuery.status)}`}>
                    <span className="mr-1">{getStatusIcon(selectedQuery.status)}</span>
                    {selectedQuery.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(selectedQuery.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{formatDate(selectedQuery.updatedAt || selectedQuery.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Query Details</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedQuery.query}</p>
                </div>
              </div>

              {selectedQuery.adminNote && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Note</label>
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-blue-900 whitespace-pre-wrap">{selectedQuery.adminNote}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-gray-600 font-mono text-sm">{selectedQuery.userid}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Query ID</label>
                <p className="text-gray-600 font-mono text-sm">{selectedQuery._id}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-between space-x-3">
              <div className="flex space-x-3">
                <button
                  onClick={() => openAdminNoteDialog('single', selectedQuery._id, 'inReview')}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                >
                  Mark In Review
                </button>
                <button
                  onClick={() => openAdminNoteDialog('single', selectedQuery._id, 'resolved')}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                >
                  Mark Resolved
                </button>
              </div>
              <button
                onClick={() => setShowQueryDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {/* <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-green-800 font-medium">Fully Integrated Contact Management</h4>
            <p className="text-green-700 text-sm mt-1">
              All functionality is now connected to your backend API endpoints:
              <br />• ✅ Real-time status updates with admin notes
              <br />• ✅ Bulk operations for multiple queries
              <br />• ✅ Advanced search and filtering with server-side pagination
              <br />• ✅ Complete CRUD operations (Create, Read, Update, Delete)
              <br />• ✅ Detailed query management with full audit trail
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Contact;