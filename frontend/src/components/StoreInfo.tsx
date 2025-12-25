import React, { useState } from 'react';
import { STORE_INFO } from '../constants';
import './StoreInfo.css';

const StoreInfo: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<'dmart' | 'kirana' | null>(null);

  const handleStoreSelect = (store: 'dmart' | 'kirana') => {
    setSelectedStore(selectedStore === store ? null : store);
  };

  return (
    <div className="store-info">
      <h2>🏪 Store Information</h2>
      <p>Get timings, contact details, and tips for shopping in Shahapur</p>
      
      <div className="store-buttons">
        <button 
          className={`store-button dmart-button ${selectedStore === 'dmart' ? 'active' : ''}`}
          onClick={() => handleStoreSelect('dmart')}
        >
          <span className="store-icon">🛒</span>
          D-Mart Info
        </button>
        
        <button 
          className={`store-button kirana-button ${selectedStore === 'kirana' ? 'active' : ''}`}
          onClick={() => handleStoreSelect('kirana')}
        >
          <span className="store-icon">🏪</span>
          Kirana Info
        </button>
      </div>

      {selectedStore && (
        <div className={`store-details ${selectedStore}-details`}>
          <div className="store-card">
            <h3>{STORE_INFO[selectedStore].name}</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <strong>Timings</strong>
                  <p>{STORE_INFO[selectedStore].timings}</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Contact</strong>
                  <p>{STORE_INFO[selectedStore].contact}</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>{STORE_INFO[selectedStore].address}</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <strong>Best Time to Visit</strong>
                  <p>{STORE_INFO[selectedStore].bestTime}</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div>
                  <strong>Average Wait Time</strong>
                  <p>{STORE_INFO[selectedStore].avgWaitTime}</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">📈</span>
                <div>
                  <strong>Peak Hours</strong>
                  <p>{STORE_INFO[selectedStore].peakHours}</p>
                </div>
              </div>
            </div>
            
            <div className="benefits-section">
              <h4>✨ Benefits</h4>
              <ul className="benefits-list">
                {STORE_INFO[selectedStore].benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {!selectedStore && (
        <div className="placeholder-message">
          <p>👆 Select a store type above to view detailed information</p>
        </div>
      )}
    </div>
  );
};

export default StoreInfo;