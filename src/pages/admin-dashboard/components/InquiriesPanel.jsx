import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InquiriesPanel = ({ 
  inquiries = [],
  onRespond = () => {},
  userRole = 'owner'
}) => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isResponding, setIsResponding] = useState(false);

  const filteredInquiries = inquiries?.filter(inquiry => {
    if (filterStatus === 'all') return true;
    return inquiry?.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'معلق';
      case 'responded':
        return 'تم الرد';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const handleSendResponse = async () => {
    if (!selectedInquiry || !responseText?.trim()) return;

    try {
      setIsResponding(true);
      await onRespond(selectedInquiry?.id, responseText, 'responded');
      setSelectedInquiry(null);
      setResponseText('');
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr)?.toLocaleDateString('ar-SA');
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          الاستفسارات
        </h2>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <label className="text-sm text-muted-foreground">تصفية:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">جميع الاستفسارات</option>
            <option value="pending">المعلقة</option>
            <option value="responded">تم الرد عليها</option>
            <option value="completed">المكتملة</option>
            <option value="cancelled">الملغية</option>
          </select>
        </div>
      </div>
      {/* Inquiries List */}
      {filteredInquiries?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInquiries?.map((inquiry) => (
            <div
              key={inquiry?.id}
              className="bg-card border border-border rounded-lg p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {inquiry?.property?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    بواسطة {inquiry?.guest_name}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry?.status)}`}>
                  {getStatusLabel(inquiry?.status)}
                </span>
              </div>

              {/* Property Image */}
              {inquiry?.property?.images?.[0] && (
                <div className="h-24 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={inquiry?.property?.images?.[0]}
                    alt={inquiry?.property?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Booking Details */}
              {inquiry?.check_in_date && inquiry?.check_out_date && (
                <div className="bg-muted rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">تاريخ الوصول:</span>
                      <div className="font-medium text-foreground">
                        {formatDate(inquiry?.check_in_date)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">تاريخ المغادرة:</span>
                      <div className="font-medium text-foreground">
                        {formatDate(inquiry?.check_out_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      <span className="text-muted-foreground">عدد الليالي:</span>
                      <span className="font-medium text-foreground mr-1">
                        {calculateNights(inquiry?.check_in_date, inquiry?.check_out_date)} ليلة
                      </span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">عدد الضيوف:</span>
                      <span className="font-medium text-foreground mr-1">
                        {inquiry?.guests_count} ضيف
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">رسالة الضيف:</h4>
                <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                  {inquiry?.message}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">معلومات التواصل:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon name="Mail" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">{inquiry?.guest_email}</span>
                  </div>
                  {inquiry?.guest_phone && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Icon name="Phone" size={14} className="text-muted-foreground" />
                      <span className="text-foreground font-mono">{inquiry?.guest_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Response */}
              {inquiry?.owner_response && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">ردك:</h4>
                  <p className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
                    {inquiry?.owner_response}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {new Date(inquiry?.created_at)?.toLocaleString('ar-SA')}
                </div>
                
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {inquiry?.guest_email && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`mailto:${inquiry?.guest_email}`)}
                    >
                      <Icon name="Mail" size={14} />
                      <span className="mr-1 rtl:ml-1">إيميل</span>
                    </Button>
                  )}
                  
                  {inquiry?.guest_phone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`tel:${inquiry?.guest_phone}`)}
                    >
                      <Icon name="Phone" size={14} />
                      <span className="mr-1 rtl:ml-1">اتصال</span>
                    </Button>
                  )}

                  {inquiry?.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setResponseText('');
                      }}
                    >
                      <Icon name="MessageSquare" size={14} />
                      <span className="mr-1 rtl:ml-1">رد</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {filterStatus === 'all' ? 'لا توجد استفسارات بعد' : `لا توجد استفسارات ${getStatusLabel(filterStatus)}`}
          </p>
        </div>
      )}
      {/* Response Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-popover border border-border rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                الرد على الاستفسار
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedInquiry(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm font-medium text-foreground mb-1">
                  {selectedInquiry?.guest_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedInquiry?.property?.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  رسالتك للضيف:
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e?.target?.value)}
                  placeholder="اكتب ردك هنا..."
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  onClick={handleSendResponse}
                  disabled={!responseText?.trim() || isResponding}
                  loading={isResponding}
                  className="flex-1"
                >
                  {isResponding ? 'جاري الإرسال...' : 'إرسال الرد'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                  disabled={isResponding}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPanel;