import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SecuritySettings = ({ 
  onPasswordChange = () => {},
  onTwoFactorToggle = () => {},
  isLoading = false 
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors?.[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData?.currentPassword) {
      errors.currentPassword = 'كلمة المرور الحالية مطلوبة';
    }

    if (!passwordData?.newPassword) {
      errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (passwordData?.newPassword?.length < 8) {
      errors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(passwordData?.newPassword)) {
      errors.newPassword = 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام';
    }

    if (!passwordData?.confirmPassword) {
      errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      errors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    setPasswordErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e?.preventDefault();
    if (validatePasswordForm()) {
      onPasswordChange(passwordData);
      // Reset form after successful submission
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const handleTwoFactorToggle = (enabled) => {
    setTwoFactorEnabled(enabled);
    onTwoFactorToggle(enabled);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-luxury">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-error" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">الأمان والحماية</h2>
          <p className="text-sm text-muted-foreground font-caption">إدارة إعدادات الأمان لحسابك</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Password Change Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground border-b border-border pb-2">
            تغيير كلمة المرور
          </h3>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="كلمة المرور الحالية"
                type={showPasswords?.current ? "text" : "password"}
                placeholder="أدخل كلمة المرور الحالية"
                value={passwordData?.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                error={passwordErrors?.currentPassword}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute left-3 rtl:right-3 rtl:left-auto top-9 text-muted-foreground hover:text-foreground transition-luxury"
              >
                <Icon name={showPasswords?.current ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            <div className="relative">
              <Input
                label="كلمة المرور الجديدة"
                type={showPasswords?.new ? "text" : "password"}
                placeholder="أدخل كلمة المرور الجديدة"
                value={passwordData?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                error={passwordErrors?.newPassword}
                description="يجب أن تحتوي على 8 أحرف على الأقل مع أحرف كبيرة وصغيرة وأرقام"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute left-3 rtl:right-3 rtl:left-auto top-9 text-muted-foreground hover:text-foreground transition-luxury"
              >
                <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            <div className="relative">
              <Input
                label="تأكيد كلمة المرور الجديدة"
                type={showPasswords?.confirm ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                value={passwordData?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                error={passwordErrors?.confirmPassword}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute left-3 rtl:right-3 rtl:left-auto top-9 text-muted-foreground hover:text-foreground transition-luxury"
              >
                <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              iconName="Key"
              iconPosition="right"
              className="w-full md:w-auto"
            >
              تحديث كلمة المرور
            </Button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground border-b border-border pb-2">
            المصادقة الثنائية
          </h3>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="shrink-0 mt-1">
                <Icon name="Smartphone" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-2">تأمين إضافي لحسابك</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  قم بتفعيل المصادقة الثنائية لحماية إضافية. ستحتاج إلى رمز من هاتفك عند تسجيل الدخول.
                </p>
                
                <Checkbox
                  label="تفعيل المصادقة الثنائية"
                  description="إرسال رمز التحقق عبر الرسائل النصية"
                  checked={twoFactorEnabled}
                  onChange={(e) => handleTwoFactorToggle(e?.target?.checked)}
                />

                {twoFactorEnabled && (
                  <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-success">
                      <Icon name="CheckCircle" size={16} />
                      <span className="text-sm font-medium">تم تفعيل المصادقة الثنائية</span>
                    </div>
                    <p className="text-xs text-success/80 mt-1">
                      سيتم إرسال رمز التحقق إلى رقم هاتفك المسجل
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Tips */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground border-b border-border pb-2">
            نصائح الأمان
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Icon name="Lock" size={18} className="text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">كلمة مرور قوية</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    استخدم كلمة مرور معقدة وفريدة لحسابك
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/5 rounded-lg p-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Icon name="Wifi" size={18} className="text-secondary mt-1" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">شبكة آمنة</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    تجنب استخدام شبكات الواي فاي العامة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;