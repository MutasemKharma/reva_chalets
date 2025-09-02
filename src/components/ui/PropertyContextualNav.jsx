import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PropertyContextualNav = ({ 
  propertyTitle = '',
  isFavorite = false,
  onFavoriteToggle = () => {},
  onShare = () => {},
  showBreadcrumb = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Navigate back to previous screen or default to browse
    if (window.history?.length > 1) {
      navigate(-1);
    } else {
      navigate('/property-listings-browse');
    }
  };

  const getBreadcrumbPath = () => {
    const currentPath = location?.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    if (currentPath === '/property-detail-view') {
      const fromSearch = searchParams?.get('from') === 'search';
      return fromSearch ? 'نتائج البحث' : 'استكشاف الشاليهات';
    }
    return 'الرئيسية';
  };

  return (
    <div className="sticky top-16 z-40 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-luxury border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <Icon name="ArrowRight" size={20} className="rtl:rotate-180" />
            </Button>
            
            {showBreadcrumb && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground min-w-0">
                <span className="font-caption">{getBreadcrumbPath()}</span>
                <Icon name="ChevronLeft" size={16} className="rtl:rotate-180 shrink-0" />
                <span className="font-medium text-foreground truncate">
                  {propertyTitle || 'تفاصيل الشاليه'}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Share2" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onFavoriteToggle}
              className={`transition-luxury ${
                isFavorite 
                  ? 'text-error hover:text-error/80' :'text-muted-foreground hover:text-error'
              }`}
            >
              <Icon 
                name={isFavorite ? "Heart" : "Heart"} 
                size={20}
                className={isFavorite ? 'fill-current' : ''}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyContextualNav;