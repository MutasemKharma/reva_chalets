import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AdminPropertyCard from './components/AdminPropertyCard';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import InquiriesPanel from './components/InquiriesPanel';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingInquiries: 0,
    totalInquiries: 0
  });

  useEffect(() => {
    if (user && !authLoading) {
      checkUserRole();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (userRole && (userRole === 'admin' || userRole === 'owner')) {
      loadDashboardData();
    }
  }, [userRole]);

  const checkUserRole = async () => {
    try {
      const { data: profile, error } = await supabase?.from('profiles')?.select('role')?.eq('id', user?.id)?.single();

      if (error) throw error;
      
      setUserRole(profile?.role);
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole('guest');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load properties based on role
      let propertiesQuery = supabase?.from('properties')?.select(`
          *,
          owner:profiles!properties_owner_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `);

      if (userRole === 'owner') {
        propertiesQuery = propertiesQuery?.eq('owner_id', user?.id);
      }

      const { data: propertiesData, error: propertiesError } = await propertiesQuery?.order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      setProperties(propertiesData || []);

      // Load inquiries
      let inquiriesQuery = supabase?.from('inquiries')?.select(`
          *,
          property:properties (
            id,
            name,
            images
          ),
          guest:profiles!inquiries_guest_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `);

      if (userRole === 'owner') {
        inquiriesQuery = inquiriesQuery?.eq('owner_id', user?.id);
      }

      const { data: inquiriesData, error: inquiriesError } = await inquiriesQuery?.order('created_at', { ascending: false })?.limit(50);

      if (inquiriesError) throw inquiriesError;

      setInquiries(inquiriesData || []);

      // Calculate stats
      const totalProperties = propertiesData?.length || 0;
      const activeProperties = propertiesData?.filter(p => p?.is_active)?.length || 0;
      const pendingInquiries = inquiriesData?.filter(i => i?.status === 'pending')?.length || 0;
      const totalInquiries = inquiriesData?.length || 0;

      setStats({
        totalProperties,
        activeProperties,
        pendingInquiries,
        totalInquiries
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyUpdate = async (propertyId, updates) => {
    try {
      const { error } = await supabase?.from('properties')?.update(updates)?.eq('id', propertyId);

      if (error) throw error;

      // Refresh properties
      loadDashboardData();
      alert('تم تحديث الشاليه بنجاح');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('حدث خطأ في تحديث الشاليه');
    }
  };

  const handleInquiryResponse = async (inquiryId, response, status = 'responded') => {
    try {
      const { error } = await supabase?.from('inquiries')?.update({
          owner_response: response,
          status: status,
          updated_at: new Date()?.toISOString()
        })?.eq('id', inquiryId);

      if (error) throw error;

      // Refresh inquiries
      loadDashboardData();
      alert('تم إرسال الرد بنجاح');
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      alert('حدث خطأ في إرسال الرد');
    }
  };

  const handleAvailabilityUpdate = async (propertyId, date, status, priceOverride = null) => {
    try {
      const { data, error } = await supabase?.rpc(
        'update_property_availability',
        {
          property_uuid: propertyId,
          date_to_update: date,
          new_status: status,
          price_override: priceOverride
        }
      );

      if (error) throw error;

      alert('تم تحديث التوفر بنجاح');
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('حدث خطأ في تحديث التوفر');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!userRole || (userRole !== 'admin' && userRole !== 'owner')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            غير مخول للوصول
          </h1>
          <p className="text-muted-foreground mb-4">
            يجب أن تكون مالك شاليه أو مدير لدخول هذه الصفحة
          </p>
          <Button onClick={() => window.history?.back()}>
            العودة
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'properties', label: 'شاليهاتي', icon: 'Home' },
    { id: 'inquiries', label: 'الاستفسارات', icon: 'MessageSquare' },
    { id: 'availability', label: 'إدارة التوفر', icon: 'Calendar' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>لوحة التحكم - ريفا شاليهات</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            لوحة التحكم
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' ? 'إدارة جميع الشاليهات' : 'إدارة شاليهاتك'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">إجمالي الشاليهات</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalProperties}</p>
              </div>
              <Icon name="Home" size={24} className="text-primary" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">الشاليهات النشطة</p>
                <p className="text-2xl font-bold text-green-600">{stats?.activeProperties}</p>
              </div>
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">استفسارات معلقة</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.pendingInquiries}</p>
              </div>
              <Icon name="Clock" size={24} className="text-orange-600" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">إجمالي الاستفسارات</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalInquiries}</p>
              </div>
              <Icon name="MessageSquare" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 rtl:space-x-reverse bg-muted p-1 rounded-lg w-fit">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === tab?.id 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'properties' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  {userRole === 'admin' ? 'جميع الشاليهات' : 'شاليهاتي'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties?.map((property) => (
                  <AdminPropertyCard
                    key={property?.id}
                    property={property}
                    onUpdate={(updates) => handlePropertyUpdate(property?.id, updates)}
                    onSelect={() => setSelectedProperty(property)}
                    userRole={userRole}
                  />
                ))}
              </div>
              
              {properties?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Home" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد شاليهات بعد</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <InquiriesPanel
              inquiries={inquiries}
              onRespond={handleInquiryResponse}
              userRole={userRole}
            />
          )}

          {activeTab === 'availability' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
                  إدارة التوفر
                </h2>
                <p className="text-muted-foreground">
                  اختر شاليه لإدارة توفره
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Property selector */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-medium text-foreground mb-4">اختر الشاليه</h3>
                  <div className="space-y-2">
                    {properties?.map((property) => (
                      <button
                        key={property?.id}
                        onClick={() => setSelectedProperty(property)}
                        className={`
                          w-full text-right rtl:text-right p-3 rounded-lg border transition-colors
                          ${selectedProperty?.id === property?.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card border-border hover:bg-accent'
                          }
                        `}
                      >
                        <div className="font-medium">{property?.name}</div>
                        <div className="text-sm opacity-75">{property?.city}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="lg:col-span-3">
                  {selectedProperty ? (
                    <AvailabilityCalendar
                      property={selectedProperty}
                      onUpdateAvailability={handleAvailabilityUpdate}
                    />
                  ) : (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                      <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">اختر شاليه لإدارة توفره</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;