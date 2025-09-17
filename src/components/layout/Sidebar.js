import React from 'react';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const sidebarItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
        </svg>
      ),
      description: 'Overview & Analytics'
    },
    {
      id: 'products',
      name: 'Products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      description: 'Add, Edit, Delete Products'
    },
    {
      id: 'categories',
      name: 'Categories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Manage Categories & Subcategories'
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      description: 'View All Orders'
    },
    {
      id: 'contact',
      name: 'Contact',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: 'Support Tickets & Inquiries'
    }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex h-full flex-col bg-gradient-to-b from-teal-600 to-teal-700 shadow-xl">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center border-b border-teal-500/20">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-white">Ecommerce Admin</h1>
          ) : (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-teal-600 font-bold text-sm">EA</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`group flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-white text-teal-600 shadow-lg'
                  : 'text-teal-100 hover:bg-teal-500/20 hover:text-white'
              }`}
            >
              <span className={`${activeSection === item.id ? 'text-teal-600' : 'text-teal-200'}`}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <div className="ml-3">
                  <span className="block">{item.name}</span>
                  <span className={`text-xs ${activeSection === item.id ? 'text-teal-500' : 'text-teal-300'}`}>
                    {item.description}
                  </span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex w-full items-center justify-center rounded-xl bg-teal-500/20 p-3 text-teal-100 hover:bg-teal-500/30 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
