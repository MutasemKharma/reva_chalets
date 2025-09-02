import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BottomTabNavigator from '../../components/ui/BottomTabNavigator';
import InquiryCard from './components/InquiryCard';
import StatusFilterTabs from './components/StatusFilterTabs';
import EmptyInquiryState from './components/EmptyInquiryState';
import MessageModal from './components/MessageModal';
import PullToRefresh from './components/PullToRefresh';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InquiryManagementDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Mock inquiry data
  const mockInquiries = [
    {
      id: 1,
      propertyId: 'prop-001',
      propertyName: 'شاليه الواحة الذهبية',
      propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      location: 'عمان، الأردن',
      status: 'confirmed',
      checkIn: '2025-01-15',
      checkOut: '2025-01-18',
      guestCount: 6,
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-02T14:30:00Z',
      originalMessage: `مرحباً، أود حجز الشاليه للعائلة من 15 إلى 18 يناير. نحن 6 أشخاص بالغين مع طفلين.\n\nهل الشاليه متاح؟ وما هي المرافق المتوفرة؟`,
      lastMessage: 'تم تأكيد الحجز. مرحباً بكم في شاليه الواحة الذهبية',
      ownerName: 'أحمد محمد الخالدي',
      ownerPhone: '+962-79-123-4567',
      messages: [
        {
          sender: 'owner',
          content: 'أهلاً وسهلاً، الشاليه متاح للتواريخ المطلوبة. يتوفر مسبح خاص، مطبخ مجهز، وموقف سيارات.',
          timestamp: '2025-01-01T15:30:00Z'
        },
        {
          sender: 'user',
          content: 'ممتاز! ما هو السعر الإجمالي للثلاث ليالي؟',
          timestamp: '2025-01-01T16:00:00Z'
        },
        {
          sender: 'owner',
          content: 'السعر 120 دينار لليلة الواحدة، إجمالي 360 دينار للثلاث ليالي شامل الضريبة.',
          timestamp: '2025-01-01T16:15:00Z'
        },
        {
          sender: 'user',
          content: 'موافق، أرغب في تأكيد الحجز.',
          timestamp: '2025-01-01T16:30:00Z'
        },
        {
          sender: 'owner',
          content: 'تم تأكيد الحجز. مرحباً بكم في شاليه الواحة الذهبية. سأرسل لكم تفاصيل الوصول قريباً.',
          timestamp: '2025-01-02T14:30:00Z'
        }
      ]
    },
    {
      id: 2,
      propertyId: 'prop-002',
      propertyName: 'مزرعة الربيع الأخضر',
      propertyImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=400',
      location: 'جرش، الأردن',
      status: 'responded',
      checkIn: '2025-01-20',
      checkOut: '2025-01-22',
      guestCount: 12,
      createdAt: '2024-12-28T09:00:00Z',
      updatedAt: '2024-12-29T11:45:00Z',
      originalMessage: `السلام عليكم، نحن مجموعة من الأصدقاء نبحث عن مزرعة للاستجمام.\n\nهل المزرعة تتسع لـ 12 شخص؟ وما هي الأنشطة المتاحة؟`,
      lastMessage: 'المزرعة متاحة وتتسع لـ 15 شخص. يوجد ملعب كرة قدم ومنطقة شواء',
      ownerName: 'سامي عبدالله النعيمي',
      ownerPhone: '+962-77-987-6543',
      messages: [
        {
          sender: 'owner',
          content: 'وعليكم السلام، المزرعة متاحة وتتسع لـ 15 شخص بسهولة. يوجد ملعب كرة قدم، منطقة شواء، ومسبح.',
          timestamp: '2024-12-29T11:45:00Z'
        }
      ]
    },
    {
      id: 3,
      propertyId: 'prop-003',
      propertyName: 'شاليه النسيم الجبلي',
      propertyImage: 'https://images.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg?w=400',
      location: 'عجلون، الأردن',
      status: 'pending',
      checkIn: '2025-02-01',
      checkOut: '2025-02-03',
      guestCount: 4,
      createdAt: '2024-12-30T14:00:00Z',
      updatedAt: '2024-12-30T14:00:00Z',
      originalMessage: `مرحباً، أبحث عن شاليه هادئ في الجبال لقضاء عطلة نهاية الأسبوع.\n\nهل الشاليه يوفر إطلالة جبلية؟ وهل يوجد تدفئة؟`,
      lastMessage: null,
      ownerName: 'فادي يوسف الزعبي',
      ownerPhone: '+962-78-456-7890',
      messages: []
    },
    {
      id: 4,
      propertyId: 'prop-004',
      propertyName: 'مزرعة الأصالة التراثية',
      propertyImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      location: 'مادبا، الأردن',
      status: 'declined',
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
      guestCount: 8,
      createdAt: '2024-12-25T16:00:00Z',
      updatedAt: '2024-12-26T10:30:00Z',
      originalMessage: `أود حجز المزرعة لمناسبة عائلية صغيرة.\n\nهل يمكن إقامة حفلة صغيرة؟ وما هي القوانين المتبعة؟`,
      lastMessage: 'نعتذر، المزرعة محجوزة للتواريخ المطلوبة',
      ownerName: 'محمد علي الحوراني',
      ownerPhone: '+962-79-321-6547',
      messages: [
        {
          sender: 'owner',
          content: 'نعتذر بشدة، المزرعة محجوزة للتواريخ المطلوبة. يمكنكم اختيار تواريخ أخرى.',
          timestamp: '2024-12-26T10:30:00Z'
        }
      ]
    }
  ];

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [activeFilter, inquiries]);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInquiries(mockInquiries);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await loadInquiries();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterInquiries = () => {
    if (activeFilter === 'all') {
      setFilteredInquiries(inquiries);
    } else {
      setFilteredInquiries(inquiries?.filter(inquiry => inquiry?.status === activeFilter));
    }
  };

  const getInquiryCounts = () => {
    return {
      all: inquiries?.length,
      pending: inquiries?.filter(i => i?.status === 'pending')?.length,
      responded: inquiries?.filter(i => i?.status === 'responded')?.length,
      confirmed: inquiries?.filter(i => i?.status === 'confirmed')?.length,
      declined: inquiries?.filter(i => i?.status === 'declined')?.length
    };
  };

  const handleSendMessage = (inquiryId) => {
    const inquiry = inquiries?.find(i => i?.id === inquiryId);
    setSelectedInquiry(inquiry);
    setIsMessageModalOpen(true);
  };

  // Add this function to handle status updates
  const handleStatusUpdate = (inquiryId, newStatus) => {
    setInquiries(prev => prev?.map(inquiry => {
      if (inquiry?.id === inquiryId) {
        return {
          ...inquiry,
          status: newStatus,
          updatedAt: new Date()?.toISOString()
        };
      }
      return inquiry;
    }));
  };

  const handleCallOwner = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleMessageSend = async (inquiryId, message) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update inquiry with new message
      setInquiries(prev => prev?.map(inquiry => {
        if (inquiry?.id === inquiryId) {
          return {
            ...inquiry,
            messages: [
              ...inquiry?.messages,
              {
                sender: 'user',
                content: message,
                timestamp: new Date()?.toISOString()
              }
            ],
            lastMessage: message,
            updatedAt: new Date()?.toISOString()
          };
        }
        return inquiry;
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const inquiryCounts = getInquiryCounts();

  return (
    <>
      <Helmet>
        <title>إدارة الاستفسارات - ريفا شاليهات</title>
        <meta name="description" content="تتبع وإدارة استفساراتك وحجوزاتك للشاليهات والمزارع في الأردن" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 pb-20 md:pb-8">
          <StatusFilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            inquiryCounts={inquiryCounts}
          />

          <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
            <div className="container mx-auto px-4 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
                  إدارة الاستفسارات
                </h1>
                <p className="text-muted-foreground">
                  تتبع حالة استفساراتك وتواصل مع أصحاب العقارات
                </p>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3]?.map((i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="w-20 h-20 bg-muted rounded-lg shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredInquiries?.length === 0 ? (
                <EmptyInquiryState filterType={activeFilter} />
              ) : (
                <div className="space-y-4">
                  {filteredInquiries?.map((inquiry) => (
                    <InquiryCard
                      key={inquiry?.id}
                      inquiry={inquiry}
                      onSendMessage={handleSendMessage}
                      onCallOwner={handleCallOwner}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}

              {/* Refresh Button for Desktop */}
              {!isLoading && filteredInquiries?.length > 0 && (
                <div className="hidden md:flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    loading={isRefreshing}
                  >
                    <Icon name="RefreshCw" size={16} />
                    <span className="mr-2 rtl:ml-2">تحديث الاستفسارات</span>
                  </Button>
                </div>
              )}
            </div>
          </PullToRefresh>
        </main>

        <BottomTabNavigator inquiryCount={inquiryCounts?.pending} />

        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          inquiry={selectedInquiry}
          onSendMessage={handleMessageSend}
        />
      </div>
    </>
  );
};

export default InquiryManagementDashboard;