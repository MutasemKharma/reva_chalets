import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const FilterQuickAccess = ({ 
  activeFilters = {},
  onFilterChange = () => {},
  onClearAll = () => {},
  isVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickFilters = [
    {
      key: 'priceRange',
      label: 'السعر',
      labelEn: 'Price',
      icon: 'DollarSign',
      options: [
        { value: 'budget', label: 'اقتصادي', labelEn: 'Budget' },
        { value: 'mid', label: 'متوسط', labelEn: 'Mid-range' },
        { value: 'luxury', label: 'فاخر', labelEn: 'Luxury' }
      ]
    },
    {
      key: 'bedrooms',
      label: 'غرف النوم',
      labelEn: 'Bedrooms',
      icon: 'Bed',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4+', label: '4+' }
      ]
    },
    {
      key: 'amenities',
      label: 'المرافق',
      labelEn: 'Amenities',
      icon: 'Wifi',
      options: [
        { value: 'pool', label: 'مسبح', labelEn: 'Pool' },
        { value: 'wifi', label: 'واي فاي', labelEn: 'WiFi' },
        { value: 'parking', label: 'موقف', labelEn: 'Parking' },
        { value: 'kitchen', label: 'مطبخ', labelEn: 'Kitchen' }
      ]
    },
    {
      key: 'location',
      label: 'الموقع',
      labelEn: 'Location',
      icon: 'MapPin',
      options: [
        { value: 'amman', label: 'عمان', labelEn: 'Amman' },
        { value: 'aqaba', label: 'العقبة', labelEn: 'Aqaba' },
        { value: 'jerash', label: 'جرش', labelEn: 'Jerash' },
        { value: 'madaba', label: 'مادبا', labelEn: 'Madaba' }
      ]
    }
  ];

  const getActiveFilterCount = () => {
    return Object.values(activeFilters)?.filter(value => 
      Array.isArray(value) ? value?.length > 0 : value
    )?.length;
  };

  const handleFilterSelect = (filterKey, value) => {
    const currentValue = activeFilters?.[filterKey];
    let newValue;

    if (Array.isArray(currentValue)) {
      newValue = currentValue?.includes(value)
        ? currentValue?.filter(v => v !== value)
        : [...currentValue, value];
    } else {
      newValue = currentValue === value ? null : value;
    }

    onFilterChange(filterKey, newValue);
  };

  const isFilterActive = (filterKey, value) => {
    const currentValue = activeFilters?.[filterKey];
    if (Array.isArray(currentValue)) {
      return currentValue?.includes(value);
    }
    return currentValue === value;
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-luxury border-b border-border">
      <div className="container mx-auto px-4">
        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden py-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-x-auto scrollbar-hide">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              <Icon name="Filter" size={16} />
              <span className="mr-2 rtl:ml-2">فلترة</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 mr-2 rtl:ml-2">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>

            {quickFilters?.map((filter) => (
              <div key={filter?.key} className="shrink-0">
                <Button
                  variant={activeFilters?.[filter?.key] ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Icon name={filter?.icon} size={14} />
                  <span className="mr-2 rtl:ml-2">{filter?.label}</span>
                </Button>
              </div>
            ))}

            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="shrink-0 text-error hover:text-error"
              >
                <Icon name="X" size={14} />
                <span className="mr-1 rtl:ml-1">مسح الكل</span>
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Full Width */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {quickFilters?.map((filter) => (
              <div key={filter?.key} className="relative">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon name={filter?.icon} size={16} className="text-muted-foreground" />
                  <span className="font-medium text-sm">{filter?.label}</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  {filter?.options?.map((option) => (
                    <Button
                      key={option?.value}
                      variant={isFilterActive(filter?.key, option?.value) ? "default" : "outline"}
                      size="xs"
                      onClick={() => handleFilterSelect(filter?.key, option?.value)}
                      className="text-xs"
                    >
                      {option?.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-error hover:text-error"
            >
              <Icon name="RotateCcw" size={16} />
              <span className="mr-2 rtl:ml-2">مسح جميع الفلاتر</span>
            </Button>
          )}
        </div>

        {/* Mobile Expanded Filters */}
        {isExpanded && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="space-y-4">
              {quickFilters?.map((filter) => (
                <div key={filter?.key} className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon name={filter?.icon} size={16} className="text-muted-foreground" />
                    <span className="font-medium text-sm">{filter?.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filter?.options?.map((option) => (
                      <Button
                        key={option?.value}
                        variant={isFilterActive(filter?.key, option?.value) ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleFilterSelect(filter?.key, option?.value)}
                        className="text-xs"
                      >
                        {option?.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterQuickAccess;