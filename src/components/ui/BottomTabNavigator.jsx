import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigator = ({ inquiryCount = 0 }) => {
  const location = useLocation();

  const navigationTabs = [
    {
      label: 'استكشاف',
      labelEn: 'Explore',
      path: '/property-listings-browse',
      icon: 'Search',
      activeIcon: 'Search'
    },
    {
      label: 'التفاصيل',
      labelEn: 'Details',
      path: '/property-detail-view',
      icon: 'Home',
      activeIcon: 'Home'
    },
    {
      label: 'استفساراتي',
      labelEn: 'Inquiries',
      path: '/inquiry-management-dashboard',
      icon: 'MessageSquare',
      activeIcon: 'MessageSquare',
      badge: inquiryCount > 0 ? inquiryCount : null
    },
    {
      label: 'حسابي',
      labelEn: 'Account',
      path: '/user-profile-settings',
      icon: 'User',
      activeIcon: 'User'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/property-listings-browse') {
      return location?.pathname === path || location?.pathname === '/search-results';
    }
    return location?.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-luxury border-t border-border">
        <nav className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navigationTabs?.map((tab) => {
            const isActive = isActivePath(tab?.path);
            
            return (
              <Link
                key={tab?.path}
                to={tab?.path}
                className={`relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-lg transition-luxury ${
                  isActive
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon 
                    name={isActive ? tab?.activeIcon : tab?.icon} 
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {tab?.badge && (
                    <div className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {tab?.badge > 99 ? '99+' : tab?.badge}
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium mt-1 text-center leading-tight ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {tab?.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Desktop Horizontal Navigation (Hidden on mobile) */}
      <div className="hidden md:block">
        <nav className="flex items-center space-x-6 rtl:space-x-reverse">
          {navigationTabs?.map((tab) => {
            const isActive = isActivePath(tab?.path);
            
            return (
              <Link
                key={tab?.path}
                to={tab?.path}
                className={`relative flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-luxury ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-luxury'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon 
                    name={isActive ? tab?.activeIcon : tab?.icon} 
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {tab?.badge && (
                    <div className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-medium rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                      {tab?.badge > 99 ? '99+' : tab?.badge}
                    </div>
                  )}
                </div>
                <span className="font-medium">{tab?.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default BottomTabNavigator;