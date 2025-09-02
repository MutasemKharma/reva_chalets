import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchHeader = ({ onSearch, searchQuery, onSearchQueryChange }) => {
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearch(searchQuery);
      navigate('/search-results', { 
        state: { query: searchQuery, timestamp: new Date()?.toISOString() } 
      });
    }
  };

  const popularSearches = [
    'شاليهات عمان',
    'مزارع العقبة', 
    'شاليهات عائلية',
    'مزارع شبابية',
    'شاليهات مع مسبح',
    'مزارع جرش'
  ];

  return (
    <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            اكتشف أجمل الشاليهات والمزارع في الأردن
          </h1>
          <p className="text-muted-foreground font-caption max-w-2xl mx-auto">
            استمتع بإقامة مميزة في أفضل الشاليهات والمزارع المختارة بعناية عبر المملكة الأردنية الهاشمية
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Input
                type="search"
                placeholder="ابحث عن شاليه أو مزرعة..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e?.target?.value)}
                onFocus={() => setIsSearchExpanded(true)}
                className="w-full pl-12 rtl:pr-12 rtl:pl-4 pr-4 py-3 text-lg rounded-xl border-2 border-border focus:border-primary"
              />
              <div className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 transform -translate-y-1/2">
                <Icon name="Search" size={20} className="text-muted-foreground" />
              </div>
            </div>
            
            <Button
              type="submit"
              className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 transform -translate-y-1/2 px-6"
              disabled={!searchQuery?.trim()}
            >
              بحث
            </Button>
          </form>

          {/* Popular Searches */}
          {isSearchExpanded && (
            <div className="mt-4 p-4 bg-card rounded-lg shadow-luxury border border-border animate-slide-down">
              <h3 className="font-medium text-sm text-foreground mb-3">
                عمليات البحث الشائعة
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches?.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSearchQueryChange(search);
                      setIsSearchExpanded(false);
                    }}
                    className="px-3 py-1.5 text-xs bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-luxury"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary mb-1">200+</div>
            <div className="text-sm text-muted-foreground font-caption">شاليه ومزرعة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary mb-1">12</div>
            <div className="text-sm text-muted-foreground font-caption">محافظة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary mb-1">4.8</div>
            <div className="text-sm text-muted-foreground font-caption">تقييم العملاء</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-muted-foreground font-caption">دعم العملاء</div>
          </div>
        </div>
      </div>
      {/* Search Backdrop */}
      {isSearchExpanded && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsSearchExpanded(false)}
        />
      )}
    </div>
  );
};

export default SearchHeader;