import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminPropertyCard = ({ 
  property = {},
  onUpdate = () => {},
  onSelect = () => {},
  userRole = 'owner'
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleActive = async () => {
    try {
      setIsUpdating(true);
      await onUpdate({ is_active: !property?.is_active });
    } catch (error) {
      console.error('Error toggling property status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600' : 'text-gray-500';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative h-48 bg-muted">
        {property?.images?.[0] ? (
          <img
            src={property?.images?.[0]}
            alt={property?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="Image" size={32} className="text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${property?.is_active 
              ? 'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
            }
          `}>
            <Icon 
              name={property?.is_active ? 'CheckCircle' : 'XCircle'} 
              size={12} 
              className="mr-1 rtl:ml-1" 
            />
            {property?.is_active ? 'نشط' : 'متوقف'}
          </span>
        </div>

        {/* Actions Toggle */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          >
            <Icon name="MoreVertical" size={14} />
          </Button>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="absolute top-12 right-3 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[150px]">
            <div className="py-1">
              <button
                onClick={handleToggleActive}
                disabled={isUpdating}
                className="w-full px-3 py-2 text-right rtl:text-right text-sm text-foreground hover:bg-accent flex items-center"
              >
                <Icon 
                  name={property?.is_active ? 'PauseCircle' : 'PlayCircle'} 
                  size={14} 
                  className="ml-2 rtl:mr-2" 
                />
                {property?.is_active ? 'إيقاف مؤقت' : 'تفعيل'}
              </button>
              
              <button
                onClick={onSelect}
                className="w-full px-3 py-2 text-right rtl:text-right text-sm text-foreground hover:bg-accent flex items-center"
              >
                <Icon name="Calendar" size={14} className="ml-2 rtl:mr-2" />
                إدارة التوفر
              </button>
              
              <button
                onClick={() => {/* TODO: Add edit functionality */}}
                className="w-full px-3 py-2 text-right rtl:text-right text-sm text-foreground hover:bg-accent flex items-center"
              >
                <Icon name="Edit" size={14} className="ml-2 rtl:mr-2" />
                تعديل
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-1">
            {property?.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            {property?.city}, {property?.governorate}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-accent">
              {formatPrice(property?.price_per_night)}
            </span>
            <span className="text-muted-foreground text-sm mr-1 rtl:ml-1">
              / ليلة
            </span>
          </div>
          
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Icon name="Star" size={14} className="text-yellow-500" />
            <span className="text-sm text-muted-foreground">4.5</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="MapPin" size={14} className="ml-1 rtl:mr-1" />
          <span className="capitalize">{property?.type}</span>
          <span className="mx-2">•</span>
          <Icon name="Users" size={14} className="ml-1 rtl:mr-1" />
          <span>للعائلات</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">استفسار هذا الشهر</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">85%</div>
            <div className="text-xs text-muted-foreground">معدل الحجز</div>
          </div>
        </div>
      </div>

      {/* Owner Info (for admin) */}
      {userRole === 'admin' && property?.owner && (
        <div className="px-4 pb-4">
          <div className="bg-muted rounded-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">
                  {property?.owner?.full_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {property?.owner?.email}
                </div>
              </div>
              <div className="flex space-x-1 rtl:space-x-reverse">
                {property?.owner?.phone && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => window.open(`tel:${property?.owner?.phone}`)}
                  >
                    <Icon name="Phone" size={12} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => window.open(`mailto:${property?.owner?.email}`)}
                >
                  <Icon name="Mail" size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click handler for the entire card */}
      <div 
        className="absolute inset-0 cursor-pointer z-0"
        onClick={onSelect}
      />
    </div>
  );
};

export default AdminPropertyCard;