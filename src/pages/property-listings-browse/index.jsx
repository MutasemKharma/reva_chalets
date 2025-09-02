import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BottomTabNavigator from '../../components/ui/BottomTabNavigator';
import SearchHeader from './components/SearchHeader';
import FilterBar from './components/FilterBar';
import PropertyGrid from './components/PropertyGrid';
import { supabase } from '../../lib/supabase';

const PropertyListingsBrowse = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    governorate: '',
    chaletType: '',
    checkIn: '',
    checkOut: '',
    priceRange: [0, 1000]
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase?.from('properties')?.select(`
            *,
            owner:profiles!properties_owner_id_fkey (
              full_name
            )
          `)?.eq('is_active', true)?.order('created_at', { ascending: false });

        if (error) throw error;

        setProperties(data || []);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = properties;

    // Search query filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(property =>
        property?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        property?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Governorate filter
    if (filters?.governorate) {
      filtered = filtered?.filter(property => property?.governorate === filters?.governorate);
    }

    // Chalet type filter
    if (filters?.chaletType) {
      filtered = filtered?.filter(property => property?.type === filters?.chaletType);
    }

    // Price range filter
    if (filters?.priceRange) {
      filtered = filtered?.filter(property =>
        property?.pricePerNight >= filters?.priceRange?.[0] &&
        property?.pricePerNight <= filters?.priceRange?.[1]
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [properties, searchQuery, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      governorate: '',
      chaletType: '',
      checkIn: '',
      checkOut: '',
      priceRange: [0, 1000]
    });
    setSearchQuery('');
  };

  const handleFavoriteToggle = (propertyId) => {
    setProperties(prev =>
      prev?.map(property =>
        property?.id === propertyId
          ? { ...property, isFavorite: !property?.isFavorite }
          : property
      )
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Paginate results
  const paginatedProperties = filteredProperties?.slice(0, currentPage * itemsPerPage);
  const hasMoreResults = filteredProperties?.length > paginatedProperties?.length;

  return (
    <>
      <Helmet>
        <title>استكشاف الشاليهات والمزارع - ريفا شاليهات</title>
        <meta name="description" content="اكتشف أجمل الشاليهات والمزارع في الأردن. احجز إقامتك المثالية مع ريفا شاليهات" />
        <meta name="keywords" content="شاليهات الأردن، مزارع للإيجار، حجز شاليه، إقامة عائلية، شاليهات شبابية" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <SearchHeader
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredProperties?.length}
          />

          <PropertyGrid
            properties={paginatedProperties}
            loading={loading}
            onFavoriteToggle={handleFavoriteToggle}
            onLoadMore={handleLoadMore}
            hasMore={hasMoreResults}
          />
        </main>

        <BottomTabNavigator />
        
        {/* Safe area for mobile */}
        <div className="h-20 md:h-0"></div>
      </div>
    </>
  );
};

export default PropertyListingsBrowse;