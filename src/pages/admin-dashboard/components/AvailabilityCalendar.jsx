import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilityCalendar = ({ 
  property = {},
  onUpdateAvailability = () => {}
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: 'available',
    priceOverride: ''
  });

  useEffect(() => {
    if (property?.id) {
      loadAvailability();
    }
  }, [property?.id, currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoading(true);

      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data, error } = await supabase?.rpc(
        'get_property_availability',
        {
          property_uuid: property?.id,
          start_date: startDate?.toISOString()?.split('T')?.[0],
          end_date: endDate?.toISOString()?.split('T')?.[0]
        }
      );

      if (error) throw error;

      // Convert array to object for easier lookup
      const availabilityMap = {};
      data?.forEach((item) => {
        availabilityMap[item?.date] = {
          status: item?.status,
          price: item?.price
        };
      });

      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = date?.toISOString()?.split('T')?.[0];
    const currentAvailability = availability?.[dateStr];
    
    setUpdateForm({
      status: currentAvailability?.status || 'available',
      priceOverride: currentAvailability?.price !== property?.price_per_night 
        ? currentAvailability?.price?.toString() || '' :''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateAvailability = async () => {
    try {
      const dateStr = selectedDate?.toISOString()?.split('T')?.[0];
      const priceOverride = updateForm?.priceOverride ? parseFloat(updateForm?.priceOverride) : null;

      await onUpdateAvailability(property?.id, dateStr, updateForm?.status, priceOverride);
      
      // Refresh availability data
      await loadAvailability();
      
      setShowUpdateModal(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(newMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'متاح';
      case 'booked':
        return 'محجوز';
      case 'maintenance':
        return 'صيانة';
      case 'blocked':
        return 'محظور';
      default:
        return 'غير محدد';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: 0
    })?.format(price);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth?.getFullYear();
    const month = currentMonth?.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 })?.map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            {property?.name} - إدارة التوفر
          </h3>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            
            <span className="text-lg font-medium text-foreground min-w-[120px] text-center">
              {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames?.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays?.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-16"></div>;
              }

              const dateStr = date?.toISOString()?.split('T')?.[0];
              const dayAvailability = availability?.[dateStr];
              const isToday = date?.toDateString() === new Date()?.toDateString();
              const isPast = date < new Date();

              return (
                <button
                  key={date?.toISOString()}
                  onClick={() => !isPast && handleDateClick(date)}
                  disabled={isPast}
                  className={`
                    h-16 p-2 rounded-lg border transition-colors text-center
                    ${isPast 
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed' :'hover:bg-accent cursor-pointer'
                    }
                    ${isToday ? 'ring-2 ring-primary' : ''}
                    ${dayAvailability 
                      ? getStatusColor(dayAvailability?.status)
                      : 'bg-background border-border'
                    }
                  `}
                >
                  <div className="text-sm font-medium">
                    {date?.getDate()}
                  </div>
                  {dayAvailability && (
                    <div className="text-xs mt-1">
                      <div>{getStatusLabel(dayAvailability?.status)}</div>
                      {dayAvailability?.price !== property?.price_per_night && (
                        <div className="font-bold">
                          {formatPrice(dayAvailability?.price)}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">مفتاح الألوان:</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { status: 'available', label: 'متاح' },
              { status: 'booked', label: 'محجوز' },
              { status: 'maintenance', label: 'صيانة' },
              { status: 'blocked', label: 'محظور' }
            ]?.map((item) => (
              <div key={item?.status} className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-4 h-4 rounded border ${getStatusColor(item?.status)}`}></div>
                <span className="text-sm text-muted-foreground">{item?.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Update Modal */}
      {showUpdateModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-popover border border-border rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                تحديث التوفر
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUpdateModal(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">التاريخ:</p>
                <p className="font-medium text-foreground">
                  {selectedDate?.toLocaleDateString('ar-SA')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  حالة التوفر:
                </label>
                <select
                  value={updateForm?.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="available">متاح</option>
                  <option value="booked">محجوز</option>
                  <option value="maintenance">صيانة</option>
                  <option value="blocked">محظور</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  سعر خاص (اختياري):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={updateForm?.priceOverride}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, priceOverride: e?.target?.value }))}
                    placeholder={`السعر الافتراضي: ${formatPrice(property?.price_per_night)}`}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  اتركه فارغاً لاستخدام السعر الافتراضي
                </p>
              </div>

              <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                <Button
                  onClick={handleUpdateAvailability}
                  className="flex-1"
                >
                  حفظ التحديث
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;