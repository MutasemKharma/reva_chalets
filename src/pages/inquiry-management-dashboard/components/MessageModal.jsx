import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MessageModal = ({ isOpen, onClose, inquiry, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message?.trim()) return;

    setIsLoading(true);
    try {
      await onSendMessage(inquiry?.id, message?.trim());
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen || !inquiry) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-lg shadow-luxury-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-semibold text-lg text-foreground truncate">
                إرسال رسالة متابعة
              </h2>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {inquiry?.propertyName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Inquiry Summary */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span>{new Date(inquiry.checkIn)?.toLocaleDateString('ar-JO')} - {new Date(inquiry.checkOut)?.toLocaleDateString('ar-JO')}</span>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Icon name="Users" size={14} className="text-muted-foreground" />
                  <span>{inquiry?.guestCount} ضيف</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                تاريخ الاستفسار: {new Date(inquiry.createdAt)?.toLocaleDateString('ar-JO')}
              </p>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                رسالتك
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالة متابعة للمالك..."
                className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-luxury"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                {message?.length}/500 حرف
              </p>
            </div>

            {/* Quick Message Templates */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                رسائل سريعة
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'هل العقار متاح للتواريخ المطلوبة؟',
                  'هل يمكن التفاوض على السعر؟',
                  'ما هي المرافق المتوفرة؟',
                  'هل يوجد موقف سيارات؟'
                ]?.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(template)}
                    className="justify-start text-right"
                    disabled={isLoading}
                  >
                    <Icon name="MessageSquare" size={14} />
                    <span className="mr-2 rtl:ml-2">{template}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse p-6 border-t border-border bg-muted/30">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              variant="default"
              onClick={handleSendMessage}
              disabled={!message?.trim() || isLoading}
              loading={isLoading}
            >
              <Icon name="Send" size={16} />
              <span className="mr-2 rtl:ml-2">إرسال الرسالة</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageModal;