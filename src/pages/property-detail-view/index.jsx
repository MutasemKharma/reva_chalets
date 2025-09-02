import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../../lib/supabase';
import PropertyContextualNav from '../../components/ui/PropertyContextualNav';
import PropertyImageGallery from './components/PropertyImageGallery';
import PropertyInfoSection from './components/PropertyInfoSection';
import PropertyLocationMap from './components/PropertyLocationMap';
import InquiryForm from './components/InquiryForm';
import ContactActions from './components/ContactActions';
import ReviewsSection from './components/ReviewsSection';

const PropertyDetailView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const propertyId = searchParams?.get('id');

  useEffect(() => {
    if (propertyId) {
      loadPropertyData();
    }
  }, [propertyId]);

  const loadPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch property with owner info
      const { data: propertyData, error: propertyError } = await supabase?.from('properties')?.select(`
          *,
          owner:profiles!properties_owner_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `)?.eq('id', propertyId)?.eq('is_active', true)?.single();

      if (propertyError) throw propertyError;

      if (!propertyData) {
        setError('الشاليه غير موجود');
        return;
      }

      setProperty(propertyData);

      // Fetch reviews
      await loadReviews();

    } catch (error) {
      console.error('Error loading property:', error);
      setError(error?.message || 'حدث خطأ في تحميل بيانات الشاليه');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase?.from('reviews')?.select(`
          *,
          user:profiles!reviews_user_id_fkey (
            full_name,
            avatar_url
          )
        `)?.eq('property_id', propertyId)?.order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleInquirySubmit = async (inquiryData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase?.auth?.getUser();

      const inquiryPayload = {
        property_id: propertyId,
        owner_id: property?.owner_id,
        guest_id: user?.id || null,
        message: inquiryData?.message || '',
        guest_name: inquiryData?.name,
        guest_email: inquiryData?.email,
        guest_phone: inquiryData?.phone,
        check_in_date: inquiryData?.checkIn,
        check_out_date: inquiryData?.checkOut,
        guests_count: inquiryData?.guests || 1,
        status: 'pending'
      };

      const { error } = await supabase?.from('inquiries')?.insert([inquiryPayload]);

      if (error) throw error;

      // Also send to Formspree for backup/notification
      try {
        await fetch('https://formspree.io/f/xqadlnyo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            property_name: property?.name,
            guest_name: inquiryData?.name,
            guest_email: inquiryData?.email,
            guest_phone: inquiryData?.phone,
            check_in: inquiryData?.checkIn,
            check_out: inquiryData?.checkOut,
            guests: inquiryData?.guests,
            message: inquiryData?.message,
            property_id: propertyId
          })
        });
      } catch (formspreeError) {
        console.error('Formspree submission error:', formspreeError);
      }

      alert('تم إرسال استفسارك بنجاح! سنتواصل معك قريباً.');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('حدث خطأ في إرسال الاستفسار. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleShare = async () => {
    if (navigator?.share && property) {
      try {
        await navigator.share({
          title: property?.name,
          text: `اكتشف ${property?.name} - شاليه رائع في ${property?.city}`,
          url: window?.location?.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator?.clipboard?.writeText(window?.location?.href);
      alert('تم نسخ الرابط!');
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to user favorites in database
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 md:h-96 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {error || 'الشاليه غير موجود'}
          </h1>
          <p className="text-muted-foreground mb-4">
            لم نتمكن من العثور على الشاليه المطلوب
          </p>
          <button
            onClick={() => navigate('/property-listings-browse')}
            className="text-primary hover:underline"
          >
            العودة للتصفح
          </button>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews?.length > 0
    ? reviews?.reduce((sum, review) => sum + (review?.rating || 0), 0) / reviews?.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{property?.name} - ريفا شاليهات</title>
        <meta name="description" content={property?.description?.substring(0, 160)} />
        <meta property="og:title" content={`${property?.name} - ريفا شاليهات`} />
        <meta property="og:description" content={property?.description?.substring(0, 160)} />
        <meta property="og:image" content={property?.images?.[0]} />
        <meta property="og:url" content={window?.location?.href} />
      </Helmet>
      {/* Navigation */}
      <PropertyContextualNav
        propertyTitle={property?.name}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        onShare={handleShare}
      />
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <PropertyImageGallery
              images={property?.images}
              propertyName={property?.name}
            />

            {/* Property Information */}
            <PropertyInfoSection property={property} />

            {/* Location & Map */}
            <PropertyLocationMap location={{
              address: property?.address,
              city: property?.city,
              governorate: property?.governorate,
              coordinates: {
                lat: property?.latitude,
                lng: property?.longitude
              },
              nearbyPlaces: [] // Could be populated from additional data
            }} />

            {/* Reviews */}
            <ReviewsSection
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={reviews?.length}
            />
          </div>

          {/* Sidebar / Contact Actions */}
          <div className="lg:col-span-1">
            <ContactActions
              property={property}
              onInquiryClick={() => setIsInquiryFormOpen(true)}
              onShare={handleShare}
              onFavoriteToggle={handleFavoriteToggle}
              isFavorite={isFavorite}
            />
          </div>
        </div>
      </div>
      {/* Inquiry Form Modal */}
      <InquiryForm
        property={property}
        isOpen={isInquiryFormOpen}
        onClose={() => setIsInquiryFormOpen(false)}
        onSubmit={handleInquirySubmit}
      />
    </div>
  );
};

export default PropertyDetailView;