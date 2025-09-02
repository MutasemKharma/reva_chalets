import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';


const ProfileHeader = ({ 
  user = {},
  onAvatarChange = () => {},
  onEditProfile = () => {}
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const mockUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`;
      onAvatarChange(mockUrl);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse">
        {/* Avatar Upload */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-background shadow-luxury">
            <Image
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt={`صورة ${user?.name || 'المستخدم'}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <label className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-luxury hover:bg-primary/90 transition-luxury">
            <Icon name={isUploading ? "Loader2" : "Camera"} size={16} className={isUploading ? "animate-spin" : ""} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-right rtl:text-right">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
            {user?.name || 'أحمد محمد العلي'}
          </h1>
          <p className="text-muted-foreground font-caption mb-2">
            {user?.email || 'ahmed.ali@example.com'}
          </p>
          <div className="flex items-center justify-center sm:justify-start rtl:justify-start space-x-4 rtl:space-x-reverse text-sm">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Icon name="MapPin" size={14} className="text-primary" />
              <span className="text-muted-foreground">{user?.city || 'عمان، الأردن'}</span>
            </div>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Icon name="Calendar" size={14} className="text-primary" />
              <span className="text-muted-foreground">عضو منذ {user?.memberSince || 'يناير 2024'}</span>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex flex-col space-y-2">
          <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full text-xs font-medium ${
            user?.phoneVerified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>
            <Icon name={user?.phoneVerified ? "CheckCircle" : "Clock"} size={12} />
            <span>{user?.phoneVerified ? 'رقم مؤكد' : 'رقم غير مؤكد'}</span>
          </div>
          <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full text-xs font-medium ${
            user?.emailVerified ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}>
            <Icon name={user?.emailVerified ? "CheckCircle" : "Clock"} size={12} />
            <span>{user?.emailVerified ? 'إيميل مؤكد' : 'إيميل غير مؤكد'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;