import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PropertyImageGallery = ({ images = [], propertyName = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!images?.length) return null;

  return (
    <>
      {/* Main Gallery */}
      <div className="relative w-full h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
        <Image
          src={images?.[currentImageIndex]}
          alt={`${propertyName} - صورة ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-10 h-10"
            >
              <Icon name="ChevronLeft" size={20} className="rtl:rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-10 h-10"
            >
              <Icon name="ChevronRight" size={20} className="rtl:rotate-180" />
            </Button>
          </>
        )}

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-10 h-10"
        >
          <Icon name="Maximize2" size={18} />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium">
            {currentImageIndex + 1} / {images?.length}
          </span>
        </div>
      </div>
      {/* Thumbnail Navigation */}
      {images?.length > 1 && (
        <div className="mt-4 flex space-x-2 rtl:space-x-reverse overflow-x-auto scrollbar-hide">
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-luxury ${
                index === currentImageIndex
                  ? 'border-primary shadow-luxury'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Image
                src={image}
                alt={`${propertyName} - مصغرة ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-luxury">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-12 h-12"
            >
              <Icon name="X" size={24} />
            </Button>

            <div className="relative max-w-full max-h-full">
              <Image
                src={images?.[currentImageIndex]}
                alt={`${propertyName} - صورة كاملة ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {images?.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-12 h-12"
                  >
                    <Icon name="ChevronLeft" size={24} className="rtl:rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-12 h-12"
                  >
                    <Icon name="ChevronRight" size={24} className="rtl:rotate-180" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageGallery;