// Performance monitoring and optimization utilities

// Performance monitoring class for tracking render times and optimization metrics
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing a performance metric
  startTiming(label: string): void {
    if (!this.isEnabled) return;
    performance.mark(`${label}-start`);
  }

  // End timing and record the metric
  endTiming(label: string): number {
    if (!this.isEnabled) return 0;
    
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label, 'measure')[0];
    const duration = measure.duration;
    
    // Store the metric
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);
    
    // Clean up performance entries
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  }

  // Get average performance for a metric
  getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Get performance report
  getReport(): Record<string, { average: number; count: number; latest: number }> {
    const report: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [label, times] of this.metrics.entries()) {
      if (times.length > 0) {
        report[label] = {
          average: this.getAverageTime(label),
          count: times.length,
          latest: times[times.length - 1]
        };
      }
    }
    
    return report;
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
  }

  // Log performance report to console (development only)
  logReport(): void {
    if (!this.isEnabled) return;
    
    const report = this.getReport();
    if (Object.keys(report).length > 0) {
      console.group('🚀 Performance Report');
      for (const [label, data] of Object.entries(report)) {
        console.log(`${label}: ${data.latest.toFixed(2)}ms (avg: ${data.average.toFixed(2)}ms, count: ${data.count})`);
      }
      console.groupEnd();
    }
  }
}

// Performance decorator for timing function execution
export function measurePerformance(label: string) {
  return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const monitor = PerformanceMonitor.getInstance();
      monitor.startTiming(label);
      
      const result = method.apply(this, args);
      
      // Handle both sync and async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          monitor.endTiming(label);
        });
      } else {
        monitor.endTiming(label);
        return result;
      }
    };
  };
}

// Debounce utility for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

// Throttle utility for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if device has limited performance capabilities
export function isLowEndDevice(): boolean {
  // Check for various indicators of low-end devices
  const navigator = window.navigator as any;
  
  // Check memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
    return true;
  }
  
  // Check hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    return true;
  }
  
  // Check connection type (if available)
  if (navigator.connection) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return true;
    }
  }
  
  // Check user agent for known low-end devices
  const userAgent = navigator.userAgent.toLowerCase();
  const lowEndIndicators = [
    'android 4',
    'android 5',
    'android 6',
    'iphone os 9',
    'iphone os 10',
    'iphone os 11'
  ];
  
  return lowEndIndicators.some(indicator => userAgent.includes(indicator));
}

// Optimize animations based on device capabilities
export function getOptimizedAnimationConfig() {
  const isLowEnd = isLowEndDevice();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  if (prefersReducedMotion) {
    return {
      duration: 0,
      easing: 'linear',
      enabled: false
    };
  }
  
  if (isLowEnd) {
    return {
      duration: 150, // Shorter animations
      easing: 'ease-out',
      enabled: true,
      simplified: true
    };
  }
  
  return {
    duration: 300, // Full animations
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    enabled: true,
    simplified: false
  };
}

// Request idle callback polyfill for better performance scheduling
export function requestIdleCallback(callback: (deadline: { timeRemaining: () => number }) => void): number {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  
  // Polyfill for browsers that don't support requestIdleCallback
  return (window as any).setTimeout(() => {
    const start = Date.now();
    callback({
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
}

// Cancel idle callback
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    (window as any).clearTimeout(id);
  }
}

// Batch DOM updates for better performance
export class DOMBatcher {
  private updates: (() => void)[] = [];
  private scheduled = false;

  add(update: () => void): void {
    this.updates.push(update);
    this.schedule();
  }

  private schedule(): void {
    if (this.scheduled) return;
    
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.flush();
    });
  }

  private flush(): void {
    const updates = this.updates.splice(0);
    this.scheduled = false;
    
    updates.forEach(update => update());
  }
}

// Global DOM batcher instance
export const domBatcher = new DOMBatcher();

// Performance budget checker
export class PerformanceBudget {
  private budgets: Map<string, number> = new Map();
  
  setBudget(metric: string, budget: number): void {
    this.budgets.set(metric, budget);
  }
  
  checkBudget(metric: string, actual: number): boolean {
    const budget = this.budgets.get(metric);
    if (!budget) return true;
    
    const isWithinBudget = actual <= budget;
    
    if (!isWithinBudget && process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Performance budget exceeded for ${metric}: ${actual.toFixed(2)}ms (budget: ${budget}ms)`);
    }
    
    return isWithinBudget;
  }
}

// Global performance budget instance
export const performanceBudget = new PerformanceBudget();

// Set default performance budgets
performanceBudget.setBudget('optimization', 300); // Shopping list optimization should complete within 300ms
performanceBudget.setBudget('render', 16); // Component renders should complete within 16ms (60fps)
performanceBudget.setBudget('animation', 200); // Animations should complete within 200ms