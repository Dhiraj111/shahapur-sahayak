// Frame rate monitoring utility for performance tracking

export class FrameRateMonitor {
  private static instance: FrameRateMonitor;
  private isMonitoring = false;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private fpsHistory: number[] = [];
  private animationFrameId: number | null = null;
  private callbacks: ((fps: number) => void)[] = [];
  private performanceThreshold = 30; // FPS threshold for performance warnings

  static getInstance(): FrameRateMonitor {
    if (!FrameRateMonitor.instance) {
      FrameRateMonitor.instance = new FrameRateMonitor();
    }
    return FrameRateMonitor.instance;
  }

  // Start monitoring frame rate
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    
    this.measureFrameRate();
  }

  // Stop monitoring frame rate
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Get current FPS
  getCurrentFPS(): number {
    return this.fps;
  }

  // Get average FPS over the monitoring period
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    
    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0);
    return sum / this.fpsHistory.length;
  }

  // Get minimum FPS recorded
  getMinimumFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return Math.min(...this.fpsHistory);
  }

  // Check if performance is below threshold
  isPerformancePoor(): boolean {
    return this.getAverageFPS() < this.performanceThreshold;
  }

  // Add callback for FPS updates
  onFPSUpdate(callback: (fps: number) => void): void {
    this.callbacks.push(callback);
  }

  // Remove callback
  removeFPSCallback(callback: (fps: number) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  // Set performance threshold
  setPerformanceThreshold(threshold: number): void {
    this.performanceThreshold = threshold;
  }

  // Get performance report
  getPerformanceReport(): {
    current: number;
    average: number;
    minimum: number;
    isPoor: boolean;
    sampleCount: number;
  } {
    return {
      current: this.fps,
      average: this.getAverageFPS(),
      minimum: this.getMinimumFPS(),
      isPoor: this.isPerformancePoor(),
      sampleCount: this.fpsHistory.length
    };
  }

  private measureFrameRate = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.fpsHistory.push(this.fps);
      
      // Keep only last 60 seconds of data
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      // Notify callbacks
      this.callbacks.forEach(callback => callback(this.fps));
      
      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development' && this.fps < this.performanceThreshold) {
        console.warn(`⚠️ Low frame rate detected: ${this.fps} FPS (threshold: ${this.performanceThreshold} FPS)`);
      }
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.animationFrameId = requestAnimationFrame(this.measureFrameRate);
  };
}

// Performance degradation detector
export class PerformanceDegradationDetector {
  private frameRateMonitor: FrameRateMonitor;
  private degradationCallbacks: (() => void)[] = [];
  private improvementCallbacks: (() => void)[] = [];
  private isDegraded = false;
  private checkInterval: number | null = null;

  constructor() {
    this.frameRateMonitor = FrameRateMonitor.getInstance();
  }

  // Start monitoring for performance degradation
  startMonitoring(): void {
    this.frameRateMonitor.startMonitoring();
    
    // Check performance every 5 seconds
    this.checkInterval = window.setInterval(() => {
      this.checkPerformance();
    }, 5000);
  }

  // Stop monitoring
  stopMonitoring(): void {
    this.frameRateMonitor.stopMonitoring();
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Add callback for performance degradation
  onDegradation(callback: () => void): void {
    this.degradationCallbacks.push(callback);
  }

  // Add callback for performance improvement
  onImprovement(callback: () => void): void {
    this.improvementCallbacks.push(callback);
  }

  // Check if performance is currently degraded
  isCurrentlyDegraded(): boolean {
    return this.isDegraded;
  }

  private checkPerformance(): void {
    const report = this.frameRateMonitor.getPerformanceReport();
    const wasDegraded = this.isDegraded;
    
    // Consider performance degraded if average FPS is below 30 and we have enough samples
    this.isDegraded = report.isPoor && report.sampleCount >= 3;
    
    // Trigger callbacks on state change
    if (!wasDegraded && this.isDegraded) {
      console.warn('🐌 Performance degradation detected, enabling optimizations');
      this.degradationCallbacks.forEach(callback => callback());
    } else if (wasDegraded && !this.isDegraded) {
      console.log('🚀 Performance improved, disabling optimizations');
      this.improvementCallbacks.forEach(callback => callback());
    }
  }
}

// Animation performance optimizer
export class AnimationOptimizer {
  private static instance: AnimationOptimizer;
  private degradationDetector: PerformanceDegradationDetector;
  private isOptimized = false;
  private originalAnimationDurations = new Map<string, string>();

  static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  constructor() {
    this.degradationDetector = new PerformanceDegradationDetector();
    
    // Set up performance monitoring
    this.degradationDetector.onDegradation(() => {
      this.enableOptimizations();
    });
    
    this.degradationDetector.onImprovement(() => {
      this.disableOptimizations();
    });
  }

  // Start monitoring and optimization
  startOptimization(): void {
    this.degradationDetector.startMonitoring();
  }

  // Stop monitoring and optimization
  stopOptimization(): void {
    this.degradationDetector.stopMonitoring();
    this.disableOptimizations();
  }

  // Check if optimizations are currently enabled
  isOptimizationEnabled(): boolean {
    return this.isOptimized;
  }

  private enableOptimizations(): void {
    if (this.isOptimized) return;
    
    this.isOptimized = true;
    
    // Reduce animation durations
    this.optimizeAnimations();
    
    // Add performance optimization class to body
    document.body.classList.add('performance-optimized');
    
    // Dispatch custom event for components to react to
    window.dispatchEvent(new CustomEvent('performanceOptimizationEnabled'));
  }

  private disableOptimizations(): void {
    if (!this.isOptimized) return;
    
    this.isOptimized = false;
    
    // Restore original animation durations
    this.restoreAnimations();
    
    // Remove performance optimization class
    document.body.classList.remove('performance-optimized');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('performanceOptimizationDisabled'));
  }

  private optimizeAnimations(): void {
    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const style = rule.style;
            
            // Optimize transition durations
            if (style.transitionDuration) {
              if (!this.originalAnimationDurations.has(rule.selectorText)) {
                this.originalAnimationDurations.set(rule.selectorText, style.transitionDuration);
              }
              
              // Reduce duration by 50%
              const duration = parseFloat(style.transitionDuration);
              if (!isNaN(duration)) {
                style.transitionDuration = `${duration * 0.5}s`;
              }
            }
            
            // Optimize animation durations
            if (style.animationDuration) {
              if (!this.originalAnimationDurations.has(rule.selectorText + '-animation')) {
                this.originalAnimationDurations.set(rule.selectorText + '-animation', style.animationDuration);
              }
              
              // Reduce duration by 50%
              const duration = parseFloat(style.animationDuration);
              if (!isNaN(duration)) {
                style.animationDuration = `${duration * 0.5}s`;
              }
            }
          }
        });
      } catch (e) {
        // Ignore cross-origin stylesheet errors
      }
    });
  }

  private restoreAnimations(): void {
    // Restore original animation durations
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        
        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const style = rule.style;
            
            // Restore transition duration
            const originalTransition = this.originalAnimationDurations.get(rule.selectorText);
            if (originalTransition) {
              style.transitionDuration = originalTransition;
            }
            
            // Restore animation duration
            const originalAnimation = this.originalAnimationDurations.get(rule.selectorText + '-animation');
            if (originalAnimation) {
              style.animationDuration = originalAnimation;
            }
          }
        });
      } catch (e) {
        // Ignore cross-origin stylesheet errors
      }
    });
    
    this.originalAnimationDurations.clear();
  }
}

// Global instances
export const frameRateMonitor = FrameRateMonitor.getInstance();
export const animationOptimizer = AnimationOptimizer.getInstance();