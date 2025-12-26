import React from 'react';
import './CardHeader.css';

interface CardHeaderProps {
  storeType: 'dmart' | 'kirana';
  title: string;
  icon: string;
  benefitText: string;
}

const CardHeader: React.FC<CardHeaderProps> = React.memo(({ 
  storeType, 
  title, 
  icon, 
  benefitText 
}) => {
  const headingId = `${storeType}-heading`;
  
  return (
    <header className={`card-header card-header--${storeType}`}>
      <div className="card-header__title">
        <span className="card-header__icon" aria-hidden="true">{icon}</span>
        <h3 id={headingId} className="card-header__text">{title}</h3>
        {/* Visual indicator pattern for accessibility */}
        <span 
          className={`card-header__pattern card-header__pattern--${storeType}`}
          aria-hidden="true"
        >
          {storeType === 'dmart' ? '●●●' : '▲▲▲'}
        </span>
      </div>
      <div 
        className={`card-header__badge card-header__badge--${storeType}`}
        role="status"
        aria-label={`Benefit: ${benefitText}`}
      >
        <span className="card-header__badge-icon" aria-hidden="true">
          {storeType === 'dmart' ? '💰' : '⚡'}
        </span>
        {benefitText}
      </div>
    </header>
  );
});

// Add display name for debugging
CardHeader.displayName = 'CardHeader';

export default CardHeader;