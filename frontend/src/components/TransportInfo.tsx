import React, { useState } from 'react';
import './TransportInfo.css';

interface TransportOption {
  id: string;
  name: string;
  icon: string;
  cost: string;
  timing: string;
  details: string[];
  tips?: string[];
  warnings?: string[];
}

const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    id: 'share-auto',
    name: 'Share Auto',
    icon: '🚗',
    cost: '₹20/seat',
    timing: 'Available till 8:30 PM',
    details: [
      'Most economical option for local travel',
      'Shared with other passengers',
      'Fixed routes within Shahapur',
      'No advance booking required'
    ],
    tips: [
      'Carry exact change for faster boarding',
      'Peak hours: 7-9 AM, 6-8 PM',
      'Wait at designated auto stands'
    ],
    warnings: [
      'Service stops at 8:30 PM sharp',
      'Limited availability during monsoon',
      'May be crowded during peak hours'
    ]
  },
  {
    id: 'private-auto',
    name: 'Private Auto',
    icon: '🛺',
    cost: '₹50-80 (negotiable)',
    timing: 'Available 24/7',
    details: [
      'Direct point-to-point travel',
      'No sharing with other passengers',
      'Flexible routes and stops',
      'Available for longer distances'
    ],
    tips: [
      'Negotiate fare before starting journey',
      'Use meter when available',
      'Keep small denomination notes'
    ]
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: '🚶',
    cost: 'Free',
    timing: 'Recommended: 6 AM - 8 PM',
    details: [
      'Healthiest and most economical option',
      'Good for distances under 2km',
      'Use designated pedestrian paths',
      'Follow safety guidelines for highway crossing'
    ],
    tips: [
      'Use SafetyMap for safe routes',
      'Avoid walking alone after 8 PM',
      'Carry water during summer months'
    ],
    warnings: [
      'Never cross at Kinhavali Junction',
      'Use subway routes when available',
      'Be extra careful during monsoon'
    ]
  }
];

const PARKING_INFO = {
  dmart: {
    name: 'D-Mart Parking',
    icon: '🅿️',
    weekdays: {
      status: 'Usually Available',
      details: 'Free parking with 2-hour limit',
      tips: ['Park in covered area during summer', 'Validate parking ticket at billing counter']
    },
    sundays: {
      status: '⚠️ AVOID D-Mart Parking',
      details: 'Extremely crowded - 1+ hour traffic jam to exit',
      alternative: 'Park at Hotel Sai Garden (adjacent plot)',
      tips: [
        'Hotel Sai Garden parking: ₹20 for 4 hours',
        'Only 2-minute walk to D-Mart entrance',
        'Much faster exit during Sunday rush'
      ]
    }
  }
};

const TransportInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showParkingInfo, setShowParkingInfo] = useState(false);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    return today === 0 ? 'sunday' : 'weekday'; // 0 = Sunday
  };

  return (
    <section className="transport-info" aria-labelledby="transport-heading">
      <header className="transport-header">
        <h3 id="transport-heading">🚗 Transport Guide</h3>
        <p>Navigate Shahapur with local transport options and parking tips</p>
      </header>

      <div className="transport-content">
        {/* Transport Options */}
        <div className="transport-options">
          <h4>🚌 Transport Options</h4>
          <div className="options-grid">
            {TRANSPORT_OPTIONS.map((option) => (
              <div key={option.id} className="transport-card">
                <button
                  className={`transport-button ${activeTab === option.id ? 'active' : ''}`}
                  onClick={() => handleTabSelect(option.id)}
                  aria-expanded={activeTab === option.id}
                >
                  <div className="transport-header-info">
                    <span className="transport-icon" aria-hidden="true">{option.icon}</span>
                    <div className="transport-basic">
                      <h5>{option.name}</h5>
                      <div className="transport-meta">
                        <span className="cost">{option.cost}</span>
                        <span className="timing">{option.timing}</span>
                      </div>
                    </div>
                  </div>
                </button>
                
                {activeTab === option.id && (
                  <div className="transport-details" role="region" aria-labelledby={`${option.id}-heading`}>
                    <div className="details-section">
                      <h6>Details</h6>
                      <ul>
                        {option.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {option.tips && (
                      <div className="tips-section">
                        <h6>💡 Tips</h6>
                        <ul>
                          {option.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {option.warnings && (
                      <div className="warnings-section">
                        <h6>⚠️ Important</h6>
                        <ul>
                          {option.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Parking Information */}
        <div className="parking-section">
          <button
            className={`parking-toggle ${showParkingInfo ? 'active' : ''}`}
            onClick={() => setShowParkingInfo(!showParkingInfo)}
            aria-expanded={showParkingInfo}
          >
            <span className="parking-icon" aria-hidden="true">🅿️</span>
            <h4>D-Mart Parking Guide</h4>
            <span className="toggle-icon" aria-hidden="true">
              {showParkingInfo ? '▼' : '▶'}
            </span>
          </button>
          
          {showParkingInfo && (
            <div className="parking-details">
              <div className="parking-day-info">
                <div className="weekday-parking">
                  <h5>📅 Weekdays (Mon-Sat)</h5>
                  <div className="parking-status good">
                    <span className="status-indicator">✅</span>
                    <span>{PARKING_INFO.dmart.weekdays.status}</span>
                  </div>
                  <p>{PARKING_INFO.dmart.weekdays.details}</p>
                  <ul className="parking-tips">
                    {PARKING_INFO.dmart.weekdays.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="sunday-parking">
                  <h5>📅 Sundays</h5>
                  <div className="parking-status warning">
                    <span className="status-indicator">⚠️</span>
                    <span>{PARKING_INFO.dmart.sundays.status}</span>
                  </div>
                  <p>{PARKING_INFO.dmart.sundays.details}</p>
                  
                  <div className="alternative-parking">
                    <h6>🏨 Better Option: {PARKING_INFO.dmart.sundays.alternative}</h6>
                    <ul className="parking-tips">
                      {PARKING_INFO.dmart.sundays.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {getCurrentDay() === 'sunday' && (
                <div className="current-day-alert">
                  <div className="alert-content">
                    <span className="alert-icon" aria-hidden="true">🚨</span>
                    <div>
                      <strong>Today is Sunday!</strong>
                      <p>Avoid D-Mart parking. Use Hotel Sai Garden instead.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* No Uber Notice */}
        <div className="no-uber-notice">
          <div className="notice-content">
            <span className="notice-icon" aria-hidden="true">🚫</span>
            <div>
              <h5>No Uber/Ola in Shahapur</h5>
              <p>App-based cabs are not available. Use local transport options above.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransportInfo;