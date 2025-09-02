import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PullToRefresh = ({ onRefresh, children, isRefreshing = false }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef(null);
  const threshold = 80;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e?.touches?.[0]?.clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || window.scrollY > 0) return;

    const currentY = e?.touches?.[0]?.clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 10) {
      e?.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = () => {
    if (isPulling && pullDistance >= threshold) {
      onRefresh();
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    container?.addEventListener('touchstart', handleTouchStart, { passive: true });
    container?.addEventListener('touchmove', handleTouchMove, { passive: false });
    container?.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchmove', handleTouchMove);
      container?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, startY]);

  const getRefreshStatus = () => {
    if (isRefreshing) {
      return { text: 'جاري التحديث...', icon: 'Loader2', spinning: true };
    } else if (pullDistance >= threshold) {
      return { text: 'اترك للتحديث', icon: 'ArrowUp', spinning: false };
    } else if (isPulling) {
      return { text: 'اسحب للتحديث', icon: 'ArrowDown', spinning: false };
    }
    return null;
  };

  const refreshStatus = getRefreshStatus();

  return (
    <div ref={containerRef} className="relative">
      {/* Pull to Refresh Indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-background/95 backdrop-blur-luxury border-b border-border transition-all duration-200"
          style={{ 
            height: `${Math.max(pullDistance * 0.8, isRefreshing ? 60 : 0)}px`,
            transform: `translateY(-${Math.max(pullDistance * 0.8, isRefreshing ? 60 : 0)}px)`
          }}
        >
          {refreshStatus && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-primary">
              <Icon 
                name={refreshStatus?.icon} 
                size={20} 
                className={refreshStatus?.spinning ? 'animate-spin' : ''} 
              />
              <span className="text-sm font-medium">{refreshStatus?.text}</span>
            </div>
          )}
        </div>
      )}
      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{ 
          transform: `translateY(${isPulling ? pullDistance * 0.5 : 0}px)` 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;