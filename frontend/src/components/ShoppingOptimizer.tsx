import React, { useState } from 'react';
import { optimizeShoppingList } from '../utils/shopping';
import type { OptimizationResult } from '../types';
import './ShoppingOptimizer.css';

const ShoppingOptimizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInputText(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Clear results when input is modified
    if (results) {
      setResults(null);
    }
  };

  const handleOptimize = () => {
    // Input validation
    const trimmedInput = inputText.trim();
    if (!trimmedInput) {
      setError('Please enter at least one shopping item to optimize.');
      return;
    }

    // Check for meaningful input (not just whitespace or special characters)
    const hasValidItems = trimmedInput.split(/[,\n]/).some(item => 
      item.trim().length > 0 && /[a-zA-Z]/.test(item.trim())
    );
    
    if (!hasValidItems) {
      setError('Please enter valid shopping items (items should contain letters).');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      // Simulate processing delay for user feedback
      setTimeout(() => {
        const optimizationResult = optimizeShoppingList(trimmedInput);
        setResults(optimizationResult);
        setIsProcessing(false);
      }, 300);
    } catch {
      setError('An error occurred while processing your shopping list. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      handleOptimize();
    }
  };

  return (
    <div className="shopping-optimizer">
      <h2>🛒 Shopping Optimizer</h2>
      <p>Enter your shopping list to get optimized recommendations for D-Mart vs Kirana stores</p>
      
      <div className="input-section">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter your shopping list (one item per line or comma-separated)...&#10;Example: milk, bread, oil 5L, sugar 3kg"
          rows={6}
          className={`shopping-input ${error ? 'error' : ''}`}
          disabled={isProcessing}
        />
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <button 
          onClick={handleOptimize}
          className={`optimize-button ${isProcessing ? 'processing' : ''}`}
          disabled={isProcessing || !inputText.trim()}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Optimize Shopping List'
          )}
        </button>
        
        <p className="input-hint">
          💡 Tip: Press Ctrl+Enter to optimize quickly
        </p>
      </div>
      
      {results && (
        <div className="results-section">
          <div className="results-cards">
            <div className="bulk-card">
              <h3>Go to D-Mart (Bulk)</h3>
              {results.bulkItems.length > 0 ? (
                <ul>
                  {results.bulkItems.map((item, index) => (
                    <li key={index}>
                      <strong>{item.name}</strong>
                      <p className="reason">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No bulk items in your list</p>
              )}
            </div>
            
            <div className="daily-card">
              <h3>Support Local Kirana (Daily)</h3>
              {results.dailyItems.length > 0 ? (
                <ul>
                  {results.dailyItems.map((item, index) => (
                    <li key={index}>
                      <strong>{item.name}</strong>
                      <p className="reason">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No daily items in your list</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingOptimizer;