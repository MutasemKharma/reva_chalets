import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PropertyLocationMap = ({ location = {} }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const {
    address = '',
    city = '',
    governorate = '',
    coordinates = { lat: 31.9539, lng: 35.9106 }, // Default to Amman
    nearbyPlaces = []
  } = location;

  const mapSrc = `https://www.google.com/maps?q=${coordinates?.lat},${coordinates?.lng}&z=14&output=embed`;

  const toggleMapExpansion = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-heading font-semibold text-foreground">
        الموقع
      </h2>
      {/* Address Information */}
      <div className="space-y-2">
        <div className="flex items-start space-x-2 rtl:space-x-reverse">
          <Icon name="MapPin" size={18} className="text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">{address}</p>
            <p className="text-sm text-muted-foreground">{city}, {governorate}</p>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className={`relative bg-muted rounded-lg overflow-hidden transition-all duration-300 ${
        isMapExpanded ? 'h-96' : 'h-48'
      }`}>
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={`موقع ${address}`}
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          className="border-0"
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMapExpansion}
            className="bg-background/90 backdrop-blur-sm hover:bg-background w-10 h-10"
          >
            <Icon name={isMapExpanded ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
        </div>

        {/* External Map Link */}
        <div className="absolute bottom-4 left-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://maps.google.com?q=${coordinates?.lat},${coordinates?.lng}`, '_blank')}
            className="bg-background/90 backdrop-blur-sm"
          >
            <Icon name="ExternalLink" size={14} />
            <span className="mr-2 rtl:ml-2">فتح في خرائط جوجل</span>
          </Button>
        </div>
      </div>
      {/* Nearby Places */}
      {nearbyPlaces?.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">الأماكن القريبة</h3>
          <div className="space-y-2">
            {nearbyPlaces?.map((place, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Icon name={place?.icon} size={16} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{place?.name}</p>
                    <p className="text-sm text-muted-foreground">{place?.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{place?.distance}</p>
                  <p className="text-xs text-muted-foreground">{place?.walkTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyLocationMap;