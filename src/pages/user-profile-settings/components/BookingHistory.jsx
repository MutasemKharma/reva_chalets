import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingHistory = ({ bookings = [] }) => {
  const [expandedBooking, setExpandedBooking] = useState(null);

  const mockBookings = [
    {
      id: 1,
      propertyTitle: 'شاليه الواحة الذهبية',
      propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop',
      location: 'عمان، الأردن',
      checkIn: '2024-08-15',
      checkOut: '2024-08-17',
      guests: 6,
      totalPrice: 450,
      status: 'confirmed',
      bookingDate: '2024-08-01',
      inquiryId: 'INQ-2024-001'
    },
    {
      id: 2,
      propertyTitle: 'مزرعة الربيع الأخضر',
      propertyImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop',
      location: 'جرش، الأردن',
      checkIn: '2024-07-20',
      checkOut: '2024-07-22',
      guests: 8,
      totalPrice: 320,
      status: 'completed',
      bookingDate: '2024-07-05',
      inquiryId: 'INQ-2024-002'
    },
    {
      id: 3,
      propertyTitle: 'شاليه النسيم البحري',
      propertyImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
      location: 'العقبة، الأردن',
      checkIn: '2024-09-10',
      checkOut: '2024-09-12',
      guests: 4,
      totalPrice: 380,
      status: 'pending',
      bookingDate: '2024-08-25',
      inquiryId: 'INQ-2024-003'
    }
  ];

  const displayBookings = bookings?.length > 0 ? bookings : mockBookings;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { 
          label: 'مؤكد', 
          color: 'text-success', 
          bgColor: 'bg-success/10',
          icon: 'CheckCircle'
        };
      case 'completed':
        return { 
          label: 'مكتمل', 
          color: 'text-primary', 
          bgColor: 'bg-primary/10',
          icon: 'Check'
        };
      case 'pending':
        return { 
          label: 'في الانتظار', 
          color: 'text-warning', 
          bgColor: 'bg-warning/10',
          icon: 'Clock'
        };
      case 'cancelled':
        return { 
          label: 'ملغي', 
          color: 'text-error', 
          bgColor: 'bg-error/10',
          icon: 'XCircle'
        };
      default:
        return { 
          label: 'غير محدد', 
          color: 'text-muted-foreground', 
          bgColor: 'bg-muted',
          icon: 'HelpCircle'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('ar-JO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleExpanded = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-luxury">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Calendar" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">سجل الحجوزات</h2>
          <p className="text-sm text-muted-foreground font-caption">
            عرض حجوزاتك السابقة والحالية ({displayBookings?.length} حجز)
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {displayBookings?.map((booking) => {
          const statusInfo = getStatusInfo(booking?.status);
          const isExpanded = expandedBooking === booking?.id;

          return (
            <div
              key={booking?.id}
              className="border border-border rounded-lg overflow-hidden transition-luxury hover:shadow-luxury-md"
            >
              <div
                onClick={() => toggleExpanded(booking?.id)}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-luxury"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={booking?.propertyImage}
                      alt={booking?.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-semibold text-foreground truncate">
                          {booking?.propertyTitle}
                        </h3>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mt-1">
                          <Icon name="MapPin" size={14} />
                          <span>{booking?.location}</span>
                        </div>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground mt-2">
                          <span>{formatDate(booking?.checkIn)} - {formatDate(booking?.checkOut)}</span>
                          <span>{booking?.guests} ضيف</span>
                        </div>
                      </div>

                      <div className="text-left rtl:text-right shrink-0">
                        <div className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                          <Icon name={statusInfo?.icon} size={12} />
                          <span>{statusInfo?.label}</span>
                        </div>
                        <p className="text-lg font-heading font-bold text-foreground mt-2">
                          {booking?.totalPrice} د.أ
                        </p>
                      </div>
                    </div>
                  </div>

                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-muted-foreground shrink-0" 
                  />
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border bg-muted/20 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">تفاصيل الحجز</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>رقم الاستفسار: {booking?.inquiryId}</p>
                        <p>تاريخ الحجز: {formatDate(booking?.bookingDate)}</p>
                        <p>مدة الإقامة: {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} ليلة</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">الإجراءات</h4>
                      <div className="flex flex-wrap gap-2">
                        {booking?.status === 'confirmed' && (
                          <Button variant="outline" size="sm" iconName="MessageSquare">
                            تواصل مع المالك
                          </Button>
                        )}
                        {booking?.status === 'completed' && (
                          <Button variant="outline" size="sm" iconName="Star">
                            تقييم الشاليه
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" iconName="Download">
                          تحميل الفاتورة
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {displayBookings?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-medium text-foreground mb-2">لا توجد حجوزات</h3>
            <p className="text-muted-foreground mb-4">لم تقم بأي حجوزات حتى الآن</p>
            <Button variant="outline" iconName="Search">
              استكشف الشاليهات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;