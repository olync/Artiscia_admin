// import React, { useEffect, useState } from 'react';
// import { productService } from '../../services/productService';
// import { categoryService } from '../../services/categoryService';
// import { subcategoryService } from '../../services/subcategoryService';

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     inStock: 0,
//     outOfStock: 0,
//     totalCategories: 0,
//     totalSubcategories: 0,
//     activeCategories: 0
//   });
//   const [recentProducts, setRecentProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch products
//       const productsResponse = await productService.getAllProducts();
//       const products = productsResponse.getproducts || [];
      
//       // Fetch categories
//       const categoriesResponse = await categoryService.getAllCategories();
//       const categories = categoriesResponse.getcategory || [];
      
//       // Fetch subcategories
//       const subcategoriesResponse = await subcategoryService.getAllSubcategories();
//       const subcategories = subcategoriesResponse.getsubcategory || [];
      
//       // Calculate stats
//       const inStockCount = products.filter(p => p.availabilityStatus === 'In Stock').length;
//       const outOfStockCount = products.filter(p => p.availabilityStatus === 'Out of Stock').length;
//       const activeCategoriesCount = categories.filter(c => c.status === 'active').length;
      
//       setStats({
//         totalProducts: products.length,
//         inStock: inStockCount,
//         outOfStock: outOfStockCount,
//         totalCategories: categories.length,
//         totalSubcategories: subcategories.length,
//         activeCategories: activeCategoriesCount
//       });
      
//       // Get recent products (last 5)
//       const sortedProducts = products
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5);
//       setRecentProducts(sortedProducts);
      
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
//         <button 
//           onClick={fetchDashboardData}
//           className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//           </svg>
//           <span>Refresh</span>
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Products</p>
//               <p className="text-gray-900 text-3xl font-bold">{stats.totalProducts}</p>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
//               <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <span className="text-teal-600 text-sm font-medium flex items-center">
//               📦 Inventory
//             </span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">In Stock</p>
//               <p className="text-gray-900 text-3xl font-bold">{stats.inStock}</p>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
//               <span className="text-2xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <span className="text-green-600 text-sm font-medium flex items-center">
//               Available products
//             </span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
//               <p className="text-gray-900 text-3xl font-bold">{stats.outOfStock}</p>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
//               <span className="text-2xl">❌</span>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <span className="text-red-600 text-sm font-medium flex items-center">
//               {stats.outOfStock > 0 ? 'Needs restocking' : 'All in stock!'}
//             </span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Categories</p>
//               <p className="text-gray-900 text-3xl font-bold">{stats.totalCategories}</p>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
//               <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//               </svg>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <span className="text-blue-600 text-sm font-medium flex items-center">
//               🏷️ Main categories
//             </span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Subcategories</p>
//               <p className="text-gray-900 text-3xl font-bold">{stats.totalSubcategories}</p>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
//               <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//               </svg>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <span className="text-purple-600 text-sm font-medium flex items-center">
//               📑 Sub categories
//             </span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Active Categories</p>
//               <p className="text-gray-900 text-3xl font-bold">{stats.activeCategories}</p>
//             </div>
//             <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
//               <span className="text-2xl">🟢</span>
//             </div>
//           </div>
//           <div className="mt-4 flex items-center">
//             <span className="text-orange-600 text-sm font-medium flex items-center">
//               Live categories
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Charts and Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Products */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//             <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Recent Products
//           </h3>
//           <div className="space-y-4">
//             {recentProducts.length === 0 ? (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//                 <p className="text-gray-500">No products added yet</p>
//               </div>
//             ) : (
//               recentProducts.map((product, idx) => (
//                 <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
//                     {product.mainImageUrl ? (
//                       <img 
//                         src={product.mainImageUrl} 
//                         alt={product.productName}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
//                         <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-gray-800 font-medium">{product.productName}</p>
//                     <p className="text-gray-500 text-sm">
//                       {product.currency} {product.price} • {product.availabilityStatus}
//                     </p>
//                     <p className="text-gray-400 text-xs">
//                       {new Date(product.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className={`w-3 h-3 rounded-full ${
//                     product.availabilityStatus === 'In Stock' ? 'bg-green-500' :
//                     product.availabilityStatus === 'Out of Stock' ? 'bg-red-500' :
//                     'bg-yellow-500'
//                   }`}></div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//           <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//             <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             Quick Actions
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <button className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200 hover:from-teal-100 hover:to-teal-200 transition-all group">
//               <div className="text-center">
//                 <svg className="w-8 h-8 text-teal-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 <span className="text-teal-700 font-medium">Add Product</span>
//               </div>
//             </button>
            
//             <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 hover:from-green-100 hover:to-green-200 transition-all group">
//               <div className="text-center">
//                 <svg className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//                 <span className="text-green-700 font-medium">Categories</span>
//               </div>
//             </button>
            
//             <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all group">
//               <div className="text-center">
//                 <svg className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <span className="text-blue-700 font-medium">Orders</span>
//               </div>
//             </button>
            
//             <button className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all group">
//               <div className="text-center">
//                 <svg className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//                 <span className="text-orange-700 font-medium">Support</span>
//               </div>
//             </button>
//           </div>

//           {/* System Status */}
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <h4 className="text-sm font-semibold text-gray-700 mb-3">System Status</h4>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Database</span>
//                 <span className="flex items-center text-green-600 text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                   Connected
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">API Status</span>
//                 <span className="flex items-center text-green-600 text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                   Online
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Storage</span>
//                 <span className="flex items-center text-green-600 text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                   S3 Active
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { subcategoryService } from '../../services/subcategoryService';
import { orderService } from '../../services/orderService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    activeCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await productService.getAllProducts();
      const products = productsResponse.getproducts || [];
      
      // Fetch categories
      const categoriesResponse = await categoryService.getAllCategories();
      const categories = categoriesResponse.getcategory || [];
      
      // Fetch subcategories
      const subcategoriesResponse = await subcategoryService.getAllSubcategories();
      const subcategories = subcategoriesResponse.getsubcategory || [];
      
      // Fetch orders
      let orders = [];
      let totalRevenue = 0;
      let pendingOrdersCount = 0;
      let deliveredOrdersCount = 0;
      
      try {
        const ordersResponse = await orderService.getAllOrders();
        orders = ordersResponse.orders || [];
        
        // Calculate order stats
        pendingOrdersCount = orders.filter(o => ['Order Incomplete', 'Order Placed', 'Payment Done'].includes(o.status)).length;
        deliveredOrdersCount = orders.filter(o => o.status === 'Order Delivered').length;
        totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        // Get recent orders (last 5)
        const sortedOrders = orders
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (orderError) {
        console.log('Orders not available yet:', orderError);
        // Continue without orders data
      }
      
      // Calculate stats
      const inStockCount = products.filter(p => p.availabilityStatus === 'In Stock').length;
      const outOfStockCount = products.filter(p => p.availabilityStatus === 'Out of Stock').length;
      const activeCategoriesCount = categories.filter(c => c.status === 'active').length;
      
      setStats({
        totalProducts: products.length,
        inStock: inStockCount,
        outOfStock: outOfStockCount,
        totalCategories: categories.length,
        totalSubcategories: subcategories.length,
        activeCategories: activeCategoriesCount,
        totalOrders: orders.length,
        pendingOrders: pendingOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        totalRevenue: totalRevenue
      });
      
      // Get recent products (last 5)
      const sortedProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentProducts(sortedProducts);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status) => {
    switch(status) {
      case 'Order Delivered': return 'text-green-600';
      case 'Order Shipped': 
      case 'Out for Delivery': 
      case 'Order In Transit': return 'text-blue-600';
      case 'Payment Done': 
      case 'Order Placed': return 'text-yellow-600';
      case 'Order Cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <button 
          onClick={fetchDashboardData}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid - Extended with Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-teal-600 text-sm font-medium flex items-center">
              📦 Inventory
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Stock</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.inStock}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-600 text-sm font-medium flex items-center">
              Available products
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.outOfStock}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-600 text-sm font-medium flex items-center">
              {stats.outOfStock > 0 ? 'Needs restocking' : 'All in stock!'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Categories</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.totalCategories}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-blue-600 text-sm font-medium flex items-center">
              🏷️ Main categories
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Subcategories</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.totalSubcategories}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-purple-600 text-sm font-medium flex items-center">
              📑 Sub categories
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Categories</p>
              <p className="text-gray-900 text-3xl font-bold">{stats.activeCategories}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-orange-600 text-sm font-medium flex items-center">
              Live categories
            </span>
          </div>
        </div>
      </div>

      {/* Additional Order Stats Row */}
      {stats.totalOrders > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-gray-900 text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-indigo-600 text-sm font-medium flex items-center">
                📋 Customer orders
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-gray-900 text-3xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-600 text-sm font-medium flex items-center">
                Need attention
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenue</p>
                <p className="text-gray-900 text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-emerald-600 text-sm font-medium flex items-center">
                💰 Total earnings
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Products
          </h3>
          <div className="space-y-4">
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500">No products added yet</p>
              </div>
            ) : (
              recentProducts.map((product, idx) => (
                <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    {product.mainImageUrl ? (
                      <img 
                        src={product.mainImageUrl} 
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-teal-100 to-teal-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{product.productName}</p>
                    <p className="text-gray-500 text-sm">
                      {product.currency} {product.price} • {product.availabilityStatus}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    product.availabilityStatus === 'In Stock' ? 'bg-green-500' :
                    product.availabilityStatus === 'Out of Stock' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders or Quick Actions */}
        {recentOrders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Orders
            </h3>
            <div className="space-y-4">
              {recentOrders.map((order, idx) => (
                <div key={order._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#{order.orderid.slice(-3)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Order #{order.orderid}</p>
                    <p className="text-gray-500 text-sm">
                      {order.userid?.fullName || order.userid?.email || 'Unknown Customer'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">₹{order.totalAmount?.toLocaleString()}</p>
                    <p className={`text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Quick Actions */
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border-2 border-teal-200 hover:from-teal-100 hover:to-teal-200 transition-all group">
                <div className="text-center">
                  <svg className="w-8 h-8 text-teal-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-teal-700 font-medium">Add Product</span>
                </div>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 hover:from-green-100 hover:to-green-200 transition-all group">
                <div className="text-center">
                  <svg className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-green-700 font-medium">Categories</span>
                </div>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all group">
                <div className="text-center">
                  <svg className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-blue-700 font-medium">Orders</span>
                </div>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all group">
                <div className="text-center">
                  <svg className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-orange-700 font-medium">Support</span>
                </div>
              </button>
            </div>

            {/* System Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">System Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    S3 Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Orders System</span>
                  <span className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Running
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

