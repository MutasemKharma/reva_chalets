import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactActions = ({ 
  property = {},
  onInquiryClick = () => {},
  onShare = () => {},
  onFavoriteToggle = () => {},
  isFavorite = false
}) => {
  const [showContactOptions, setShowContactOptions] = useState(false);

  const {
    contact = {},
    price = 0
  } = property;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const handlePhoneCall = () => {
    if (contact?.phone) {
      window.location.href = `tel:${contact?.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (contact?.whatsapp) {
      const message = encodeURIComponent(`مرحباً، أود الاستفسار عن ${property?.name}`);
      window.open(`https://wa.me/${contact?.whatsapp}?text=${message}`, '_blank');
    }
  };

  const toggleContactOptions = () => {
    setShowContactOptions(!showContactOptions);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <div className="sticky top-32 space-y-4">
          {/* Price Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-luxury">
            <div className="text-center mb-6">
              <div className="text-3xl font-heading font-bold text-accent mb-1">
                {formatPrice(price)}
              </div>
              <div className="text-sm text-muted-foreground">لليلة الواحدة</div>
            </div>

            <div className="space-y-3">
              <Button
                fullWidth
                onClick={onInquiryClick}
                className="text-lg py-3"
              >
                <Icon name="MessageSquare" size={20} />
                <span className="mr-2 rtl:ml-2">إرسال استفسار</span>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handlePhoneCall}
                  disabled={!contact?.phone}
                >
                  <Icon name="Phone" size={18} />
                  <span className="mr-2 rtl:ml-2">اتصال</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleWhatsApp}
                  disabled={!contact?.whatsapp}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Icon name="MessageCircle" size={18} />
                  <span className="mr-2 rtl:ml-2">واتساب</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-luxury">
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
              >
                <Icon name="Share2" size={16} />
                <span className="mr-2 rtl:ml-2">مشاركة</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onFavoriteToggle}
                className={isFavorite ? 'text-error' : ''}
              >
                <Icon 
                  name="Heart" 
                  size={16} 
                  className={isFavorite ? 'fill-current' : ''} 
                />
                <span className="mr-2 rtl:ml-2">
                  {isFavorite ? 'محفوظ' : 'حفظ'}
                </span>
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          {(contact?.phone || contact?.email) && (
            <div className="bg-card border border-border rounded-lg p-4 shadow-luxury">
              <h3 className="font-medium text-foreground mb-3">معلومات التواصل</h3>
              <div className="space-y-2 text-sm">
                {contact?.phone && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon name="Phone" size={14} className="text-muted-foreground" />
                    <span className="text-foreground font-mono">{contact?.phone}</span>
                  </div>
                )}
                {contact?.email && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon name="Mail" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">{contact?.email}</span>
                  </div>
                )}
                {contact?.hours && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-foreground">{contact?.hours}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-luxury border-t border-border safe-area-pb">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Price Display */}
            <div className="flex-1">
              <div className="text-lg font-heading font-bold text-accent">
                {formatPrice(price)}
              </div>
              <div className="text-xs text-muted-foreground">لليلة الواحدة</div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={onFavoriteToggle}
                className={isFavorite ? 'text-error' : ''}
              >
                <Icon 
                  name="Heart" 
                  size={20} 
                  className={isFavorite ? 'fill-current' : ''} 
                />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleContactOptions}
              >
                <Icon name="Phone" size={20} />
              </Button>

              <Button
                onClick={onInquiryClick}
                className="px-6"
              >
                <Icon name="MessageSquare" size={18} />
                <span className="mr-2 rtl:ml-2">استفسار</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Contact Options Modal */}
      {showContactOptions && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={toggleContactOptions}
          />
          
          <div className="relative w-full max-w-sm mx-4 bg-popover border border-border rounded-t-2xl shadow-luxury-xl animate-slide-up">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg">التواصل</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleContactOptions}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-3">
                {contact?.phone && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      handlePhoneCall();
                      toggleContactOptions();
                    }}
                  >
                    <Icon name="Phone" size={18} />
                    <div className="mr-3 rtl:ml-3 text-right rtl:text-left">
                      <div className="font-medium">اتصال مباشر</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {contact?.phone}
                      </div>
                    </div>
                  </Button>
                )}

                {contact?.whatsapp && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      handleWhatsApp();
                      toggleContactOptions();
                    }}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Icon name="MessageCircle" size={18} />
                    <div className="mr-3 rtl:ml-3 text-right rtl:text-left">
                      <div className="font-medium">واتساب</div>
                      <div className="text-sm text-muted-foreground">
                        محادثة فورية
                      </div>
                    </div>
                  </Button>
                )}

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    onInquiryClick();
                    toggleContactOptions();
                  }}
                >
                  <Icon name="MessageSquare" size={18} />
                  <div className="mr-3 rtl:ml-3 text-right rtl:text-left">
                    <div className="font-medium">إرسال استفسار</div>
                    <div className="text-sm text-muted-foreground">
                      نموذج تفصيلي
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactActions;