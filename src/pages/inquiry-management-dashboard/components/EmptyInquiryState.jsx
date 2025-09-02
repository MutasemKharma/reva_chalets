import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyInquiryState = ({ filterType = 'all' }) => {
  const navigate = useNavigate();

  const getEmptyStateConfig = () => {
    switch (filterType) {
      case 'pending':
        return {
          icon: 'Clock',
          title: 'لا توجد استفسارات في الانتظار',
          description: 'جميع استفساراتك تم الرد عليها أو تأكيدها',
          actionText: 'تصفح الشاليهات',
          iconColor: 'text-warning'
        };
      case 'responded':
        return {
          icon: 'MessageCircle',
          title: 'لا توجد استفسارات تم الرد عليها',
          description: 'لم يتم الرد على أي من استفساراتك بعد',
          actionText: 'تصفح الشاليهات',
          iconColor: 'text-secondary'
        };
      case 'confirmed':
        return {
          icon: 'CheckCircle',
          title: 'لا توجد حجوزات مؤكدة',
          description: 'لم يتم تأكيد أي من حجوزاتك بعد',
          actionText: 'تصفح الشاليهات',
          iconColor: 'text-success'
        };
      case 'declined':
        return {
          icon: 'XCircle',
          title: 'لا توجد استفسارات مرفوضة',
          description: 'لم يتم رفض أي من استفساراتك',
          actionText: 'تصفح الشاليهات',
          iconColor: 'text-destructive'
        };
      default:
        return {
          icon: 'MessageSquare',
          title: 'لا توجد استفسارات بعد',
          description: 'ابدأ رحلتك في اكتشاف أجمل الشاليهات والمزارع في الأردن',
          actionText: 'استكشف الشاليهات',
          iconColor: 'text-primary'
        };
    }
  };

  const config = getEmptyStateConfig();

  const handleBrowseProperties = () => {
    navigate('/property-listings-browse');
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className={`w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6 ${config?.iconColor}`}>
        <Icon name={config?.icon} size={48} strokeWidth={1.5} />
      </div>
      {/* Content */}
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="font-heading font-semibold text-xl text-foreground">
          {config?.title}
        </h2>
        
        <p className="text-muted-foreground leading-relaxed">
          {config?.description}
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            variant="default"
            size="lg"
            onClick={handleBrowseProperties}
            className="px-8"
          >
            <Icon name="Search" size={18} />
            <span className="mr-2 rtl:ml-2">{config?.actionText}</span>
          </Button>
        </div>

        {/* Additional Info */}
        {filterType === 'all' && (
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Shield" size={16} className="text-success" />
                <span>حجز آمن</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Clock" size={16} className="text-primary" />
                <span>رد سريع</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Star" size={16} className="text-warning" />
                <span>جودة عالية</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyInquiryState;