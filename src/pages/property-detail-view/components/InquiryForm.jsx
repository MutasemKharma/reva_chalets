import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InquiryForm = ({ 
  property = {}, 
  isOpen = false, 
  onClose = () => {}, 
  onSubmit = () => {} 
}) => {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.checkIn) {
      newErrors.checkIn = 'تاريخ الوصول مطلوب';
    }
    if (!formData?.checkOut) {
      newErrors.checkOut = 'تاريخ المغادرة مطلوب';
    }
    if (formData?.checkIn && formData?.checkOut && new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      newErrors.checkOut = 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول';
    }
    if (!formData?.name?.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }
    if (!formData?.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        propertyId: property?.id,
        propertyName: property?.name,
        submittedAt: new Date()?.toISOString()
      });
      
      // Reset form
      setFormData({
        checkIn: '',
        checkOut: '',
        guests: 1,
        name: '',
        phone: '',
        email: '',
        message: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNights = () => {
    if (formData?.checkIn && formData?.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * (property?.price || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-popover border border-border rounded-t-2xl md:rounded-2xl shadow-luxury-xl animate-slide-up md:animate-scale-in max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            إرسال استفسار
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Property Info */}
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-medium text-foreground mb-2">{property?.name}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">السعر لليلة الواحدة</span>
              <span className="font-medium text-accent">
                {new Intl.NumberFormat('ar-JO', {
                  style: 'currency',
                  currency: 'JOD',
                  minimumFractionDigits: 0
                })?.format(property?.price || 0)}
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="تاريخ الوصول"
              value={formData?.checkIn}
              onChange={(e) => handleInputChange('checkIn', e?.target?.value)}
              error={errors?.checkIn}
              min={new Date()?.toISOString()?.split('T')?.[0]}
              required
            />
            <Input
              type="date"
              label="تاريخ المغادرة"
              value={formData?.checkOut}
              onChange={(e) => handleInputChange('checkOut', e?.target?.value)}
              error={errors?.checkOut}
              min={formData?.checkIn || new Date()?.toISOString()?.split('T')?.[0]}
              required
            />
          </div>

          {/* Guests */}
          <Input
            type="number"
            label="عدد الضيوف"
            value={formData?.guests}
            onChange={(e) => handleInputChange('guests', parseInt(e?.target?.value) || 1)}
            min="1"
            max="20"
            required
          />

          {/* Booking Summary */}
          {calculateNights() > 0 && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>عدد الليالي</span>
                  <span>{calculateNights()} ليلة</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الضيوف</span>
                  <span>{formData?.guests} ضيف</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-primary/20">
                  <span>المجموع التقديري</span>
                  <span className="text-accent">
                    {new Intl.NumberFormat('ar-JO', {
                      style: 'currency',
                      currency: 'JOD',
                      minimumFractionDigits: 0
                    })?.format(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">معلومات التواصل</h3>
            
            <Input
              type="text"
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              type="tel"
              label="رقم الهاتف"
              placeholder="07XXXXXXXX"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
              required
            />

            <Input
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@email.com"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                رسالة إضافية (اختياري)
              </label>
              <textarea
                value={formData?.message}
                onChange={(e) => handleInputChange('message', e?.target?.value)}
                placeholder="أضف أي طلبات خاصة أو استفسارات إضافية..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستفسار'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InquiryForm;