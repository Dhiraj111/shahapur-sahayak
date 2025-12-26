import React, { useState } from 'react';
import { STORE_INFO } from '../constants';
import './StoreInfo.css';

const StoreInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dmart' | 'kirana' | null>(null);

  const handleTabSelect = (tab: 'dmart' | 'kirana') => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className="store-info">
      <h2>🏪 Store Information</h2>
      <p>Get timings, contact details, and tips for shopping in Shahapur</p>
      
      <div className="store-tabs">
        <button 
          className={`store-tab dmart-tab ${activeTab === 'dmart' ? 'active' : ''}`}
          onClick={() => handleTabSelect('dmart')}
        >
          <span className="store-icon">🛒</span>
          <span className="tab-text">D-Mart Info</span>
        </button>
        
        <button 
          className={`store-tab kirana-tab ${activeTab === 'kirana' ? 'active' : ''}`}
          onClick={() => handleTabSelect('kirana')}
        >
          <span className="store-icon">🏪</span>
          <span className="tab-text">Kirana Info</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab && (
          <div className={`store-details ${activeTab}-details`}>
            <div className="store-card">
              <h3>{STORE_INFO[activeTab].name}</h3>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">🕒</span>
                  <div>
                    <strong>Timings</strong>
                    <p>{STORE_INFO[activeTab].timings}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <div>
                    <strong>Contact</strong>
                    <p>{STORE_INFO[activeTab].contact}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <strong>Location</strong>
                    <p>{STORE_INFO[activeTab].address}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <div>
                    <strong>Best Time to Visit</strong>
                    <p>{STORE_INFO[activeTab].bestTime}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <div>
                    <strong>Average Wait Time</strong>
                    <p>{STORE_INFO[activeTab].avgWaitTime}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <span className="info-icon">📈</span>
                  <div>
                    <strong>Peak Hours</strong>
                    <p>{STORE_INFO[activeTab].peakHours}</p>
                  </div>
                </div>
              </div>
              
              <div className="benefits-section">
                <h4>✨ Benefits</h4>
                <ul className="benefits-list">
                  {STORE_INFO[activeTab].benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {!activeTab && (
          <div className="placeholder-message">
            <p>👆 Select a store type above to view detailed information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreInfo;