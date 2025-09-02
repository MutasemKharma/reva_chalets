import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchHeader = ({ 
  searchQuery = '',
  onSearchChange = () => {},
  onFilterToggle = () => {},
  onSortToggle = () => {},
  filterCount = 0,
  sortOption = 'relevance'
}) => {
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const handleBackToBrowse = () => {
    navigate('/property-listings-browse');
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'price_low':
        return 'السعر: من الأقل للأعلى';
      case 'price_high':
        return 'السعر: من الأعلى للأقل';
      case 'newest':
        return 'الأحدث';
      default:
        return 'الأكثر صلة';
    }
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-luxury border-b border-border">
      <div className="container mx-auto px-4">
        <div className="py-4">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-3">
            {/* Back Button & Title */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToBrowse}
              >
                <Icon name="ArrowRight" size={20} className="rtl:rotate-180" />
              </Button>
              <h1 className="text-lg font-heading font-semibold">نتائج البحث</h1>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex space-x-2 rtl:space-x-reverse">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="ابحث عن الشاليهات والمزارع..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e?.target?.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" size="icon" variant="outline">
                <Icon name="Search" size={18} />
              </Button>
            </form>

            {/* Filter & Sort Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={onFilterToggle}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Icon name="Filter" size={16} />
                <span>فلترة</span>
                {filterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {filterCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onSortToggle}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Icon name="ArrowUpDown" size={16} />
                <span className="text-sm">{getSortLabel()}</span>
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToBrowse}
              >
                <Icon name="ArrowRight" size={20} className="rtl:rotate-180" />
              </Button>
              
              <h1 className="text-xl font-heading font-semibold">نتائج البحث</h1>
              
              <form onSubmit={handleSearchSubmit} className="flex space-x-2 rtl:space-x-reverse max-w-md">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="ابحث عن الشاليهات والمزارع..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e?.target?.value)}
                  />
                </div>
                <Button type="submit" size="icon" variant="outline">
                  <Icon name="Search" size={18} />
                </Button>
              </form>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="outline"
                onClick={onFilterToggle}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Icon name="Filter" size={16} />
                <span>فلترة</span>
                {filterCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 mr-2 rtl:ml-2">
                    {filterCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={onSortToggle}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Icon name="ArrowUpDown" size={16} />
                <span>{getSortLabel()}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;