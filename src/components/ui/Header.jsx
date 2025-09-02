import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'استكشاف',
      labelEn: 'Explore',
      path: '/property-listings-browse',
      icon: 'Search'
    },
    {
      label: 'النتائج',
      labelEn: 'Search',
      path: '/search-results',
      icon: 'Filter'
    },
    {
      label: 'استفساراتي',
      labelEn: 'My Inquiries',
      path: '/inquiry-management-dashboard',
      icon: 'MessageSquare'
    },
    {
      label: 'حسابي',
      labelEn: 'My Account',
      path: '/user-profile-settings',
      icon: 'User'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-luxury border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/property-listings-browse" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-primary-foreground"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-semibold text-foreground">
                ريفا شاليهات
              </h1>
              <p className="text-xs text-muted-foreground font-caption">
                Reva Chalets
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-luxury ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-luxury'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-luxury-md animate-slide-down">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-luxury ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-luxury'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <div className="flex flex-col">
                    <span className="font-medium">{item?.label}</span>
                    <span className="text-xs text-muted-foreground font-caption">
                      {item?.labelEn}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;