import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigator from '../../components/ui/BottomTabNavigator';
import SearchHeader from './components/SearchHeader';
import ActiveFilters from './components/ActiveFilters';
import FilterPanel from './components/FilterPanel';
import SortModal from './components/SortModal';
import MapViewToggle from './components/MapViewToggle';
import EmptyState from './components/EmptyState';
import ResultsGrid from './components/ResultsGrid';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams?.get('q') || '';
  const initialGovernorate = searchParams?.get('location') || '';

  // State management
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');
  
  const [filters, setFilters] = useState({
    governorate: initialGovernorate,
    priceRange: { min: null, max: null },
    checkIn: '',
    checkOut: '',
    propertyType: '',
    bedrooms: '',
    amenities: []
  });

  // Mock search results data
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "شاليه الواحة الذهبية",
      location: "دابوق",
      governorate: "عمان",
      type: "family",
      pricePerNight: 85,
      bedrooms: 3,
      maxGuests: 8,
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop"
      ],
      amenities: ["pool", "wifi", "parking", "kitchen", "ac"],
      isFavorite: false,
      relevanceScore: 95,
      matchedFeatures: ["مسبح", "واي فاي", "موقف سيارات"],
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: 2,
      name: "مزرعة الأرز الشبابية",
      location: "الفحيص",
      governorate: "عمان",
      type: "youth",
      pricePerNight: 65,
      bedrooms: 2,
      maxGuests: 12,
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop"
      ],
      amenities: ["wifi", "parking", "kitchen", "garden", "bbq"],
      isFavorite: true,
      relevanceScore: 88,
      matchedFeatures: ["مطبخ", "حديقة"],
      rating: 4.6,
      reviewCount: 89
    },
    {
      id: 3,
      name: "شاليه البحر الأحمر",
      location: "العقبة الجنوبية",
      governorate: "العقبة",
      type: "family",
      pricePerNight: 120,
      bedrooms: 4,
      maxGuests: 10,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop"
      ],
      amenities: ["pool", "wifi", "parking", "kitchen", "ac", "garden"],
      isFavorite: false,
      relevanceScore: 92,
      matchedFeatures: ["مسبح", "تكييف"],
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: 4,
      name: "مزرعة الزيتون التراثية",
      location: "عجلون الشمالية",
      governorate: "عجلون",
      type: "family",
      pricePerNight: 75,
      bedrooms: 3,
      maxGuests: 8,
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop"
      ],
      amenities: ["wifi", "parking", "kitchen", "garden"],
      isFavorite: false,
      relevanceScore: 85,
      matchedFeatures: ["حديقة", "مطبخ"],
      rating: 4.7,
      reviewCount: 98
    },
    {
      id: 5,
      name: "شاليه الوردة الشبابي",
      location: "إربد الشمالية",
      governorate: "إربد",
      type: "youth",
      pricePerNight: 55,
      bedrooms: 2,
      maxGuests: 10,
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
      ],
      amenities: ["wifi", "parking", "kitchen", "bbq", "playground"],
      isFavorite: false,
      relevanceScore: 82,
      matchedFeatures: ["شواء", "ملعب أطفال"],
      rating: 4.5,
      reviewCount: 67
    },
    {
      id: 6,
      name: "شاليه الياسمين الفاخر",
      location: "مادبا الوسط",
      governorate: "مادبا",
      type: "family",
      pricePerNight: 95,
      bedrooms: 4,
      maxGuests: 12,
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
      ],
      amenities: ["pool", "wifi", "parking", "kitchen", "ac", "garden"],
      isFavorite: true,
      relevanceScore: 90,
      matchedFeatures: ["مسبح", "تكييف", "حديقة"],
      rating: 4.8,
      reviewCount: 143
    }
  ]);

  const [filteredResults, setFilteredResults] = useState(searchResults);

  // Apply filters and search
  useEffect(() => {
    let results = [...searchResults];

    // Apply search query filter
    if (searchQuery) {
      results = results?.filter(property =>
        property?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        property?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        property?.governorate?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply location filter
    if (filters?.governorate) {
      results = results?.filter(property => 
        property?.governorate === filters?.governorate
      );
    }

    // Apply price range filter
    if (filters?.priceRange?.min || filters?.priceRange?.max) {
      results = results?.filter(property => {
        const price = property?.pricePerNight;
        const minPrice = filters?.priceRange?.min || 0;
        const maxPrice = filters?.priceRange?.max || Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply property type filter
    if (filters?.propertyType) {
      results = results?.filter(property => 
        property?.type === filters?.propertyType
      );
    }

    // Apply bedrooms filter
    if (filters?.bedrooms) {
      results = results?.filter(property => {
        if (filters?.bedrooms === '5+') {
          return property?.bedrooms >= 5;
        }
        return property?.bedrooms?.toString() === filters?.bedrooms;
      });
    }

    // Apply amenities filter
    if (filters?.amenities?.length > 0) {
      results = results?.filter(property =>
        filters?.amenities?.every(amenity => 
          property?.amenities?.includes(amenity)
        )
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'price_low':
        results?.sort((a, b) => a?.pricePerNight - b?.pricePerNight);
        break;
      case 'price_high':
        results?.sort((a, b) => b?.pricePerNight - a?.pricePerNight);
        break;
      case 'newest':
        // Mock newest sorting (in real app, would use creation date)
        results?.sort((a, b) => b?.id - a?.id);
        break;
      case 'rating':
        results?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'popular':
        results?.sort((a, b) => b?.reviewCount - a?.reviewCount);
        break;
      default: // relevance
        results?.sort((a, b) => b?.relevanceScore - a?.relevanceScore);
    }

    setFilteredResults(results);
  }, [searchQuery, filters, sortOption, searchResults]);

  // Handle search
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handle filters
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      governorate: '',
      priceRange: { min: null, max: null },
      checkIn: '',
      checkOut: '',
      propertyType: '',
      bedrooms: '',
      amenities: []
    });
    setSearchQuery('');
  };

  // Handle sorting
  const handleSortChange = (newSort) => {
    setSortOption(newSort);
  };

  // Handle property interactions
  const handleFavoriteToggle = (propertyId, isFavorite) => {
    setSearchResults(prev =>
      prev?.map(property =>
        property?.id === propertyId
          ? { ...property, isFavorite }
          : property
      )
    );
  };

  const handleInquiryClick = (property) => {
    navigate('/inquiry-management-dashboard', {
      state: { newInquiry: property }
    });
  };

  const handlePropertySelect = (property) => {
    navigate(`/property-detail-view?id=${property?.id}&from=search`);
  };

  // Handle new search from empty state
  const handleNewSearch = (query) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      governorate: query
    }));
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.governorate) count++;
    if (filters?.priceRange?.min || filters?.priceRange?.max) count++;
    if (filters?.checkIn && filters?.checkOut) count++;
    if (filters?.propertyType) count++;
    if (filters?.bedrooms) count++;
    if (filters?.amenities?.length > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearchChange}
        onSearchQueryChange={handleSearchChange}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
        onSortToggle={() => setIsSortModalOpen(true)}
        filterCount={getActiveFilterCount()}
        sortOption={sortOption}
      />
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground">
              {isLoading ? 'جاري البحث...' : `${filteredResults?.length} نتيجة`}
            </h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-1">
                نتائج البحث عن "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Results Content */}
        {!isMapView && (
          <>
            {filteredResults?.length === 0 && !isLoading ? (
              <EmptyState
                searchQuery={searchQuery}
                activeFilters={filters}
                onClearFilters={handleClearAllFilters}
                onNewSearch={handleNewSearch}
              />
            ) : (
              <ResultsGrid
                properties={filteredResults}
                searchQuery={searchQuery}
                onFavoriteToggle={handleFavoriteToggle}
                onInquiryClick={handleInquiryClick}
                isLoading={isLoading}
              />
            )}
          </>
        )}

        {/* Map View Toggle */}
        <MapViewToggle
          isMapView={isMapView}
          onToggle={() => setIsMapView(!isMapView)}
          properties={filteredResults}
          onPropertySelect={handlePropertySelect}
        />
      </main>
      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={() => setIsFilterPanelOpen(false)}
        onClearFilters={handleClearAllFilters}
      />
      {/* Sort Modal */}
      <SortModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        currentSort={sortOption}
        onSortChange={handleSortChange}
      />
      <BottomTabNavigator />
    </div>
  );
};

export default SearchResults;