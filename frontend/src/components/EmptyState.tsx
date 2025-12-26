import React, { useMemo } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  storeType: 'dmart' | 'kirana';
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({ storeType }) => {
  // Memoize the empty state content to avoid recalculating on every render
  const content = useMemo(() => {
    if (storeType === 'dmart') {
      return {
        icon: '📦',
        title: 'No bulk items found',
        message: 'Items that are better bought in bulk will appear here',
        subtitle: 'Try adding items like rice, oil, or household supplies'
      };
    } else {
      return {
        icon: '🏪',
        title: 'No daily items found',
        message: 'Fresh and quick-access items will appear here',
        subtitle: 'Try adding items like milk, bread, or vegetables'
      };
    }
  }, [storeType]);

  return (
    <div className={`empty-state empty-state--${storeType}`} role="status" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">
        {content.icon}
      </div>
      <div className="empty-state__content">
        <h4 className="empty-state__title">{content.title}</h4>
        <p className="empty-state__message">{content.message}</p>
        <p className="empty-state__subtitle">{content.subtitle}</p>
      </div>
    </div>
  );
});

// Add display name for debugging
EmptyState.displayName = 'EmptyState';

export default EmptyState;