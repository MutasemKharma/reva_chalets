import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StatusFilterTabs = ({ activeFilter, onFilterChange, inquiryCounts }) => {
  const filterTabs = [
    {
      key: 'all',
      label: 'الكل',
      labelEn: 'All',
      icon: 'List',
      count: inquiryCounts?.all || 0
    },
    {
      key: 'pending',
      label: 'في الانتظار',
      labelEn: 'Pending',
      icon: 'Clock',
      count: inquiryCounts?.pending || 0
    },
    {
      key: 'responded',
      label: 'تم الرد',
      labelEn: 'Responded',
      icon: 'MessageCircle',
      count: inquiryCounts?.responded || 0
    },
    {
      key: 'confirmed',
      label: 'مؤكد',
      labelEn: 'Confirmed',
      icon: 'CheckCircle',
      count: inquiryCounts?.confirmed || 0
    },
    {
      key: 'declined',
      label: 'مرفوض',
      labelEn: 'Declined',
      icon: 'XCircle',
      count: inquiryCounts?.declined || 0
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden py-3">
          <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto scrollbar-hide">
            {filterTabs?.map((tab) => (
              <Button
                key={tab?.key}
                variant={activeFilter === tab?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => onFilterChange(tab?.key)}
                className="shrink-0 whitespace-nowrap"
              >
                <Icon name={tab?.icon} size={16} />
                <span className="mr-2 rtl:ml-2">{tab?.label}</span>
                {tab?.count > 0 && (
                  <span className={`text-xs rounded-full px-2 py-0.5 mr-2 rtl:ml-2 ${
                    activeFilter === tab?.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {tab?.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Desktop Full Width */}
        <div className="hidden md:flex items-center justify-center py-4">
          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-muted rounded-lg p-1">
            {filterTabs?.map((tab) => (
              <Button
                key={tab?.key}
                variant={activeFilter === tab?.key ? "default" : "ghost"}
                size="sm"
                onClick={() => onFilterChange(tab?.key)}
                className="relative"
              >
                <Icon name={tab?.icon} size={16} />
                <span className="mr-2 rtl:ml-2">{tab?.label}</span>
                {tab?.count > 0 && (
                  <span className={`text-xs rounded-full px-2 py-0.5 mr-2 rtl:ml-2 ${
                    activeFilter === tab?.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {tab?.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusFilterTabs;