import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapViewToggle = ({ 
  isMapView = false,
  onToggle = () => {},
  properties = [],
  onPropertySelect = () => {}
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handlePropertyMarkerClick = (property) => {
    setSelectedProperty(property);
    onPropertySelect(property);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="fixed bottom-20 md:bottom-6 left-4 z-40">
        <Button
          onClick={onToggle}
          className={`shadow-luxury-lg ${
            isMapView 
              ? 'bg-background text-foreground border border-border' 
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <Icon name={isMapView ? 'List' : 'Map'} size={18} />
          <span className="mr-2 rtl:ml-2">
            {isMapView ? 'عرض القائمة' : 'عرض الخريطة'}
          </span>
        </Button>
      </div>
      {/* Map View */}
      {isMapView && (
        <div className="fixed inset-0 top-32 md:top-36 z-30 bg-background">
          <div className="relative w-full h-full">
            {/* Google Maps Iframe */}
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="خريطة الشاليهات في الأردن"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=31.9539,35.9106&z=8&output=embed"
              className="w-full h-full border-0"
            />

            {/* Property Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {properties?.slice(0, 10)?.map((property, index) => {
                // Mock positioning for demonstration
                const positions = [
                  { top: '20%', left: '30%' },
                  { top: '35%', left: '45%' },
                  { top: '50%', left: '25%' },
                  { top: '25%', left: '60%' },
                  { top: '65%', left: '40%' },
                  { top: '40%', left: '70%' },
                  { top: '55%', left: '55%' },
                  { top: '30%', left: '80%' },
                  { top: '70%', left: '20%' },
                  { top: '45%', left: '35%' }
                ];

                const position = positions?.[index] || { top: '50%', left: '50%' };

                return (
                  <div
                    key={property?.id}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: position?.top, left: position?.left }}
                  >
                    <button
                      onClick={() => handlePropertyMarkerClick(property)}
                      className={`bg-primary text-primary-foreground px-3 py-2 rounded-full shadow-luxury-md hover:shadow-luxury-lg transition-luxury text-sm font-medium whitespace-nowrap ${
                        selectedProperty?.id === property?.id ? 'ring-2 ring-accent ring-offset-2' : ''
                      }`}
                    >
                      {formatPrice(property?.pricePerNight)}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Property Info Card */}
            {selectedProperty && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80 bg-card border border-border rounded-lg shadow-luxury-lg p-4 animate-slide-up">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={selectedProperty?.images?.[0]}
                      alt={selectedProperty?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-card-foreground line-clamp-1">
                      {selectedProperty?.name}
                    </h3>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-muted-foreground text-sm mt-1">
                      <Icon name="MapPin" size={12} />
                      <span className="line-clamp-1">
                        {selectedProperty?.location}, {selectedProperty?.governorate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-primary font-heading font-bold">
                        {formatPrice(selectedProperty?.pricePerNight)}
                        <span className="text-xs text-muted-foreground font-normal mr-1 rtl:ml-1">
                          /ليلة
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPropertySelect(selectedProperty)}
                      >
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-2 right-2"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewToggle;