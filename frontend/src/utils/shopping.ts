// Shopping optimization business logic

import type { ShoppingItem, OptimizationResult } from '../types';
import { BULK_REASONING, DAILY_REASONING } from '../constants';

export function categorizeShoppingItem(item: string): ShoppingItem {
  const normalizedItem = item.toLowerCase().trim();
  
  // Check for bulk items with specific quantity rules
  if (normalizedItem.includes('oil')) {
    // Check for large quantities (>2L) - look for numbers followed by L/liter/litre
    const hasLargeQuantity = /(\d+)\s*(l|liter|litre)/i.test(normalizedItem);
    if (hasLargeQuantity) {
      const match = normalizedItem.match(/(\d+)\s*(l|liter|litre)/i);
      if (match && parseInt(match[1]) >= 2) {
        return {
          name: item,
          category: 'bulk',
          reason: BULK_REASONING
        };
      }
    }
    // If no quantity specified or small quantity, default to daily
  }
  
  if (normalizedItem.includes('sugar')) {
    // Check for large quantities (>2kg) - look for numbers followed by kg/kilo
    const hasLargeQuantity = /(\d+)\s*(kg|kilo)/i.test(normalizedItem);
    if (hasLargeQuantity) {
      const match = normalizedItem.match(/(\d+)\s*(kg|kilo)/i);
      if (match && parseInt(match[1]) >= 2) {
        return {
          name: item,
          category: 'bulk', 
          reason: BULK_REASONING
        };
      }
    }
    // If no quantity specified or small quantity, default to daily
  }
  
  // Check for other bulk items (detergents, shampoos, family pack biscuits)
  const bulkKeywords = ['detergent', 'shampoo', 'family pack', 'biscuit'];
  const isBulkItem = bulkKeywords.some(keyword => normalizedItem.includes(keyword));
  
  if (isBulkItem) {
    return {
      name: item,
      category: 'bulk',
      reason: BULK_REASONING
    };
  }
  
  // Check for daily items with specific rules
  if (normalizedItem.includes('rice') && (normalizedItem.includes('<2kg') || normalizedItem.includes('loose') || (!normalizedItem.includes('2kg') && !normalizedItem.includes('kg')))) {
    return {
      name: item,
      category: 'daily',
      reason: DAILY_REASONING
    };
  }
  
  // Check for other daily items
  const dailyKeywords = ['milk', 'bread', 'egg', 'cigarette'];
  const isDailyItem = dailyKeywords.some(keyword => normalizedItem.includes(keyword));
  
  if (isDailyItem) {
    return {
      name: item,
      category: 'daily',
      reason: DAILY_REASONING
    };
  }
  
  // Default to daily for unknown items (safer for local economy)
  return {
    name: item,
    category: 'daily',
    reason: 'Unknown item - supporting local Kirana store for convenience'
  };
}

export function optimizeShoppingList(inputText: string): OptimizationResult {
  if (!inputText || inputText.trim().length === 0) {
    return {
      bulkItems: [],
      dailyItems: []
    };
  }
  
  // Parse input text into individual items
  // Handle both comma-separated and newline-separated inputs
  const normalizedInput = inputText.trim();
  
  let items: string[] = [];
  
  // Check if input contains newlines - if so, split by newlines first
  if (normalizedInput.includes('\n')) {
    const lines = normalizedInput.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Each line might contain comma-separated items
    for (const line of lines) {
      if (line.includes(',')) {
        const lineItems = line.split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
        items.push(...lineItems);
      } else {
        items.push(line);
      }
    }
  } else if (normalizedInput.includes(',')) {
    // Single line with comma-separated items
    items = normalizedInput.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  } else {
    // Single item
    items = [normalizedInput];
  }
  
  // Categorize each item (preserving duplicates)
  const categorizedItems = items.map(categorizeShoppingItem);
  
  return {
    bulkItems: categorizedItems.filter(item => item.category === 'bulk'),
    dailyItems: categorizedItems.filter(item => item.category === 'daily')
  };
}