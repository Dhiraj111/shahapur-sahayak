import React, { useState, useEffect } from 'react';
import { frameRateMonitor } from '../utils/frameRateMonitor';
import { performanceBudgetManager, performanceChecker } from '../utils/performanceBudgets';
import type { PerformanceMetric } from '../utils/performanceBudgets';

interface PerformanceDashboardProps {
  isVisible?: boolean;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  isVisible = import.meta.env?.DEV || false
}) => {
  const [fps, setFps] = useState(60);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // FPS monitoring
    const handleFPSUpdate = (newFps: number) => {
      setFps(newFps);
    };

    frameRateMonitor.onFPSUpdate(handleFPSUpdate);

    // Performance metrics monitoring
    const handleMetricUpdate = (metric: PerformanceMetric) => {
      setMetrics(prev => [...prev.slice(-19), metric]); // Keep last 20 metrics
    };

    performanceBudgetManager.addListener(handleMetricUpdate);

    return () => {
      frameRateMonitor.removeFPSCallback(handleFPSUpdate);
      performanceBudgetManager.removeListener(handleMetricUpdate);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const report = frameRateMonitor.getPerformanceReport();
  const summary = performanceBudgetManager.getPerformanceSummary();
  const recommendations = performanceChecker.getRecommendations();
  const isPerformingWell = performanceChecker.isPerformingWell();

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#22c55e'; // Green
    if (fps >= 30) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getMetricColor = (metric: PerformanceMetric) => {
    switch (metric.warningLevel) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      minWidth: '200px',
      maxWidth: isExpanded ? '400px' : '200px',
      transition: 'all 0.3s ease'
    }}>
      <div 
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: isExpanded ? '8px' : '0'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>🚀 Performance</span>
        <span style={{ color: getFPSColor(fps) }}>
          {fps} FPS
        </span>
      </div>

      {isExpanded && (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <div>Avg FPS: <span style={{ color: getFPSColor(report.average) }}>
              {report.average.toFixed(1)}
            </span></div>
            <div>Min FPS: <span style={{ color: getFPSColor(report.minimum) }}>
              {report.minimum}
            </span></div>
            <div>Status: <span style={{ color: isPerformingWell ? '#22c55e' : '#ef4444' }}>
              {isPerformingWell ? 'Good' : 'Poor'}
            </span></div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Budget Status:</div>
            <div>Total: {summary.totalMetrics}</div>
            <div>Violations: <span style={{ color: summary.budgetViolations > 0 ? '#ef4444' : '#22c55e' }}>
              {summary.budgetViolations}
            </span></div>
            <div>Warnings: <span style={{ color: summary.warningCount > 0 ? '#f59e0b' : '#22c55e' }}>
              {summary.warningCount}
            </span></div>
            <div>Critical: <span style={{ color: summary.criticalCount > 0 ? '#ef4444' : '#22c55e' }}>
              {summary.criticalCount}
            </span></div>
          </div>

          {metrics.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Recent Metrics:</div>
              <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {metrics.slice(-5).map((metric, index) => (
                  <div key={index} style={{ 
                    color: getMetricColor(metric),
                    fontSize: '10px',
                    marginBottom: '2px'
                  }}>
                    {metric.name}: {metric.value.toFixed(1)}ms
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Recommendations:</div>
              <div style={{ fontSize: '10px', maxHeight: '80px', overflowY: 'auto' }}>
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} style={{ marginBottom: '2px', opacity: 0.8 }}>
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '8px', 
            paddingTop: '8px', 
            borderTop: '1px solid rgba(255,255,255,0.2)',
            fontSize: '10px',
            opacity: 0.7
          }}>
            Click to collapse
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;