import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PropertyCard = ({ property, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);

  const handleCardClick = () => {
    navigate('/property-detail-view', { 
      state: { propertyId: property?.id, property } 
    });
  };

  const handleFavoriteClick = (e) => {
    e?.stopPropagation();
    onFavoriteToggle(property?.id);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'family':
        return 'bg-primary text-primary-foreground';
      case 'youth':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'family':
        return 'عائلي';
      case 'youth':
        return 'شبابي';
      default:
        return 'عام';
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card rounded-xl shadow-luxury hover:shadow-luxury-md transition-luxury cursor-pointer overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Icon name="Image" size={32} className="text-muted-foreground" />
          </div>
        )}
        <Image
          src={property?.image}
          alt={property?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-luxury-slow"
          onLoad={() => setImageLoading(false)}
        />
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 rtl:right-3 rtl:left-auto bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <Icon 
            name="Heart" 
            size={18}
            className={`transition-luxury ${
              property?.isFavorite 
                ? 'text-error fill-current' :'text-muted-foreground hover:text-error'
            }`}
          />
        </Button>

        {/* Property Type Badge */}
        <div className={`absolute top-3 right-3 rtl:left-3 rtl:right-auto px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(property?.type)}`}>
          {getTypeLabel(property?.type)}
        </div>

        {/* Rating Badge */}
        {property?.rating && (
          <div className="absolute bottom-3 left-3 rtl:right-3 rtl:left-auto bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1 rtl:space-x-reverse">
            <Icon name="Star" size={12} className="text-accent fill-current" />
            <span className="text-xs font-medium">{property?.rating}</span>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {property?.name}
          </h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span className="text-sm font-caption">{property?.location}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-3">
          {property?.amenities?.slice(0, 3)?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1 rtl:space-x-reverse text-muted-foreground">
              <Icon name={amenity?.icon} size={12} />
              <span className="text-xs font-caption">{amenity?.label}</span>
            </div>
          ))}
          {property?.amenities?.length > 3 && (
            <span className="text-xs text-muted-foreground">+{property?.amenities?.length - 3}</span>
          )}
        </div>

        {/* Price and Booking */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
            <span className="text-xl font-heading font-bold text-foreground">
              {property?.pricePerNight}
            </span>
            <span className="text-sm text-muted-foreground font-caption">
              د.أ / ليلة
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              handleCardClick();
            }}
            className="text-xs"
          >
            عرض التفاصيل
          </Button>
        </div>

        {/* Availability Status */}
        {property?.availabilityStatus && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className={`flex items-center space-x-2 rtl:space-x-reverse text-xs ${
              property?.availabilityStatus === 'available' ?'text-success' 
                : property?.availabilityStatus === 'limited' ?'text-warning' :'text-error'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                property?.availabilityStatus === 'available' ?'bg-success' 
                  : property?.availabilityStatus === 'limited' ?'bg-warning' :'bg-error'
              }`}></div>
              <span className="font-medium">
                {property?.availabilityStatus === 'available' && 'متاح للحجز'}
                {property?.availabilityStatus === 'limited' && 'مواعيد محدودة'}
                {property?.availabilityStatus === 'booked' && 'محجوز'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;