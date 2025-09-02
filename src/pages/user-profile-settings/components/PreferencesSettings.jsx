import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreferencesSettings = ({ 
  preferences = {},
  onSave = () => {},
  isLoading = false 
}) => {
  const [settings, setSettings] = useState({
    language: preferences?.language || 'ar',
    currency: preferences?.currency || 'jod',
    emailNotifications: preferences?.emailNotifications || true,
    smsNotifications: preferences?.smsNotifications || false,
    promotionalOffers: preferences?.promotionalOffers || true,
    inquiryUpdates: preferences?.inquiryUpdates || true,
    weeklyNewsletter: preferences?.weeklyNewsletter || false,
    bookingReminders: preferences?.bookingReminders || true
  });

  const languageOptions = [
    { value: 'ar', label: 'العربية', description: 'Arabic' },
    { value: 'en', label: 'English', description: 'الإنجليزية' }
  ];

  const currencyOptions = [
    { value: 'jod', label: 'دينار أردني (JOD)', description: 'Jordanian Dinar' },
    { value: 'usd', label: 'دولار أمريكي (USD)', description: 'US Dollar' },
    { value: 'eur', label: 'يورو (EUR)', description: 'Euro' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-luxury">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">إعدادات التفضيلات</h2>
          <p className="text-sm text-muted-foreground font-caption">خصص تجربتك في التطبيق</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Language & Currency */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground border-b border-border pb-2">
            اللغة والعملة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="اللغة المفضلة"
              options={languageOptions}
              value={settings?.language}
              onChange={(value) => handleSettingChange('language', value)}
              description="اختر لغة واجهة التطبيق"
            />

            <Select
              label="العملة المفضلة"
              options={currencyOptions}
              value={settings?.currency}
              onChange={(value) => handleSettingChange('currency', value)}
              description="اختر العملة لعرض الأسعار"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground border-b border-border pb-2">
            إعدادات الإشعارات
          </h3>
          
          <div className="space-y-4">
            <Checkbox
              label="إشعارات البريد الإلكتروني"
              description="تلقي إشعارات عبر البريد الإلكتروني"
              checked={settings?.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="إشعارات الرسائل النصية"
              description="تلقي إشعارات عبر الرسائل النصية"
              checked={settings?.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="تحديثات الاستفسارات"
              description="إشعارات حول حالة استفساراتك وحجوزاتك"
              checked={settings?.inquiryUpdates}
              onChange={(e) => handleSettingChange('inquiryUpdates', e?.target?.checked)}
            />

            <Checkbox
              label="تذكيرات الحجز"
              description="تذكيرات قبل موعد الحجز بيوم واحد"
              checked={settings?.bookingReminders}
              onChange={(e) => handleSettingChange('bookingReminders', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Marketing Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground border-b border-border pb-2">
            العروض والتسويق
          </h3>
          
          <div className="space-y-4">
            <Checkbox
              label="العروض الترويجية"
              description="تلقي إشعارات حول العروض الخاصة والخصومات"
              checked={settings?.promotionalOffers}
              onChange={(e) => handleSettingChange('promotionalOffers', e?.target?.checked)}
            />

            <Checkbox
              label="النشرة الأسبوعية"
              description="تلقي نشرة أسبوعية بأحدث الشاليهات والعروض"
              checked={settings?.weeklyNewsletter}
              onChange={(e) => handleSettingChange('weeklyNewsletter', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="right"
            className="min-w-32"
          >
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;