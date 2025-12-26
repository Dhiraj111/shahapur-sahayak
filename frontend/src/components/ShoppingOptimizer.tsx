import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { optimizeShoppingList } from '../utils/shopping';
import { PerformanceMonitor, performanceBudget, getOptimizedAnimationConfig } from '../utils/performance';
import { frameRateMonitor, animationOptimizer } from '../utils/frameRateMonitor';
import { performanceBudgetManager, performanceChecker } from '../utils/performanceBudgets';
import type { OptimizationResult } from '../types';
import CardHeader from './CardHeader';
import EmptyState from './EmptyState';
import './ShoppingOptimizer.css';

const ShoppingOptimizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [animateItems, setAnimateItems] = useState<boolean>(false);

  // Get performance monitor instance
  const performanceMonitor = PerformanceMonitor.getInstance();
  
  // Get optimized animation configuration based on device capabilities
  const animationConfig = useMemo(() => getOptimizedAnimationConfig(), []);

  // Initialize performance monitoring
  useEffect(() => {
    // Start frame rate monitoring
    frameRateMonitor.startMonitoring();
    
    // Start animation optimization
    animationOptimizer.startOptimization();
    
    // Add performance degradation listener
    const handlePerformanceDegradation = () => {
      console.log('Performance degradation detected in ShoppingOptimizer');
      // Could trigger additional optimizations here
    };
    
    window.addEventListener('performanceOptimizationEnabled', handlePerformanceDegradation);
    
    return () => {
      frameRateMonitor.stopMonitoring();
      animationOptimizer.stopOptimization();
      window.removeEventListener('performanceOptimizationEnabled', handlePerformanceDegradation);
    };
  }, []);

  // Log performance report on component unmount (development only)
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        performanceMonitor.logReport();
        
        // Log performance budget summary
        const summary = performanceBudgetManager.getPerformanceSummary();
        const recommendations = performanceChecker.getRecommendations();
        
        console.group('📊 Performance Budget Summary');
        console.log('Total metrics:', summary.totalMetrics);
        console.log('Budget violations:', summary.budgetViolations);
        console.log('Warnings:', summary.warningCount);
        console.log('Critical issues:', summary.criticalCount);
        console.log('Recommendations:', recommendations);
        console.groupEnd();
      }
    };
  }, [performanceMonitor]);

  // Memoized input validation to avoid recalculating on every render
  const inputValidation = useMemo(() => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) {
      return { isValid: false, error: 'Please enter at least one shopping item to optimize.' };
    }

    // Check for meaningful input (not just whitespace or special characters)
    const hasValidItems = trimmedInput.split(/[,\n]/).some(item => 
      item.trim().length > 0 && /[a-zA-Z]/.test(item.trim())
    );
    
    if (!hasValidItems) {
      return { isValid: false, error: 'Please enter valid shopping items (items should contain letters).' };
    }

    return { isValid: true, error: '' };
  }, [inputText]);

  // Memoized optimization function to prevent unnecessary recalculations
  const optimizeShoppingListMemo = useCallback((input: string) => {
    const startTime = performance.now();
    performanceMonitor.startTiming('optimization');
    
    const result = optimizeShoppingList(input);
    
    const duration = performanceMonitor.endTiming('optimization');
    const totalDuration = performance.now() - startTime;
    
    // Record performance metrics
    performanceBudgetManager.recordMetric('shopping-optimization', totalDuration);
    
    // Check performance budget
    performanceBudget.checkBudget('optimization', duration);
    
    return result;
  }, [performanceMonitor]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const startTime = performance.now();
    
    const value = event.target.value;
    setInputText(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Clear results when input is modified
    if (results) {
      setResults(null);
      setShowResults(false);
      setAnimateItems(false);
    }
    
    // Record input response time
    const duration = performance.now() - startTime;
    performanceBudgetManager.recordMetric('user-input-response', duration);
  }, [error, results]);

  const handleOptimize = useCallback(() => {
    // Use memoized validation
    if (!inputValidation.isValid) {
      setError(inputValidation.error);
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        // Use optimized timing based on device capabilities
        const processingDelay = animationConfig.simplified ? 100 : 200;
        
        setTimeout(() => {
          const optimizationResult = optimizeShoppingListMemo(inputText.trim());
          setResults(optimizationResult);
          setIsProcessing(false);
          
          // Trigger entrance animations with optimized timing
          if (animationConfig.enabled) {
            requestAnimationFrame(() => {
              setTimeout(() => setShowResults(true), 16); // One frame delay
              setTimeout(() => setAnimateItems(true), animationConfig.duration * 0.67); // Reduced timing
            });
          } else {
            // Skip animations if disabled
            setShowResults(true);
            setAnimateItems(true);
          }
        }, processingDelay);
      });
    } catch {
      setError('An error occurred while processing your shopping list. Please try again.');
      setIsProcessing(false);
    }
  }, [inputValidation, inputText, optimizeShoppingListMemo]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      handleOptimize();
    }
  }, [handleOptimize]);

  return (
    <main className="shopping-optimizer" role="main">
      <header className="shopping-optimizer__header">
        <h1>🛒 Shopping Optimizer</h1>
        <p>Enter your shopping list to get optimized recommendations for D-Mart vs Kirana stores</p>
      </header>
      
      <section className="input-section" aria-labelledby="input-heading">
        <h2 id="input-heading" className="visually-hidden">Shopping List Input</h2>
        <label htmlFor="shopping-input" className="visually-hidden">
          Enter your shopping items, one per line or comma-separated
        </label>
        <textarea
          id="shopping-input"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter your shopping list (one item per line or comma-separated)...&#10;Example: milk, bread, oil 5L, sugar 3kg"
          rows={6}
          className={`shopping-input ${error ? 'error' : ''}`}
          disabled={isProcessing}
          aria-describedby={error ? 'error-message' : 'input-hint'}
          aria-invalid={error ? 'true' : 'false'}
        />
        
        {error && (
          <div 
            id="error-message" 
            className="error-message" 
            role="alert" 
            aria-live="polite"
          >
            <span className="error-icon" aria-hidden="true">⚠️</span>
            {error}
          </div>
        )}
        
        <button 
          onClick={handleOptimize}
          className={`optimize-button ${isProcessing ? 'processing' : ''}`}
          disabled={isProcessing || !inputValidation.isValid}
          aria-describedby="input-hint"
        >
          {isProcessing ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            'Optimize Shopping List'
          )}
        </button>
        
        <p id="input-hint" className="input-hint">
          💡 Tip: Press Ctrl+Enter to optimize quickly
        </p>
      </section>
      
      {results && (
        <section 
          className={`results-section ${showResults ? 'results-section--visible' : ''}`}
          aria-labelledby="results-heading"
          aria-live="polite"
        >
          <header className="summary-header">
            <h2 id="results-heading" className="visually-hidden">Shopping Optimization Results</h2>
            <div className="summary-stats" role="region" aria-label="Summary statistics">
              <div className="stat-item">
                <div className="stat-number" aria-label={`${results.bulkItems.length} items for D-Mart`}>
                  {results.bulkItems.length}
                </div>
                <div className="stat-label">for D-Mart</div>
              </div>
              <div className="stat-divider" aria-hidden="true"></div>
              <div className="stat-item">
                <div className="stat-number" aria-label={`${results.dailyItems.length} items for Kirana`}>
                  {results.dailyItems.length}
                </div>
                <div className="stat-label">for Kirana</div>
              </div>
            </div>
          </header>
          
          <div className="results-cards" role="region" aria-label="Store recommendations">
            <article className="bulk-card" aria-labelledby="dmart-heading">
              <CardHeader 
                storeType="dmart"
                title="D-Mart (Bulk)"
                icon="🛒"
                benefitText="Save 15%"
              />
              {results.bulkItems.length > 0 ? (
                <div 
                  className={`items-list ${animateItems ? 'items-list--animated' : ''}`}
                  role="list"
                  aria-label="Items recommended for D-Mart"
                >
                  {results.bulkItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="item-chip"
                      role="listitem"
                      style={{ 
                        animationDelay: animateItems ? `${index * 100}ms` : '0ms' 
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState storeType="dmart" />
              )}
            </article>
            
            <article className="daily-card" aria-labelledby="kirana-heading">
              <CardHeader 
                storeType="kirana"
                title="Kirana (Daily)"
                icon="🏪"
                benefitText="Quick Access"
              />
              {results.dailyItems.length > 0 ? (
                <div 
                  className={`items-list ${animateItems ? 'items-list--animated' : ''}`}
                  role="list"
                  aria-label="Items recommended for Kirana"
                >
                  {results.dailyItems.map((item, index) => (
                    <div 
                      key={index} 
                      className="item-chip"
                      role="listitem"
                      style={{ 
                        animationDelay: animateItems ? `${index * 100}ms` : '0ms' 
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState storeType="kirana" />
              )}
            </article>
          </div>
          
          <footer className="results-footer">
            <div className="tip-box" role="complementary" aria-label="Shopping tips">
              <span className="tip-icon" aria-hidden="true">💡</span>
              <span className="tip-text">
                D-Mart: Better for bulk savings • Kirana: Quick & convenient
              </span>
            </div>
          </footer>
        </section>
      )}
    </main>
  );
};

export default ShoppingOptimizer;