import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  searchQuery = '',
  activeFilters = {},
  onClearFilters = () => {},
  onNewSearch = () => {}
}) => {
  const hasActiveFilters = Object.values(activeFilters)?.some(value => 
    Array.isArray(value) ? value?.length > 0 : value
  );

  const suggestions = [
    {
      icon: 'MapPin',
      title: 'جرب محافظة أخرى',
      description: 'ابحث في عمان، العقبة، أو إربد',
      action: () => onNewSearch('عمان')
    },
    {
      icon: 'DollarSign',
      title: 'وسع نطاق السعر',
      description: 'قد تجد خيارات أكثر بنطاق سعري أوسع',
      action: () => onClearFilters()
    },
    {
      icon: 'Calendar',
      title: 'غير التواريخ',
      description: 'جرب تواريخ مختلفة للحصول على المزيد من الخيارات',
      action: () => onClearFilters()
    },
    {
      icon: 'Home',
      title: 'غير نوع الشاليه',
      description: 'جرب البحث في الشاليهات العائلية والشبابية',
      action: () => onClearFilters()
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Empty State Icon */}
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="Search" size={40} className="text-muted-foreground" />
      </div>
      {/* Main Message */}
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">
        لم نجد نتائج مطابقة
      </h2>
      {searchQuery && (
        <p className="text-muted-foreground mb-2">
          لا توجد نتائج للبحث عن "{searchQuery}"
        </p>
      )}
      {hasActiveFilters && (
        <p className="text-muted-foreground mb-6">
          جرب إزالة بعض الفلاتر للحصول على المزيد من النتائج
        </p>
      )}
      {!hasActiveFilters && !searchQuery && (
        <p className="text-muted-foreground mb-6">
          لا توجد شاليهات متاحة بالمعايير المحددة حالياً
        </p>
      )}
      {/* Quick Actions */}
      {hasActiveFilters && (
        <div className="mb-8">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="mb-4"
          >
            <Icon name="RotateCcw" size={16} />
            <span className="mr-2 rtl:ml-2">مسح جميع الفلاتر</span>
          </Button>
        </div>
      )}
      {/* Suggestions */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-heading font-medium text-foreground mb-4">
          اقتراحات للبحث
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={suggestion?.action}
              className="p-4 bg-card border border-border rounded-lg hover:shadow-luxury transition-luxury text-right group"
            >
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-luxury">
                  <Icon name={suggestion?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-card-foreground mb-1">
                    {suggestion?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {suggestion?.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Popular Destinations */}
      <div className="w-full max-w-2xl mt-8">
        <h3 className="text-lg font-heading font-medium text-foreground mb-4">
          وجهات شائعة
        </h3>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {['عمان', 'العقبة', 'إربد', 'جرش', 'مادبا', 'الكرك']?.map((destination) => (
            <Button
              key={destination}
              variant="outline"
              size="sm"
              onClick={() => onNewSearch(destination)}
              className="text-sm"
            >
              {destination}
            </Button>
          ))}
        </div>
      </div>
      {/* Help Text */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md">
        <div className="flex items-start space-x-2 rtl:space-x-reverse">
          <Icon name="Info" size={16} className="text-primary mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">نصيحة:</p>
            <p>
              استخدم كلمات بحث أقل أو جرب البحث بأسماء المحافظات الأردنية للحصول على نتائج أفضل
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;