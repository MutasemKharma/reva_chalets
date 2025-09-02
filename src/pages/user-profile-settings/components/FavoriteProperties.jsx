import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FavoriteProperties = ({ favorites = [] }) => {
  const [localFavorites, setLocalFavorites] = useState(favorites);

  const mockFavorites = [
    {
      id: 1,
      title: 'شاليه الواحة الذهبية',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      location: 'عمان، الأردن',
      pricePerNight: 150,
      rating: 4.8,
      reviewCount: 24,
      type: 'family',
      amenities: ['مسبح', 'واي فاي', 'موقف سيارات'],
      addedDate: '2024-08-15'
    },
    {
      id: 2,
      title: 'مزرعة الربيع الأخضر',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      location: 'جرش، الأردن',
      pricePerNight: 120,
      rating: 4.6,
      reviewCount: 18,
      type: 'youth',
      amenities: ['شواء', 'ملعب', 'حديقة'],
      addedDate: '2024-08-10'
    },
    {
      id: 3,
      title: 'شاليه النسيم البحري',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      location: 'العقبة، الأردن',
      pricePerNight: 200,
      rating: 4.9,
      reviewCount: 31,
      type: 'family',
      amenities: ['إطلالة بحرية', 'مسبح', 'مطبخ'],
      addedDate: '2024-08-05'
    }
  ];

  const displayFavorites = localFavorites?.length > 0 ? localFavorites : mockFavorites;

  const handleRemoveFavorite = (propertyId) => {
    setLocalFavorites(prev => prev?.filter(fav => fav?.id !== propertyId));
  };

  const getTypeLabel = (type) => {
    return type === 'family' ? 'عائلي' : 'شبابي';
  };

  const getTypeColor = (type) => {
    return type === 'family' ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary/10';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('ar-JO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-luxury">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">الشاليهات المفضلة</h2>
            <p className="text-sm text-muted-foreground font-caption">
              شاليهاتك المحفوظة ({displayFavorites?.length} شاليه)
            </p>
          </div>
        </div>

        {displayFavorites?.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            iconName="Search"
            onClick={() => {/* Navigate to browse with favorites filter */}}
          >
            استكشف المزيد
          </Button>
        )}
      </div>
      {displayFavorites?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayFavorites?.map((property) => (
            <div
              key={property?.id}
              className="bg-background border border-border rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-md transition-luxury group"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={property?.image}
                  alt={property?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-luxury-slow"
                />
                
                {/* Remove from Favorites Button */}
                <button
                  onClick={() => handleRemoveFavorite(property?.id)}
                  className="absolute top-3 right-3 rtl:left-3 rtl:right-auto w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-error hover:bg-background transition-luxury"
                >
                  <Icon name="Heart" size={16} className="fill-current" />
                </button>

                {/* Property Type Badge */}
                <div className={`absolute top-3 left-3 rtl:right-3 rtl:left-auto px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(property?.type)}`}>
                  {getTypeLabel(property?.type)}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-semibold text-foreground text-lg leading-tight">
                    {property?.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mb-3">
                  <Icon name="MapPin" size={14} />
                  <span>{property?.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm font-medium text-foreground">{property?.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({property?.reviewCount} تقييم)</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {property?.amenities?.slice(0, 3)?.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property?.amenities?.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{property?.amenities?.length - 3}
                    </span>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-heading font-bold text-foreground">
                      {property?.pricePerNight} د.أ
                    </span>
                    <span className="text-sm text-muted-foreground">/ليلة</span>
                  </div>

                  <Link
                    to={`/property-detail-view?id=${property?.id}`}
                    className="inline-flex"
                  >
                    <Button variant="outline" size="sm" iconName="Eye">
                      عرض التفاصيل
                    </Button>
                  </Link>
                </div>

                {/* Added Date */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-mono">
                    أُضيف في {formatDate(property?.addedDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Heart" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading font-medium text-foreground mb-2">لا توجد شاليهات مفضلة</h3>
          <p className="text-muted-foreground mb-4">لم تقم بحفظ أي شاليهات بعد</p>
          <Link to="/property-listings-browse">
            <Button variant="outline" iconName="Search">
              استكشف الشاليهات
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoriteProperties;