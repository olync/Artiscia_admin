import React, { useState } from 'react';

const StatusUpdateModal = ({ order, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    'Order Incomplete',
    'Order Placed',
    'Payment Done',
    'Order Shipped',
    'Out for Delivery',
    'Order Delivered',
    'Order Cancelled',
    'Order In Transit',
    'Order Returned',
    'Order Shipment Create',
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Order Shipped': 
      case 'Out for Delivery': 
      case 'Order In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Payment Done': 
      case 'Order Placed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Order Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Order Returned': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdate(order._id, selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Update Order Status
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Order ID: #{order.orderid}</p>
            <p className="text-sm text-gray-600 mb-4">
              Customer: {order.userid?.fullName || order.userid?.email}
            </p>
            <p className="text-sm text-gray-600 mb-4">Current Status:</p>
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {selectedStatus && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedStatus)}`}>
                {selectedStatus}
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedStatus === order.status}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
