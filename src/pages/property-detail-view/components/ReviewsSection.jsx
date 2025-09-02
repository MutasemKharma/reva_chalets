import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReviewsSection = ({ reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, helpful

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-accent fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-accent fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('ar-JO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[Math.floor(review.rating)]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (reviews?.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          التقييمات والمراجعات
        </h2>
        <div className="text-center py-8 bg-card rounded-lg border border-border">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد تقييمات بعد</p>
          <p className="text-sm text-muted-foreground mt-1">كن أول من يقيم هذا الشاليه</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-heading font-semibold text-foreground">
        التقييمات والمراجعات
      </h2>
      {/* Rating Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-foreground mb-1">
              {averageRating?.toFixed(1)}
            </div>
            <div className="flex items-center justify-center mb-2">
              {renderStars(averageRating)}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalReviews} تقييم
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 max-w-xs mr-8 rtl:ml-8">
            {[5, 4, 3, 2, 1]?.map(rating => {
              const count = ratingDistribution?.[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Icon name="Star" size={12} className="text-accent fill-current" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Sort Options */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <span className="text-sm font-medium text-foreground">ترتيب حسب:</span>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {[
            { value: 'recent', label: 'الأحدث' },
            { value: 'rating', label: 'التقييم' },
            { value: 'helpful', label: 'الأكثر فائدة' }
          ]?.map(option => (
            <Button
              key={option?.value}
              variant={sortBy === option?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy(option?.value)}
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews?.map((review) => (
          <div key={review?.id} className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-primary font-medium">
                  {review?.userName?.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{review?.userName}</h4>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <div className="flex items-center">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                    </div>
                  </div>
                  
                  {review?.isVerified && (
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-success">
                      <Icon name="CheckCircle" size={16} />
                      <span className="text-xs">موثق</span>
                    </div>
                  )}
                </div>

                <p className="text-foreground leading-relaxed mb-3">
                  {review?.comment}
                </p>

                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 rtl:space-x-reverse mb-3">
                    {review?.images?.slice(0, 3)?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`صورة من التقييم ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {review?.images?.length > 3 && (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{review?.images?.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-muted-foreground">
                  <button className="flex items-center space-x-1 rtl:space-x-reverse hover:text-foreground transition-luxury">
                    <Icon name="ThumbsUp" size={14} />
                    <span>مفيد ({review?.helpfulCount || 0})</span>
                  </button>
                  
                  <button className="hover:text-foreground transition-luxury">
                    رد
                  </button>
                </div>

                {/* Owner Response */}
                {review?.ownerResponse && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <Icon name="User" size={16} className="text-primary" />
                      <span className="font-medium text-primary">رد المالك</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.ownerResponse?.date)}
                      </span>
                    </div>
                    <p className="text-foreground text-sm">
                      {review?.ownerResponse?.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More Button */}
      {reviews?.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? (
              <>
                <Icon name="ChevronUp" size={16} />
                <span className="mr-2 rtl:ml-2">عرض أقل</span>
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} />
                <span className="mr-2 rtl:ml-2">
                  عرض جميع التقييمات ({reviews?.length})
                </span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;