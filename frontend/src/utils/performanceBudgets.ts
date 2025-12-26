// Performance budgets and monitoring system

export interface PerformanceBudgetConfig {
  name: string;
  budget: number; // in milliseconds
  warning: number; // warning threshold (percentage of budget)
  critical: number; // critical threshold (percentage of budget)
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  isWithinBudget: boolean;
  warningLevel: 'ok' | 'warning' | 'critical';
}

export class PerformanceBudgetManager {
  private static instance: PerformanceBudgetManager;
  private budgets = new Map<string, PerformanceBudgetConfig>();
  private metrics: PerformanceMetric[] = [];
  private maxMetricsHistory = 100;
  private listeners: ((metric: PerformanceMetric) => void)[] = [];

  static getInstance(): PerformanceBudgetManager {
    if (!PerformanceBudgetManager.instance) {
      PerformanceBudgetManager.instance = new PerformanceBudgetManager();
    }
    return PerformanceBudgetManager.instance;
  }

  constructor() {
    this.setupDefaultBudgets();
  }

  // Set up default performance budgets
  private setupDefaultBudgets(): void {
    this.setBudget({
      name: 'component-render',
      budget: 16, // 16ms for 60fps
      warning: 75, // 12ms
      critical: 90 // 14.4ms
    });

    this.setBudget({
      name: 'shopping-optimization',
      budget: 300, // 300ms for shopping list processing
      warning: 80, // 240ms
      critical: 95 // 285ms
    });

    this.setBudget({
      name: 'animation-frame',
      budget: 16, // 16ms per frame for 60fps
      warning: 75, // 12ms
      critical: 90 // 14.4ms
    });

    this.setBudget({
      name: 'user-input-response',
      budget: 100, // 100ms for input response
      warning: 70, // 70ms
      critical: 90 // 90ms
    });

    this.setBudget({
      name: 'page-load',
      budget: 2000, // 2 seconds for initial page load
      warning: 75, // 1.5 seconds
      critical: 90 // 1.8 seconds
    });
  }

  // Set a performance budget
  setBudget(config: PerformanceBudgetConfig): void {
    this.budgets.set(config.name, config);
  }

  // Record a performance metric
  recordMetric(name: string, value: number): PerformanceMetric {
    const budget = this.budgets.get(name);
    const timestamp = Date.now();
    
    let isWithinBudget = true;
    let warningLevel: 'ok' | 'warning' | 'critical' = 'ok';
    
    if (budget) {
      isWithinBudget = value <= budget.budget;
      
      if (value > budget.budget * (budget.critical / 100)) {
        warningLevel = 'critical';
      } else if (value > budget.budget * (budget.warning / 100)) {
        warningLevel = 'warning';
      }
    }
    
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp,
      isWithinBudget,
      warningLevel
    };
    
    // Add to metrics history
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics.shift();
    }
    
    // Log warnings in development
    if (process.env.NODE_ENV === 'development' && !isWithinBudget) {
      const budgetValue = budget?.budget || 0;
      console.warn(
        `⚠️ Performance budget exceeded for ${name}: ${value.toFixed(2)}ms (budget: ${budgetValue}ms, ${warningLevel})`
      );
    }
    
    // Notify listeners
    this.listeners.forEach(listener => listener(metric));
    
    return metric;
  }

  // Get budget for a metric
  getBudget(name: string): PerformanceBudgetConfig | undefined {
    return this.budgets.get(name);
  }

  // Get all budgets
  getAllBudgets(): PerformanceBudgetConfig[] {
    return Array.from(this.budgets.values());
  }

  // Get metrics for a specific budget
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalMetrics: number;
    budgetViolations: number;
    warningCount: number;
    criticalCount: number;
    averagesByMetric: Record<string, number>;
  } {
    const budgetViolations = this.metrics.filter(m => !m.isWithinBudget).length;
    const warningCount = this.metrics.filter(m => m.warningLevel === 'warning').length;
    const criticalCount = this.metrics.filter(m => m.warningLevel === 'critical').length;
    
    // Calculate averages by metric type
    const averagesByMetric: Record<string, number> = {};
    const metricGroups = this.metrics.reduce((groups, metric) => {
      if (!groups[metric.name]) {
        groups[metric.name] = [];
      }
      groups[metric.name].push(metric.value);
      return groups;
    }, {} as Record<string, number[]>);
    
    Object.entries(metricGroups).forEach(([name, values]) => {
      averagesByMetric[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });
    
    return {
      totalMetrics: this.metrics.length,
      budgetViolations,
      warningCount,
      criticalCount,
      averagesByMetric
    };
  }

  // Add listener for metric updates
  addListener(listener: (metric: PerformanceMetric) => void): void {
    this.listeners.push(listener);
  }

  // Remove listener
  removeListener(listener: (metric: PerformanceMetric) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
  }

  // Export performance report
  exportReport(): string {
    const summary = this.getPerformanceSummary();
    const budgets = this.getAllBudgets();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      budgets,
      recentMetrics: this.metrics.slice(-20) // Last 20 metrics
    };
    
    return JSON.stringify(report, null, 2);
  }
}

// Performance timing decorator
export function measurePerformanceBudget(metricName: string) {
  return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const budgetManager = PerformanceBudgetManager.getInstance();
    
    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();
      
      const result = method.apply(this, args);
      
      // Handle both sync and async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          budgetManager.recordMetric(metricName, duration);
        });
      } else {
        const duration = performance.now() - startTime;
        budgetManager.recordMetric(metricName, duration);
        return result;
      }
    };
  };
}

// React hook for performance monitoring
export function usePerformanceMonitoring(metricName: string) {
  const budgetManager = PerformanceBudgetManager.getInstance();
  
  const measureRender = (callback: () => void) => {
    const startTime = performance.now();
    callback();
    const duration = performance.now() - startTime;
    budgetManager.recordMetric(metricName, duration);
  };
  
  const measureAsync = async (asyncCallback: () => Promise<void>) => {
    const startTime = performance.now();
    await asyncCallback();
    const duration = performance.now() - startTime;
    budgetManager.recordMetric(metricName, duration);
  };
  
  return { measureRender, measureAsync };
}

// Performance budget checker utility
export class PerformanceChecker {
  private budgetManager: PerformanceBudgetManager;
  
  constructor() {
    this.budgetManager = PerformanceBudgetManager.getInstance();
  }
  
  // Check if system is performing well
  isPerformingWell(): boolean {
    const summary = this.budgetManager.getPerformanceSummary();
    
    // Consider performance poor if more than 20% of metrics exceed budget
    const violationRate = summary.budgetViolations / Math.max(summary.totalMetrics, 1);
    return violationRate <= 0.2;
  }
  
  // Get performance recommendations
  getRecommendations(): string[] {
    const summary = this.budgetManager.getPerformanceSummary();
    const recommendations: string[] = [];
    
    if (summary.criticalCount > 0) {
      recommendations.push('Critical performance issues detected. Consider reducing animation complexity.');
    }
    
    if (summary.warningCount > summary.totalMetrics * 0.3) {
      recommendations.push('High number of performance warnings. Consider optimizing component renders.');
    }
    
    // Check specific metrics
    Object.entries(summary.averagesByMetric).forEach(([metric, average]) => {
      const budget = this.budgetManager.getBudget(metric);
      if (budget && average > budget.budget) {
        recommendations.push(`${metric} is consistently over budget (${average.toFixed(2)}ms vs ${budget.budget}ms)`);
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('Performance is within acceptable limits.');
    }
    
    return recommendations;
  }
}

// Global instances
export const performanceBudgetManager = PerformanceBudgetManager.getInstance();
export const performanceChecker = new PerformanceChecker();