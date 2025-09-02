import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const InquiryCard = ({ inquiry, onStatusUpdate, onSendMessage, onCallOwner }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'مؤكد',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          borderColor: 'border-success/20',
          icon: 'CheckCircle'
        };
      case 'responded':
        return {
          label: 'تم الرد',
          bgColor: 'bg-secondary/10',
          textColor: 'text-secondary',
          borderColor: 'border-secondary/20',
          icon: 'MessageCircle'
        };
      case 'pending':
        return {
          label: 'في الانتظار',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          borderColor: 'border-warning/20',
          icon: 'Clock'
        };
      case 'declined':
        return {
          label: 'مرفوض',
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          borderColor: 'border-destructive/20',
          icon: 'XCircle'
        };
      default:
        return {
          label: 'غير محدد',
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          borderColor: 'border-muted',
          icon: 'HelpCircle'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('ar-JO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('ar-JO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'منذ قليل';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const statusConfig = getStatusConfig(inquiry?.status);

  const handlePropertyClick = () => {
    navigate(`/property-detail-view?id=${inquiry?.propertyId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-luxury overflow-hidden">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          {/* Property Image */}
          <div 
            className="w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
            onClick={handlePropertyClick}
          >
            <Image
              src={inquiry?.propertyImage}
              alt={inquiry?.propertyName}
              className="w-full h-full object-cover hover:scale-105 transition-luxury"
            />
          </div>

          {/* Inquiry Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-heading font-semibold text-lg text-foreground truncate cursor-pointer hover:text-primary transition-luxury"
                  onClick={handlePropertyClick}
                >
                  {inquiry?.propertyName}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {inquiry?.location}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  تاريخ الاستفسار: {formatDate(inquiry?.createdAt)}
                </p>
              </div>

              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full border ${statusConfig?.bgColor} ${statusConfig?.textColor} ${statusConfig?.borderColor} shrink-0`}>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Icon name={statusConfig?.icon} size={14} />
                  <span className="text-xs font-medium">{statusConfig?.label}</span>
                </div>
              </div>
            </div>

            {/* Inquiry Summary */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span>{formatDate(inquiry?.checkIn)} - {formatDate(inquiry?.checkOut)}</span>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Icon name="Users" size={14} className="text-muted-foreground" />
                  <span>{inquiry?.guestCount} ضيف</span>
                </div>
              </div>
              
              {inquiry?.lastMessage && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  آخر رسالة: {inquiry?.lastMessage}
                </p>
              )}
              
              <p className="text-xs text-muted-foreground font-mono">
                آخر تحديث: {getTimeAgo(inquiry?.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            <span className="mr-2 rtl:ml-2">
              {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCallOwner(inquiry?.ownerPhone)}
          >
            <Icon name="Phone" size={16} />
            <span className="mr-2 rtl:ml-2">اتصال</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => onSendMessage(inquiry?.id)}
          >
            <Icon name="MessageSquare" size={16} />
            <span className="mr-2 rtl:ml-2">رسالة</span>
          </Button>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 p-4 animate-slide-down">
          {/* Original Message */}
          <div className="mb-4">
            <h4 className="font-medium text-sm text-foreground mb-2">الرسالة الأصلية:</h4>
            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-sm text-foreground leading-relaxed">
                {inquiry?.originalMessage}
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {formatDate(inquiry?.createdAt)} في {formatTime(inquiry?.createdAt)}
              </p>
            </div>
          </div>

          {/* Conversation Thread */}
          {inquiry?.messages && inquiry?.messages?.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-foreground">المحادثة:</h4>
              {inquiry?.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message?.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message?.sender === 'user' ?'bg-primary text-primary-foreground' :'bg-background border border-border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message?.content}</p>
                    <p className={`text-xs mt-2 font-mono ${
                      message?.sender === 'user' ?'text-primary-foreground/70' :'text-muted-foreground'
                    }`}>
                      {message?.sender === 'user' ? 'أنت' : 'مالك العقار'} • {formatTime(message?.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Property Owner Info */}
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-foreground mb-2">معلومات مالك العقار:</h4>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{inquiry?.ownerName}</p>
                <p className="text-xs text-muted-foreground font-mono">{inquiry?.ownerPhone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryCard;