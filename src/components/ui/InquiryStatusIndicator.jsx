import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const InquiryStatusIndicator = ({ 
  inquiries = [],
  onMarkAsRead = () => {},
  onInquiryClick = () => {},
  isVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = inquiries?.filter(inquiry => !inquiry?.isRead)?.length;
    setUnreadCount(unread);
  }, [inquiries]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'responded':
        return { icon: 'MessageCircle', color: 'text-primary' };
      case 'confirmed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'cancelled':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'MessageSquare', color: 'text-muted-foreground' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'responded':
        return 'تم الرد';
      case 'confirmed':
        return 'مؤكد';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const handleInquiryClick = (inquiry) => {
    if (!inquiry?.isRead) {
      onMarkAsRead(inquiry?.id);
    }
    onInquiryClick(inquiry);
  };

  if (!isVisible || inquiries?.length === 0) return null;

  return (
    <div className="relative">
      {/* Badge Indicator */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative"
        >
          <Icon name="Bell" size={20} />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </Button>
      </div>
      {/* Notification Panel */}
      {isExpanded && (
        <div className="absolute top-12 right-0 w-80 max-w-[90vw] bg-popover border border-border rounded-lg shadow-luxury-lg z-50 animate-scale-in">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg">الإشعارات</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} إشعار جديد
              </p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {inquiries?.slice(0, 10)?.map((inquiry) => {
              const statusInfo = getStatusIcon(inquiry?.status);
              
              return (
                <div
                  key={inquiry?.id}
                  onClick={() => handleInquiryClick(inquiry)}
                  className={`p-4 border-b border-border last:border-b-0 cursor-pointer transition-luxury hover:bg-muted ${
                    !inquiry?.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className={`shrink-0 ${statusInfo?.color}`}>
                      <Icon name={statusInfo?.icon} size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {inquiry?.propertyTitle}
                        </h4>
                        {!inquiry?.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0 mr-2 rtl:ml-2"></div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        الحالة: {getStatusLabel(inquiry?.status)}
                      </p>
                      
                      {inquiry?.lastMessage && (
                        <p className="text-sm text-foreground mt-2 line-clamp-2">
                          {inquiry?.lastMessage}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2 font-mono">
                        {formatTimestamp(inquiry?.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {inquiries?.length > 10 && (
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {
                  setIsExpanded(false);
                  onInquiryClick({ viewAll: true });
                }}
              >
                عرض جميع الاستفسارات
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default InquiryStatusIndicator;