import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFilters = ({ 
  filters = {},
  onRemoveFilter = () => {},
  onClearAll = () => {}
}) => {
  const getFilterChips = () => {
    const chips = [];

    // Location filter
    if (filters?.governorate) {
      chips?.push({
        key: 'governorate',
        label: `الموقع: ${filters?.governorate}`,
        value: filters?.governorate
      });
    }

    // Price range filter
    if (filters?.priceRange && (filters?.priceRange?.min || filters?.priceRange?.max)) {
      const { min, max } = filters?.priceRange;
      let priceLabel = 'السعر: ';
      if (min && max) {
        priceLabel += `${min} - ${max} دينار`;
      } else if (min) {
        priceLabel += `من ${min} دينار`;
      } else if (max) {
        priceLabel += `حتى ${max} دينار`;
      }
      chips?.push({
        key: 'priceRange',
        label: priceLabel,
        value: filters?.priceRange
      });
    }

    // Check-in/Check-out dates
    if (filters?.checkIn && filters?.checkOut) {
      const checkInDate = new Date(filters.checkIn)?.toLocaleDateString('ar-JO');
      const checkOutDate = new Date(filters.checkOut)?.toLocaleDateString('ar-JO');
      chips?.push({
        key: 'dates',
        label: `${checkInDate} - ${checkOutDate}`,
        value: { checkIn: filters?.checkIn, checkOut: filters?.checkOut }
      });
    }

    // Property type filter
    if (filters?.propertyType) {
      const typeLabel = filters?.propertyType === 'family' ? 'عائلي' : 
                       filters?.propertyType === 'youth' ? 'شبابي' : filters?.propertyType;
      chips?.push({
        key: 'propertyType',
        label: `النوع: ${typeLabel}`,
        value: filters?.propertyType
      });
    }

    // Bedrooms filter
    if (filters?.bedrooms) {
      chips?.push({
        key: 'bedrooms',
        label: `غرف النوم: ${filters?.bedrooms}`,
        value: filters?.bedrooms
      });
    }

    // Amenities filter
    if (filters?.amenities && filters?.amenities?.length > 0) {
      const amenityLabels = {
        pool: 'مسبح',
        wifi: 'واي فاي',
        parking: 'موقف سيارات',
        kitchen: 'مطبخ',
        ac: 'تكييف',
        garden: 'حديقة'
      };
      
      filters?.amenities?.forEach(amenity => {
        chips?.push({
          key: `amenity_${amenity}`,
          label: amenityLabels?.[amenity] || amenity,
          value: amenity,
          parentKey: 'amenities'
        });
      });
    }

    return chips;
  };

  const filterChips = getFilterChips();

  if (filterChips?.length === 0) {
    return null;
  }

  const handleRemoveChip = (chip) => {
    if (chip?.parentKey === 'amenities') {
      const updatedAmenities = filters?.amenities?.filter(a => a !== chip?.value);
      onRemoveFilter('amenities', updatedAmenities);
    } else {
      onRemoveFilter(chip?.key, null);
    }
  };

  return (
    <div className="sticky top-32 md:top-36 z-30 bg-background/95 backdrop-blur-luxury border-b border-border">
      <div className="container mx-auto px-4">
        <div className="py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              الفلاتر النشطة ({filterChips?.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-error hover:text-error"
            >
              <Icon name="X" size={14} />
              <span className="mr-1 rtl:ml-1">مسح الكل</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto scrollbar-hide pb-1">
            {filterChips?.map((chip, index) => (
              <div
                key={`${chip?.key}_${index}`}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0"
              >
                <span>{chip?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveChip(chip)}
                  className="w-4 h-4 p-0 hover:bg-primary/20 text-primary"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;