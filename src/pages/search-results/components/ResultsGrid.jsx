import React from 'react';
import PropertyCard from './PropertyCard';

const ResultsGrid = ({ 
  properties = [],
  searchQuery = '',
  onFavoriteToggle = () => {},
  onInquiryClick = () => {},
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 })?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties?.map((property) => (
        <PropertyCard
          key={property?.id}
          property={property}
          searchQuery={searchQuery}
          onFavoriteToggle={onFavoriteToggle}
          onInquiryClick={onInquiryClick}
        />
      ))}
    </div>
  );
};

export default ResultsGrid;