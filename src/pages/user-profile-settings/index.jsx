import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomTabNavigator from '../../components/ui/BottomTabNavigator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import all components
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import PreferencesSettings from './components/PreferencesSettings';
import BookingHistory from './components/BookingHistory';
import SecuritySettings from './components/SecuritySettings';
import FavoriteProperties from './components/FavoriteProperties';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ar');

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'أحمد محمد العلي',
    email: 'ahmed.ali@example.com',
    phone: '+962791234567',
    city: 'amman',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    memberSince: 'يناير 2024',
    phoneVerified: true,
    emailVerified: true
  });

  const [userPreferences, setUserPreferences] = useState({
    language: 'ar',
    currency: 'jod',
    emailNotifications: true,
    smsNotifications: false,
    promotionalOffers: true,
    inquiryUpdates: true,
    weeklyNewsletter: false,
    bookingReminders: true
  });

  // Mock inquiries for notification count
  const mockInquiries = [
    {
      id: 1,
      propertyTitle: 'شاليه الواحة الذهبية',
      status: 'responded',
      isRead: false,
      lastMessage: 'تم قبول طلب الحجز الخاص بك',
      updatedAt: new Date(Date.now() - 3600000)
    }
  ];

  const tabs = [
    {
      id: 'profile',
      label: 'الملف الشخصي',
      icon: 'User',
      component: 'profile'
    },
    {
      id: 'preferences',
      label: 'التفضيلات',
      icon: 'Settings',
      component: 'preferences'
    },
    {
      id: 'bookings',
      label: 'سجل الحجوزات',
      icon: 'Calendar',
      component: 'bookings'
    },
    {
      id: 'security',
      label: 'الأمان',
      icon: 'Shield',
      component: 'security'
    },
    {
      id: 'favorites',
      label: 'المفضلة',
      icon: 'Heart',
      component: 'favorites'
    }
  ];

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ar';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleAvatarChange = (newAvatarUrl) => {
    setUserData(prev => ({
      ...prev,
      avatar: newAvatarUrl
    }));
  };

  const handlePersonalInfoSave = async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
      setIsLoading(false);
      
      // Show success message (you can implement toast notification here)
      console.log('تم حفظ المعلومات الشخصية بنجاح');
    }, 1500);
  };

  const handlePreferencesSave = async (preferences) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserPreferences(preferences);
      
      // Update language if changed
      if (preferences?.language !== currentLanguage) {
        setCurrentLanguage(preferences?.language);
        localStorage.setItem('preferredLanguage', preferences?.language);
      }
      
      setIsLoading(false);
      console.log('تم حفظ الإعدادات بنجاح');
    }, 1500);
  };

  const handlePasswordChange = async (passwordData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('تم تحديث كلمة المرور بنجاح');
    }, 2000);
  };

  const handleTwoFactorToggle = async (enabled) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log(`تم ${enabled ? 'تفعيل' : 'إلغاء'} المصادقة الثنائية`);
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <PersonalInfoForm
            user={userData}
            onSave={handlePersonalInfoSave}
            isLoading={isLoading}
          />
        );
      case 'preferences':
        return (
          <PreferencesSettings
            preferences={userPreferences}
            onSave={handlePreferencesSave}
            isLoading={isLoading}
          />
        );
      case 'bookings':
        return <BookingHistory />;
      case 'security':
        return (
          <SecuritySettings
            onPasswordChange={handlePasswordChange}
            onTwoFactorToggle={handleTwoFactorToggle}
            isLoading={isLoading}
          />
        );
      case 'favorites':
        return <FavoriteProperties />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-6">
          {/* Profile Header - Always visible */}
          <ProfileHeader
            user={userData}
            onAvatarChange={handleAvatarChange}
          />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-card rounded-xl p-4 shadow-luxury sticky top-24">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-right rtl:text-right transition-luxury ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-luxury'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden">
              <div className="bg-card rounded-xl p-2 shadow-luxury mb-6">
                <div className="flex overflow-x-auto scrollbar-hide space-x-2 rtl:space-x-reverse">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg whitespace-nowrap transition-luxury ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="text-sm font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>

          {/* Quick Actions - Mobile Sticky */}
          <div className="lg:hidden fixed bottom-20 left-4 right-4 z-30">
            <div className="bg-card/95 backdrop-blur-luxury rounded-xl p-4 shadow-luxury-lg border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Settings" size={18} className="text-primary" />
                  <span className="font-medium text-foreground">إعدادات سريعة</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Bell"
                    onClick={() => setActiveTab('preferences')}
                  >
                    الإشعارات
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Shield"
                    onClick={() => setActiveTab('security')}
                  >
                    الأمان
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomTabNavigator inquiryCount={mockInquiries?.filter(i => !i?.isRead)?.length} />
    </div>
  );
};

export default UserProfileSettings;