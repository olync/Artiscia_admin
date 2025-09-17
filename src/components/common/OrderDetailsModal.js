import React from 'react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Delivered': return 'bg-green-100 text-green-800';
      case 'Order Shipped': 
      case 'Out for Delivery': 
      case 'Order In Transit': return 'bg-blue-100 text-blue-800';
      case 'Payment Done': 
      case 'Order Placed': return 'bg-yellow-100 text-yellow-800';
      case 'Order Cancelled': return 'bg-red-100 text-red-800';
      case 'Order Returned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Order Details - #{order.orderid}
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

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-800">#{order.orderid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-gray-800">₹{order.totalAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-800">{order.paymentMethod || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-gray-800">
                  {order.userid?.fullName || order.userid?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{order.userid?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">{order.userid?.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-semibold text-gray-800">{order.orderPlatform || 'Web'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.ShippingAddress && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h4>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-semibold text-gray-800">
                  {order.ShippingAddress.fullName || order.ShippingAddress.name}
                </p>
                <p className="text-gray-600">{order.ShippingAddress.addressLine1}</p>
                {order.ShippingAddress.addressLine2 && (
                  <p className="text-gray-600">{order.ShippingAddress.addressLine2}</p>
                )}
                <p className="text-gray-600">
                  {order.ShippingAddress.city}, {order.ShippingAddress.state} {order.ShippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.ShippingAddress.country}</p>
                {order.ShippingAddress.phoneNumber && (
                  <p className="text-gray-600 mt-2">Phone: {order.ShippingAddress.phoneNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Products ({order.products?.length || 0} items)
            </h4>
            <div className="space-y-4">
              {order.products?.map((product, index) => (
                <div key={index} className="bg-white p-4 rounded-lg flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {product.productImg ? (
                      <img 
                        src={product.productImg} 
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">{product.productName}</h5>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm font-medium text-gray-800">₹{product.discountPrice}</p>
                      {product.price !== product.discountPrice && (
                        <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{product.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 bg-white p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ₹{(order.totalAmount - (order.shippingCharges || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Charges:</span>
                  <span className="font-medium">₹{order.shippingCharges || 0}</span>
                </div>
                {order.couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Applied:</span>
                    <span>{order.couponApplied}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          {order.shipmentDetails && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.shipmentDetails.delivery_partner_name && (
                  <div>
                    <p className="text-sm text-gray-600">Delivery Partner</p>
                    <p className="font-semibold text-gray-800">{order.shipmentDetails.delivery_partner_name}</p>
                  </div>
                )}
                {order.shipmentDetails.shippedDate && (
                  <div>
                    <p className="text-sm text-gray-600">Shipped Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(order.shipmentDetails.shippedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {order.shipmentDetails.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(order.shipmentDetails.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {order.shipmentId && (
                  <div>
                    <p className="text-sm text-gray-600">Shipment ID</p>
                    <p className="font-semibold text-gray-800">{order.shipmentId}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Remarks */}
          {order.orderRemarks && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Remarks</h4>
              <p className="text-gray-700">{order.orderRemarks}</p>
            </div>
          )}

          {/* Cancellation Reason */}
          {order.cancellationReason && (
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
              <h4 className="text-lg font-semibold text-red-800 mb-4">Cancellation Reason</h4>
              <p className="text-red-700">{order.cancellationReason}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
