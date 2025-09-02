import React from 'react';
import PropertyCard from './PropertyCard';
import Icon from '../../../components/AppIcon';

const PropertyGrid = ({ 
  properties, 
  loading, 
  onFavoriteToggle, 
  onLoadMore, 
  hasMore 
}) => {
  if (loading && properties?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="bg-card rounded-xl shadow-luxury overflow-hidden animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties?.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Search" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            لم نتمكن من العثور على شاليهات تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو البحث في منطقة أخرى.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location?.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-luxury"
            >
              إعادة تحميل
            </button>
            <button
              onClick={() => window.history?.back()}
              className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-luxury"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          الشاليهات المتاحة
        </h2>
        <div className="text-sm text-muted-foreground">
          {properties?.length} من الشاليهات
        </div>
      </div>
      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <PropertyCard
            key={property?.id}
            property={property}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-luxury flex items-center space-x-2 rtl:space-x-reverse mx-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>جاري التحميل...</span>
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={18} />
                <span>عرض المزيد</span>
              </>
            )}
          </button>
        </div>
      )}
      {/* Loading More Indicator */}
      {loading && properties?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)]?.map((_, index) => (
            <div key={`loading-${index}`} className="bg-card rounded-xl shadow-luxury overflow-hidden animate-pulse">
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <div className="h-3 bg-muted rounded w-16"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;