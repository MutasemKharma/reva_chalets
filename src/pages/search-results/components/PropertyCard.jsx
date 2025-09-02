import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PropertyCard = ({ 
  property,
  searchQuery = '',
  onFavoriteToggle = () => {},
  onInquiryClick = () => {}
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false);

  const handleCardClick = () => {
    navigate(`/property-detail-view?id=${property?.id}&from=search`);
  };

  const handleFavoriteClick = (e) => {
    e?.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle(property?.id, !isFavorite);
  };

  const handleInquiryClick = (e) => {
    e?.stopPropagation();
    onInquiryClick(property);
  };

  const highlightSearchTerms = (text) => {
    if (!searchQuery || !text) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getPropertyTypeLabel = (type) => {
    switch (type) {
      case 'family':
        return 'عائلي';
      case 'youth':
        return 'شبابي';
      default:
        return type;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card rounded-lg border border-border shadow-luxury hover:shadow-luxury-md transition-luxury cursor-pointer group overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property?.images?.[0]}
          alt={property?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-luxury-slow"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className={`bg-background/80 backdrop-blur-sm hover:bg-background/90 ${
              isFavorite ? 'text-error' : 'text-muted-foreground hover:text-error'
            }`}
          >
            <Icon 
              name="Heart" 
              size={18}
              className={isFavorite ? 'fill-current' : ''}
            />
          </Button>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            {getPropertyTypeLabel(property?.type)}
          </span>
        </div>

        {/* Relevance Score */}
        {property?.relevanceScore && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse">
              <Icon name="Star" size={12} className="fill-current" />
              <span>{property?.relevanceScore}%</span>
            </div>
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-1 line-clamp-1">
            {highlightSearchTerms(property?.name)}
          </h3>
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-muted-foreground text-sm">
            <Icon name="MapPin" size={14} />
            <span>{highlightSearchTerms(`${property?.location}, ${property?.governorate}`)}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Icon name="Bed" size={14} />
            <span>{property?.bedrooms} غرف</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Icon name="Users" size={14} />
            <span>حتى {property?.maxGuests} أشخاص</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
          {property?.amenities?.slice(0, 3)?.map((amenity, index) => {
            const amenityIcons = {
              pool: 'Waves',
              wifi: 'Wifi',
              parking: 'Car',
              kitchen: 'ChefHat',
              ac: 'Snowflake',
              garden: 'Trees'
            };
            
            return (
              <div key={index} className="text-primary">
                <Icon name={amenityIcons?.[amenity] || 'Check'} size={16} />
              </div>
            );
          })}
          {property?.amenities?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{property?.amenities?.length - 3} المزيد
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-heading font-bold text-primary">
              {formatPrice(property?.pricePerNight)}
            </div>
            <div className="text-xs text-muted-foreground">لليلة الواحدة</div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleInquiryClick}
            className="shrink-0"
          >
            <Icon name="MessageSquare" size={14} />
            <span className="mr-1 rtl:ml-1">استفسار</span>
          </Button>
        </div>

        {/* Match Indicators */}
        {property?.matchedFeatures && property?.matchedFeatures?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {property?.matchedFeatures?.map((feature, index) => (
                <span 
                  key={index}
                  className="bg-success/10 text-success px-2 py-0.5 rounded text-xs font-medium"
                >
                  ✓ {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;