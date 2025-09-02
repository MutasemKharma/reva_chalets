import React from 'react';
import Icon from '../../../components/AppIcon';

const PropertyInfoSection = ({ property = {} }) => {
  const {
    name = '',
    type = '',
    location = {},
    price = 0,
    rating = 0,
    reviewCount = 0,
    description = '',
    features = []
  } = property;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-accent fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={16} className="text-accent fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'family':
        return 'Users';
      case 'youth':
        return 'Zap';
      default:
        return 'Home';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'family':
        return 'عائلي';
      case 'youth':
        return 'شبابي';
      default:
        return 'شاليه';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              {name}
            </h1>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-muted-foreground">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Icon name="MapPin" size={16} />
                <span className="text-sm">{location?.city}, {location?.governorate}</span>
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Icon name={getTypeIcon(type)} size={16} />
                <span className="text-sm">{getTypeLabel(type)}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl md:text-3xl font-heading font-bold text-accent">
              {formatPrice(price)}
            </div>
            <div className="text-sm text-muted-foreground">لليلة الواحدة</div>
          </div>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {renderStars(rating)}
            </div>
            <span className="text-sm font-medium">{rating?.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} تقييم)
            </span>
          </div>
        )}
      </div>
      {/* Description */}
      {description && (
        <div className="space-y-2">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            الوصف
          </h2>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}
      {/* Features */}
      {features?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            المميزات والخدمات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rtl:space-x-reverse p-3 bg-card rounded-lg border border-border"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Icon name={feature?.icon} size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {feature?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyInfoSection;