// Core TypeScript interfaces for Shahapur Sahayak

export interface ShoppingItem {
  name: string;
  category: 'bulk' | 'daily';
  reason: string;
}

export interface OptimizationResult {
  bulkItems: ShoppingItem[];
  dailyItems: ShoppingItem[];
}

export interface CrossingLocation {
  id: string;
  name: string;
  isDangerZone: boolean;
  warning?: string;
  alternative?: string;
}

export interface SafetyResult {
  location: CrossingLocation;
  isWarning: boolean;
  message: string;
}