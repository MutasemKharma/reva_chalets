import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortModal = ({ 
  isOpen = false,
  onClose = () => {},
  currentSort = 'relevance',
  onSortChange = () => {}
}) => {
  const sortOptions = [
    {
      value: 'relevance',
      label: 'الأكثر صلة',
      description: 'بناءً على معايير البحث',
      icon: 'Target'
    },
    {
      value: 'price_low',
      label: 'السعر: من الأقل للأعلى',
      description: 'الأسعار المنخفضة أولاً',
      icon: 'TrendingUp'
    },
    {
      value: 'price_high',
      label: 'السعر: من الأعلى للأقل',
      description: 'الأسعار المرتفعة أولاً',
      icon: 'TrendingDown'
    },
    {
      value: 'newest',
      label: 'الأحدث',
      description: 'المضافة حديثاً أولاً',
      icon: 'Clock'
    },
    {
      value: 'rating',
      label: 'الأعلى تقييماً',
      description: 'بناءً على تقييمات النزلاء',
      icon: 'Star'
    },
    {
      value: 'popular',
      label: 'الأكثر شعبية',
      description: 'الأكثر حجزاً',
      icon: 'TrendingUp'
    }
  ];

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-96 bg-popover border border-border rounded-lg shadow-luxury-xl z-50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">ترتيب النتائج</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Sort Options */}
        <div className="p-2">
          {sortOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => handleSortSelect(option?.value)}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-luxury text-right ${
                currentSort === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-popover-foreground'
              }`}
            >
              <div className={`shrink-0 ${
                currentSort === option?.value ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}>
                <Icon name={option?.icon} size={20} />
              </div>
              
              <div className="flex-1 text-right">
                <div className={`font-medium ${
                  currentSort === option?.value ? 'text-primary-foreground' : 'text-popover-foreground'
                }`}>
                  {option?.label}
                </div>
                <div className={`text-sm ${
                  currentSort === option?.value ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {option?.description}
                </div>
              </div>

              {currentSort === option?.value && (
                <div className="shrink-0 text-primary-foreground">
                  <Icon name="Check" size={18} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SortModal;