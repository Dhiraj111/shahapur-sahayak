// Property-based tests for shopping optimization
// Feature: shahapur-sahayak, Property 1: Shopping Item Categorization Completeness

import * as fc from 'fast-check';
import { categorizeShoppingItem, optimizeShoppingList } from '../shopping';

describe('Shopping Optimization Property Tests', () => {
  
  // Property 1: Shopping Item Categorization Completeness
  // For any shopping list input, every item should be categorized as either bulk or daily purchase with no items left uncategorized
  // Validates: Requirements 1.1
  test('Property 1: Shopping Item Categorization Completeness', () => {
    fc.assert(
      fc.property(
        // Generate more realistic shopping item names (no commas or newlines)
        fc.array(
          fc.string({ minLength: 1, maxLength: 30 })
            .filter(s => !s.includes(',') && !s.includes('\n') && s.trim().length > 0),
          { minLength: 1, maxLength: 10 }
        ),
        (shoppingItems) => {
          // Test individual item categorization
          for (const item of shoppingItems) {
            const categorizedItem = categorizeShoppingItem(item);
            
            // Every item must have a name
            expect(categorizedItem.name).toBe(item);
            
            // Every item must be categorized as either 'bulk' or 'daily'
            expect(['bulk', 'daily']).toContain(categorizedItem.category);
            
            // Every item must have a non-empty reason
            expect(categorizedItem.reason).toBeTruthy();
            expect(typeof categorizedItem.reason).toBe('string');
            expect(categorizedItem.reason.length).toBeGreaterThan(0);
          }
          
          // Test shopping list optimization with newline-separated input
          const inputText = shoppingItems.join('\n');
          const result = optimizeShoppingList(inputText);
          
          // All items should be categorized (no items left out)
          const totalCategorizedItems = result.bulkItems.length + result.dailyItems.length;
          expect(totalCategorizedItems).toBe(shoppingItems.length);
          
          // Each categorized item should have proper structure
          [...result.bulkItems, ...result.dailyItems].forEach(item => {
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('category');
            expect(item).toHaveProperty('reason');
            expect(['bulk', 'daily']).toContain(item.category);
            expect(typeof item.name).toBe('string');
            expect(typeof item.reason).toBe('string');
            expect(item.reason.length).toBeGreaterThan(0);
          });
          
          // Bulk items should only be in bulkItems array
          result.bulkItems.forEach(item => {
            expect(item.category).toBe('bulk');
          });
          
          // Daily items should only be in dailyItems array  
          result.dailyItems.forEach(item => {
            expect(item.category).toBe('daily');
          });
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 2: Bulk Item Classification Consistency
  // For any item from the bulk category list (oil >2L, sugar >2kg, detergents, shampoos, family pack biscuits), the Shopping_Optimizer should categorize it as bulk purchase for D-Mart
  // Validates: Requirements 1.2
  test('Property 2: Bulk Item Classification Consistency', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Oil with quantity indicators
          fc.constantFrom('oil 2L', 'oil >2L', 'cooking oil 2 liters', 'sunflower oil 2L'),
          // Sugar with quantity indicators  
          fc.constantFrom('sugar 2kg', 'sugar >2kg', 'white sugar 2 kilos', 'sugar 2 kg'),
          // Detergents
          fc.constantFrom('detergent', 'detergents', 'washing detergent', 'laundry detergent'),
          // Shampoos
          fc.constantFrom('shampoo', 'shampoos', 'hair shampoo', 'anti-dandruff shampoo'),
          // Family pack biscuits
          fc.constantFrom('family pack biscuits', 'biscuits family pack', 'family pack', 'biscuit family pack')
        ),
        (bulkItem) => {
          const categorizedItem = categorizeShoppingItem(bulkItem);
          
          // Should be categorized as bulk
          expect(categorizedItem.category).toBe('bulk');
          expect(categorizedItem.name).toBe(bulkItem);
          expect(categorizedItem.reason).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 3: Daily Item Classification Consistency
  // For any item from the daily category list (milk, bread, eggs, cigarettes, loose rice <2kg), the Shopping_Optimizer should categorize it as daily purchase for Kirana
  // Validates: Requirements 1.3
  test('Property 3: Daily Item Classification Consistency', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Milk variations
          fc.constantFrom('milk', 'fresh milk', 'cow milk', 'buffalo milk'),
          // Bread variations
          fc.constantFrom('bread', 'white bread', 'brown bread', 'whole wheat bread'),
          // Eggs variations
          fc.constantFrom('eggs', 'egg', 'chicken eggs', 'fresh eggs'),
          // Cigarettes variations
          fc.constantFrom('cigarettes', 'cigarette', 'smoking cigarettes'),
          // Rice variations (loose/small quantities)
          fc.constantFrom('rice', 'loose rice', 'rice <2kg', 'basmati rice 1kg')
        ),
        (dailyItem) => {
          const categorizedItem = categorizeShoppingItem(dailyItem);
          
          // Should be categorized as daily
          expect(categorizedItem.category).toBe('daily');
          expect(categorizedItem.name).toBe(dailyItem);
          expect(categorizedItem.reason).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 5: Categorization Reasoning Completeness
  // For any categorized shopping item, the item should include a non-empty reasoning explanation based on cost savings or convenience factors
  // Validates: Requirements 1.5
  test('Property 5: Categorization Reasoning Completeness', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 })
          .filter(s => !s.includes(',') && !s.includes('\n') && s.trim().length > 0),
        (item) => {
          const categorizedItem = categorizeShoppingItem(item);
          
          // Must have non-empty reasoning
          expect(categorizedItem.reason).toBeTruthy();
          expect(typeof categorizedItem.reason).toBe('string');
          expect(categorizedItem.reason.length).toBeGreaterThan(0);
          
          // Reasoning should mention either cost savings or convenience factors
          const reasoning = categorizedItem.reason.toLowerCase();
          const hasRelevantReasoning = 
            reasoning.includes('cost') || 
            reasoning.includes('saving') || 
            reasoning.includes('discount') ||
            reasoning.includes('convenience') ||
            reasoning.includes('queue') ||
            reasoning.includes('credit') ||
            reasoning.includes('instant') ||
            reasoning.includes('supporting') ||
            reasoning.includes('unknown');
            
          expect(hasRelevantReasoning).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 12: Multi-Item Input Processing
  // For any text input containing multiple shopping items, the Shopping_Optimizer should successfully parse and process all items
  // Validates: Requirements 4.1
  test('Property 12: Multi-Item Input Processing', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 })
            .filter(s => !s.includes(',') && !s.includes('\n') && s.trim().length > 0),
          { minLength: 1, maxLength: 8 }
        ),
        fc.oneof(
          fc.constant(','), // comma-separated
          fc.constant('\n'), // newline-separated
          fc.constant(',\n') // mixed separators
        ),
        (items, separator) => {
          // Create input text with the specified separator
          const inputText = items.join(separator);
          
          const result = optimizeShoppingList(inputText);
          
          // Should successfully process all items
          const totalProcessedItems = result.bulkItems.length + result.dailyItems.length;
          expect(totalProcessedItems).toBe(items.length);
          
          // Each item should be properly categorized
          const allProcessedItems = [...result.bulkItems, ...result.dailyItems];
          
          // Check that all original items are represented (accounting for trimming)
          const processedItemNames = allProcessedItems.map(item => item.name);
          const trimmedOriginalItems = items.map(item => item.trim());
          
          trimmedOriginalItems.forEach(originalItem => {
            expect(processedItemNames).toContain(originalItem);
          });
          
          // Each processed item should have proper structure
          allProcessedItems.forEach(item => {
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('category');
            expect(item).toHaveProperty('reason');
            expect(['bulk', 'daily']).toContain(item.category);
            expect(typeof item.name).toBe('string');
            expect(typeof item.reason).toBe('string');
            expect(item.name.length).toBeGreaterThan(0);
            expect(item.reason.length).toBeGreaterThan(0);
          });
          
          // Bulk items should only be in bulkItems array
          result.bulkItems.forEach(item => {
            expect(item.category).toBe('bulk');
          });
          
          // Daily items should only be in dailyItems array
          result.dailyItems.forEach(item => {
            expect(item.category).toBe('daily');
          });
        }
      ),
      { numRuns: 100 }
    );
  });
  
});