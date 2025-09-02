import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  isOpen = false,
  onClose = () => {},
  filters = {},
  onFiltersChange = () => {},
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const jordanianGovernorates = [
    { value: 'amman', label: 'عمان' },
    { value: 'zarqa', label: 'الزرقاء' },
    { value: 'irbid', label: 'إربد' },
    { value: 'aqaba', label: 'العقبة' },
    { value: 'mafraq', label: 'المفرق' },
    { value: 'jerash', label: 'جرش' },
    { value: 'ajloun', label: 'عجلون' },
    { value: 'balqa', label: 'البلقاء' },
    { value: 'madaba', label: 'مادبا' },
    { value: 'karak', label: 'الكرك' },
    { value: 'tafilah', label: 'الطفيلة' },
    { value: 'maan', label: 'معان' }
  ];

  const propertyTypes = [
    { value: 'family', label: 'عائلي' },
    { value: 'youth', label: 'شبابي' }
  ];

  const bedroomOptions = [
    { value: '1', label: '1 غرفة' },
    { value: '2', label: '2 غرفة' },
    { value: '3', label: '3 غرف' },
    { value: '4', label: '4 غرف' },
    { value: '5+', label: '5+ غرف' }
  ];

  const amenityOptions = [
    { value: 'pool', label: 'مسبح' },
    { value: 'wifi', label: 'واي فاي' },
    { value: 'parking', label: 'موقف سيارات' },
    { value: 'kitchen', label: 'مطبخ' },
    { value: 'ac', label: 'تكييف' },
    { value: 'garden', label: 'حديقة' },
    { value: 'bbq', label: 'شواء' },
    { value: 'playground', label: 'ملعب أطفال' }
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev?.priceRange,
        [type]: value ? parseInt(value) : null
      }
    }));
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = localFilters?.amenities || [];
    const updatedAmenities = currentAmenities?.includes(amenity)
      ? currentAmenities?.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    handleFilterChange('amenities', updatedAmenities);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.governorate) count++;
    if (localFilters?.priceRange?.min || localFilters?.priceRange?.max) count++;
    if (localFilters?.checkIn && localFilters?.checkOut) count++;
    if (localFilters?.propertyType) count++;
    if (localFilters?.bedrooms) count++;
    if (localFilters?.amenities?.length > 0) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`
        fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-border z-50 
        md:relative md:inset-auto md:w-80 md:border md:rounded-lg md:shadow-luxury-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">فلترة النتائج</h2>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                {getActiveFilterCount()}
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Location Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">الموقع</h3>
            <Select
              placeholder="اختر المحافظة"
              options={jordanianGovernorates}
              value={localFilters?.governorate || ''}
              onChange={(value) => handleFilterChange('governorate', value)}
              searchable
            />
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">نطاق السعر (دينار أردني)</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="الحد الأدنى"
                value={localFilters?.priceRange?.min || ''}
                onChange={(e) => handlePriceRangeChange('min', e?.target?.value)}
              />
              <Input
                type="number"
                placeholder="الحد الأعلى"
                value={localFilters?.priceRange?.max || ''}
                onChange={(e) => handlePriceRangeChange('max', e?.target?.value)}
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">تواريخ الإقامة</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="تاريخ الوصول"
                value={localFilters?.checkIn || ''}
                onChange={(e) => handleFilterChange('checkIn', e?.target?.value)}
              />
              <Input
                type="date"
                label="تاريخ المغادرة"
                value={localFilters?.checkOut || ''}
                onChange={(e) => handleFilterChange('checkOut', e?.target?.value)}
              />
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">نوع الشاليه</h3>
            <Select
              placeholder="اختر النوع"
              options={propertyTypes}
              value={localFilters?.propertyType || ''}
              onChange={(value) => handleFilterChange('propertyType', value)}
            />
          </div>

          {/* Bedrooms Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">عدد غرف النوم</h3>
            <Select
              placeholder="اختر عدد الغرف"
              options={bedroomOptions}
              value={localFilters?.bedrooms || ''}
              onChange={(value) => handleFilterChange('bedrooms', value)}
            />
          </div>

          {/* Amenities Filter */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">المرافق والخدمات</h3>
            <div className="space-y-2">
              {amenityOptions?.map((amenity) => (
                <Checkbox
                  key={amenity?.value}
                  label={amenity?.label}
                  checked={(localFilters?.amenities || [])?.includes(amenity?.value)}
                  onChange={() => handleAmenityToggle(amenity?.value)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1"
              disabled={getActiveFilterCount() === 0}
            >
              مسح الفلاتر
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1"
            >
              تطبيق ({getActiveFilterCount()})
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;