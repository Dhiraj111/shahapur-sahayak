import React, { useState } from 'react';
import { evaluateCrossingLocation } from '../utils/safety';
import { ALL_CROSSING_LOCATIONS } from '../constants';
import type { SafetyResult } from '../types';
import './SafetyRouter.css';

const SafetyRouter: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [safetyResult, setSafetyResult] = useState<SafetyResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value;
    setSelectedLocation(locationId);
    
    // Clear any previous errors
    if (error) {
      setError('');
    }
    
    if (locationId) {
      setIsProcessing(true);
      
      try {
        // Simulate processing delay for user feedback
        setTimeout(() => {
          const result = evaluateCrossingLocation(locationId);
          if (result) {
            setSafetyResult(result);
          } else {
            setError('Unable to evaluate the selected location. Please try again.');
            setSafetyResult(null);
          }
          setIsProcessing(false);
        }, 200);
      } catch {
        setError('An error occurred while evaluating the crossing location. Please try again.');
        setSafetyResult(null);
        setIsProcessing(false);
      }
    } else {
      setSafetyResult(null);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedLocation('');
    setSafetyResult(null);
    setError('');
    setIsProcessing(false);
  };

  return (
    <div className="safety-router">
      <h2>🚦 Safety Router</h2>
      <p>Select your crossing location to get safety guidance for the Mumbai-Nashik Highway</p>
      
      <div className="location-selector">
        <label htmlFor="crossing-location">Choose crossing location:</label>
        <div className="selector-container">
          <select 
            id="crossing-location"
            value={selectedLocation}
            onChange={handleLocationChange}
            className={`location-dropdown ${error ? 'error' : ''}`}
            disabled={isProcessing}
          >
            <option value="">-- Select a crossing location --</option>
            {Object.values(ALL_CROSSING_LOCATIONS).map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          
          {selectedLocation && (
            <button 
              onClick={handleReset}
              className="reset-button"
              disabled={isProcessing}
              title="Clear selection"
            >
              ✕
            </button>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {isProcessing && (
          <div className="processing-message">
            <span className="spinner"></span>
            Evaluating location safety...
          </div>
        )}
      </div>

      {safetyResult && !isProcessing && (
        <div className={`safety-result ${safetyResult.isWarning ? 'danger-zone' : 'safe-zone'}`}>
          <div className="result-content">
            <div className="result-header">
              <span className="result-icon">
                {safetyResult.isWarning ? '⚠️' : '✅'}
              </span>
              <h3>{safetyResult.location.name}</h3>
            </div>
            <p className="result-message">{safetyResult.message}</p>
            
            {safetyResult.isWarning && (
              <div className="warning-footer">
                <p className="safety-tip">
                  💡 <strong>Safety Tip:</strong> Always look both ways and wait for a clear gap before crossing
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!selectedLocation && !isProcessing && (
        <div className="placeholder-message">
          <p>👆 Select a location above to get safety guidance</p>
        </div>
      )}
    </div>
  );
};

export default SafetyRouter;