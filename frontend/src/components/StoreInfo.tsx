import React, { useState } from 'react';
import { STORE_INFO } from '../constants';
import './StoreInfo.css';

const StoreInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dmart' | 'kirana' | null>(null);

  const handleTabSelect = (tab: 'dmart' | 'kirana') => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tab: 'dmart' | 'kirana') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabSelect(tab);
    }
  };

  return (
    <section className="store-info" aria-labelledby="store-info-heading">
      <header>
        <h2 id="store-info-heading">🏪 Store Information</h2>
        <p>Get timings, contact details, and tips for shopping in Shahapur</p>
      </header>
      
      <div className="store-tabs" role="tablist" aria-label="Store information tabs">
        <button 
          className={`store-tab dmart-tab ${activeTab === 'dmart' ? 'active' : ''}`}
          onClick={() => handleTabSelect('dmart')}
          onKeyDown={(e) => handleKeyDown(e, 'dmart')}
          role="tab"
          aria-selected={activeTab === 'dmart'}
          aria-controls="dmart-panel"
          id="dmart-tab"
        >
          <span className="store-icon" aria-hidden="true">🛒</span>
          <span className="tab-text">D-Mart Info</span>
        </button>
        
        <button 
          className={`store-tab kirana-tab ${activeTab === 'kirana' ? 'active' : ''}`}
          onClick={() => handleTabSelect('kirana')}
          onKeyDown={(e) => handleKeyDown(e, 'kirana')}
          role="tab"
          aria-selected={activeTab === 'kirana'}
          aria-controls="kirana-panel"
          id="kirana-tab"
        >
          <span className="store-icon" aria-hidden="true">🏪</span>
          <span className="tab-text">Kirana Info</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab && (
          <div 
            className={`store-details ${activeTab}-details`}
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
          >
            <article className="store-card">
              <h3>{STORE_INFO[activeTab].name}</h3>
              
              <dl className="info-grid">
                <div className="info-item">
                  <span className="info-icon" aria-hidden="true">🕒</span>
                  <div>
                    <dt><strong>Timings</strong></dt>
                    <dd>{STORE_INFO[activeTab].timings}</dd>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon" aria-hidden="true">📞</span>
                  <div>
                    <dt><strong>Contact</strong></dt>
                    <dd>{STORE_INFO[activeTab].contact}</dd>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon" aria-hidden="true">📍</span>
                  <div>
                    <dt><strong>Location</strong></dt>
                    <dd>{STORE_INFO[activeTab].address}</dd>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon" aria-hidden="true">⏰</span>
                  <div>
                    <dt><strong>Best Time to Visit</strong></dt>
                    <dd>{STORE_INFO[activeTab].bestTime}</dd>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon" aria-hidden="true">⏱️</span>
                  <div>
                    <dt><strong>Average Wait Time</strong></dt>
                    <dd>{STORE_INFO[activeTab].avgWaitTime}</dd>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon" aria-hidden="true">📈</span>
                  <div>
                    <dt><strong>Peak Hours</strong></dt>
                    <dd>{STORE_INFO[activeTab].peakHours}</dd>
                  </div>
                </div>
              </dl>
              
              <section className="benefits-section">
                <h4>✨ Benefits</h4>
                <ul className="benefits-list">
                  {STORE_INFO[activeTab].benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </section>
            </article>
          </div>
        )}
        
        {!activeTab && (
          <div className="placeholder-message" role="status">
            <p>👆 Select a store type above to view detailed information</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreInfo;