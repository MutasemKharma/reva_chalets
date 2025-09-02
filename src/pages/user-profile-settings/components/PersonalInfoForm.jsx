import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalInfoForm = ({ 
  user = {},
  onSave = () => {},
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || 'أحمد محمد العلي',
    email: user?.email || 'ahmed.ali@example.com',
    phone: user?.phone || '+962791234567',
    city: user?.city || 'amman',
    dateOfBirth: user?.dateOfBirth || '1990-05-15',
    gender: user?.gender || 'male'
  });

  const [errors, setErrors] = useState({});

  const jordanianCities = [
    { value: 'amman', label: 'عمان' },
    { value: 'zarqa', label: 'الزرقاء' },
    { value: 'irbid', label: 'إربد' },
    { value: 'aqaba', label: 'العقبة' },
    { value: 'salt', label: 'السلط' },
    { value: 'madaba', label: 'مادبا' },
    { value: 'jerash', label: 'جرش' },
    { value: 'ajloun', label: 'عجلون' },
    { value: 'karak', label: 'الكرك' },
    { value: 'tafilah', label: 'الطفيلة' },
    { value: 'maan', label: 'معان' },
    { value: 'mafraq', label: 'المفرق' }
  ];

  const genderOptions = [
    { value: 'male', label: 'ذكر' },
    { value: 'female', label: 'أنثى' }
  ];

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

    if (!formData?.name?.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'الاسم يجب أن يكون أكثر من حرفين';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\+962[0-9]{9}$/?.test(formData?.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ +962 ويتكون من 9 أرقام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-luxury">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">المعلومات الشخصية</h2>
          <p className="text-sm text-muted-foreground font-caption">قم بتحديث معلوماتك الشخصية</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="الاسم الكامل"
            type="text"
            placeholder="أدخل اسمك الكامل"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
            className="text-right rtl:text-right"
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@domain.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="رقم الهاتف"
            type="tel"
            placeholder="+962791234567"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            description="يجب أن يبدأ الرقم بـ +962"
            required
          />

          <Select
            label="المحافظة"
            options={jordanianCities}
            value={formData?.city}
            onChange={(value) => handleInputChange('city', value)}
            placeholder="اختر المحافظة"
            searchable
          />

          <Input
            label="تاريخ الميلاد"
            type="date"
            value={formData?.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
          />

          <Select
            label="الجنس"
            options={genderOptions}
            value={formData?.gender}
            onChange={(value) => handleInputChange('gender', value)}
            placeholder="اختر الجنس"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            loading={isLoading}
            iconName="Save"
            iconPosition="right"
            className="min-w-32"
          >
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;