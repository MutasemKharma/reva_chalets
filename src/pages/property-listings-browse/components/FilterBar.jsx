import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterBar = ({ filters, onFilterChange, onClearFilters, resultCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState(filters?.priceRange || [0, 1000]);

  const governorateOptions = [
    { value: '', label: 'جميع المحافظات' },
    { value: 'amman', label: 'عمان' },
    { value: 'zarqa', label: 'الزرقاء' },
    { value: 'irbid', label: 'إربد' },
    { value: 'aqaba', label: 'العقبة' },
    { value: 'karak', label: 'الكرك' },
    { value: 'mafraq', label: 'المفرق' },
    { value: 'jerash', label: 'جرش' },
    { value: 'ajloun', label: 'عجلون' },
    { value: 'madaba', label: 'مادبا' },
    { value: 'balqa', label: 'البلقاء' },
    { value: 'tafilah', label: 'الطفيلة' },
    { value: 'maan', label: 'معان' }
  ];

  const chaletTypeOptions = [
    { value: '', label: 'جميع الأنواع' },
    { value: 'family', label: 'عائلي' },
    { value: 'youth', label: 'شبابي' }
  ];

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    setPriceRange(newRange);
    onFilterChange('priceRange', newRange);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.governorate) count++;
    if (filters?.chaletType) count++;
    if (filters?.checkIn || filters?.checkOut) count++;
    if (filters?.priceRange && (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 1000)) count++;
    return count;
  };

  return (
    <div className="bg-card border-b border-border sticky top-16 z-30">
      <div className="container mx-auto px-4">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 justify-between"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Filter" size={18} />
                <span>الفلاتر</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {getActiveFilterCount()}
                  </span>
                )}
              </div>
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={18} 
              />
            </Button>
            
            <div className="mr-4 rtl:ml-4 text-sm text-muted-foreground">
              {resultCount} نتيجة
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse py-4">
          <div className="flex-1 grid grid-cols-4 gap-4">
            <Select
              label="المحافظة"
              options={governorateOptions}
              value={filters?.governorate || ''}
              onChange={(value) => onFilterChange('governorate', value)}
              className="w-full"
            />

            <Select
              label="نوع الشاليه"
              options={chaletTypeOptions}
              value={filters?.chaletType || ''}
              onChange={(value) => onFilterChange('chaletType', value)}
              className="w-full"
            />

            <Input
              label="تاريخ الوصول"
              type="date"
              value={filters?.checkIn || ''}
              onChange={(e) => onFilterChange('checkIn', e?.target?.value)}
              className="w-full"
            />

            <Input
              label="تاريخ المغادرة"
              type="date"
              value={filters?.checkOut || ''}
              onChange={(e) => onFilterChange('checkOut', e?.target?.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {resultCount} نتيجة
            </div>
            
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-error hover:text-error whitespace-nowrap"
              >
                <Icon name="X" size={16} />
                <span className="mr-1 rtl:ml-1">مسح الفلاتر</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Expanded Filters */}
        {isExpanded && (
          <div className="md:hidden pb-4 space-y-4 animate-slide-down">
            <div className="grid grid-cols-1 gap-4">
              <Select
                label="المحافظة"
                options={governorateOptions}
                value={filters?.governorate || ''}
                onChange={(value) => onFilterChange('governorate', value)}
              />

              <Select
                label="نوع الشاليه"
                options={chaletTypeOptions}
                value={filters?.chaletType || ''}
                onChange={(value) => onFilterChange('chaletType', value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="تاريخ الوصول"
                  type="date"
                  value={filters?.checkIn || ''}
                  onChange={(e) => onFilterChange('checkIn', e?.target?.value)}
                />

                <Input
                  label="تاريخ المغادرة"
                  type="date"
                  value={filters?.checkOut || ''}
                  onChange={(e) => onFilterChange('checkOut', e?.target?.value)}
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  نطاق السعر (د.أ)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="الحد الأدنى"
                    value={priceRange?.[0]}
                    onChange={(e) => handlePriceRangeChange(0, e?.target?.value)}
                  />
                  <Input
                    type="number"
                    placeholder="الحد الأقصى"
                    value={priceRange?.[1]}
                    onChange={(e) => handlePriceRangeChange(1, e?.target?.value)}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {priceRange?.[0]} د.أ - {priceRange?.[1]} د.أ
                </div>
              </div>
            </div>

            {getActiveFilterCount() > 0 && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full text-error border-error hover:bg-error hover:text-error-foreground"
              >
                <Icon name="RotateCcw" size={16} />
                <span className="mr-2 rtl:ml-2">مسح جميع الفلاتر</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;