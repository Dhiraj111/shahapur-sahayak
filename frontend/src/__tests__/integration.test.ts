// Integration tests for complete user workflows
// Testing that all components work together correctly

import { optimizeShoppingList } from '../utils/shopping';
import { evaluateCrossingLocation } from '../utils/safety';

describe('Integration Tests - Complete User Workflows', () => {
  
  describe('Shopping Optimizer Integration', () => {
    test('should handle complete shopping workflow with mixed items', () => {
      // Test realistic shopping list from product.md specifications
      const shoppingList = 'milk, oil 5L, sugar 3kg, bread, detergent, eggs, cigarettes, shampoo';
      
      const result = optimizeShoppingList(shoppingList);
      
      // Verify structure
      expect(result).toHaveProperty('bulkItems');
      expect(result).toHaveProperty('dailyItems');
      expect(Array.isArray(result.bulkItems)).toBe(true);
      expect(Array.isArray(result.dailyItems)).toBe(true);
      
      // Verify bulk items (should include oil 5L, sugar 3kg, detergent, shampoo)
      const bulkItemNames = result.bulkItems.map(item => item.name.toLowerCase());
      expect(bulkItemNames.some(name => name.includes('oil'))).toBe(true);
      expect(bulkItemNames.some(name => name.includes('sugar'))).toBe(true);
      expect(bulkItemNames.some(name => name.includes('detergent'))).toBe(true);
      expect(bulkItemNames.some(name => name.includes('shampoo'))).toBe(true);
      
      // Verify daily items (should include milk, bread, eggs, cigarettes)
      const dailyItemNames = result.dailyItems.map(item => item.name.toLowerCase());
      expect(dailyItemNames.some(name => name.includes('milk'))).toBe(true);
      expect(dailyItemNames.some(name => name.includes('bread'))).toBe(true);
      expect(dailyItemNames.some(name => name.includes('egg'))).toBe(true);
      expect(dailyItemNames.some(name => name.includes('cigarette'))).toBe(true);
      
      // Verify all items have reasoning
      result.bulkItems.forEach(item => {
        expect(item.reason).toBeTruthy();
        expect(typeof item.reason).toBe('string');
        expect(item.reason.length).toBeGreaterThan(0);
      });
      
      result.dailyItems.forEach(item => {
        expect(item.reason).toBeTruthy();
        expect(typeof item.reason).toBe('string');
        expect(item.reason.length).toBeGreaterThan(0);
      });
    });
    
    test('should handle empty and invalid inputs gracefully', () => {
      // Empty input
      const emptyResult = optimizeShoppingList('');
      expect(emptyResult.bulkItems).toHaveLength(0);
      expect(emptyResult.dailyItems).toHaveLength(0);
      
      // Whitespace only
      const whitespaceResult = optimizeShoppingList('   \n  \t  ');
      expect(whitespaceResult.bulkItems).toHaveLength(0);
      expect(whitespaceResult.dailyItems).toHaveLength(0);
      
      // Special characters only
      const specialResult = optimizeShoppingList('!@#$%^&*()');
      expect(specialResult.bulkItems.length + specialResult.dailyItems.length).toBe(1);
      // Should default to daily category for unknown items
      expect(specialResult.dailyItems).toHaveLength(1);
    });
    
    test('should handle different input formats correctly', () => {
      // Comma-separated
      const commaResult = optimizeShoppingList('milk, bread, oil 5L');
      expect(commaResult.bulkItems.length + commaResult.dailyItems.length).toBe(3);
      
      // Newline-separated
      const newlineResult = optimizeShoppingList('milk\nbread\noil 5L');
      expect(newlineResult.bulkItems.length + newlineResult.dailyItems.length).toBe(3);
      
      // Mixed format
      const mixedResult = optimizeShoppingList('milk, bread\noil 5L, sugar 3kg');
      expect(mixedResult.bulkItems.length + mixedResult.dailyItems.length).toBe(4);
    });
  });
  
  describe('Safety Router Integration', () => {
    test('should handle complete safety evaluation workflow', () => {
      // Test danger zones from product.md
      const kinhavaliResult = evaluateCrossingLocation('kinhavali-junction');
      expect(kinhavaliResult.isWarning).toBe(true);
      expect(kinhavaliResult.location.isDangerZone).toBe(true);
      expect(kinhavaliResult.message).toContain('DANGER');
      expect(kinhavaliResult.message).toContain('truck');
      expect(kinhavaliResult.message).toContain('Subway 2');
      
      const petrolPumpResult = evaluateCrossingLocation('petrol-pump-cut');
      expect(petrolPumpResult.isWarning).toBe(true);
      expect(petrolPumpResult.location.isDangerZone).toBe(true);
      expect(petrolPumpResult.message).toContain('DANGER');
      expect(petrolPumpResult.message).toContain('200m');
      
      // Test safe locations
      const subway2Result = evaluateCrossingLocation('subway-2');
      expect(subway2Result.isWarning).toBe(false);
      expect(subway2Result.location.isDangerZone).toBe(false);
      expect(subway2Result.message).toContain('Safe');
      
      const foodCourtResult = evaluateCrossingLocation('food-court');
      expect(foodCourtResult.isWarning).toBe(false);
      expect(foodCourtResult.location.isDangerZone).toBe(false);
      expect(foodCourtResult.message).toContain('Safe');
    });
    
    test('should handle unknown locations gracefully', () => {
      const unknownResult = evaluateCrossingLocation('unknown-location');
      expect(unknownResult).toHaveProperty('location');
      expect(unknownResult).toHaveProperty('isWarning');
      expect(unknownResult).toHaveProperty('message');
      expect(unknownResult.location.name).toBe('Unknown Location');
      expect(unknownResult.isWarning).toBe(false);
      expect(unknownResult.message).toContain('not recognized');
    });
  });
  
  describe('Business Logic Integration with Product Specifications', () => {
    test('should correctly implement product.md bulk item rules', () => {
      // Test specific product.md rules
      const bulkItems = [
        'oil 5L',      // Oil >2L
        'sugar 3kg',   // Sugar >2kg  
        'detergent',   // Detergents
        'shampoo',     // Shampoos
        'family pack biscuits' // Family pack biscuits
      ];
      
      bulkItems.forEach(item => {
        const result = optimizeShoppingList(item);
        expect(result.bulkItems).toHaveLength(1);
        expect(result.dailyItems).toHaveLength(0);
        expect(result.bulkItems[0].category).toBe('bulk');
        expect(result.bulkItems[0].reason).toContain('15%');
      });
    });
    
    test('should correctly implement product.md daily item rules', () => {
      // Test specific product.md rules
      const dailyItems = [
        'milk',        // Milk
        'bread',       // Bread
        'eggs',        // Eggs
        'cigarettes',  // Cigarettes
        'loose rice'   // Loose rice <2kg
      ];
      
      dailyItems.forEach(item => {
        const result = optimizeShoppingList(item);
        expect(result.dailyItems).toHaveLength(1);
        expect(result.bulkItems).toHaveLength(0);
        expect(result.dailyItems[0].category).toBe('daily');
        expect(result.dailyItems[0].reason).toContain('45 mins');
      });
    });
    
    test('should correctly implement product.md safety rules', () => {
      // Kinhavali Junction - should warn about trucks and suggest Subway 2
      const kinhavali = evaluateCrossingLocation('kinhavali-junction');
      expect(kinhavali.message).toContain('truck');
      expect(kinhavali.message).toContain('flyover');
      expect(kinhavali.message).toContain('Subway 2');
      expect(kinhavali.message).toContain('4 mins');
      
      // Petrol Pump Cut - should warn about no signal and suggest 200m gap
      const petrolPump = evaluateCrossingLocation('petrol-pump-cut');
      expect(petrolPump.message).toContain('traffic signal');
      expect(petrolPump.message).toContain('200m');
    });
  });
  
  describe('State Management and Component Interaction', () => {
    test('should maintain data consistency across operations', () => {
      // Test that repeated operations produce consistent results
      const testInput = 'milk, oil 5L, bread, sugar 3kg';
      
      const result1 = optimizeShoppingList(testInput);
      const result2 = optimizeShoppingList(testInput);
      
      // Results should be identical
      expect(result1.bulkItems).toHaveLength(result2.bulkItems.length);
      expect(result1.dailyItems).toHaveLength(result2.dailyItems.length);
      
      // Same categorization
      result1.bulkItems.forEach((item, index) => {
        expect(item.category).toBe(result2.bulkItems[index].category);
        expect(item.name).toBe(result2.bulkItems[index].name);
      });
      
      result1.dailyItems.forEach((item, index) => {
        expect(item.category).toBe(result2.dailyItems[index].category);
        expect(item.name).toBe(result2.dailyItems[index].name);
      });
    });
    
    test('should handle concurrent operations correctly', () => {
      // Test multiple simultaneous operations
      const operations = [
        () => optimizeShoppingList('milk, bread'),
        () => optimizeShoppingList('oil 5L, sugar 3kg'),
        () => evaluateCrossingLocation('kinhavali-junction'),
        () => evaluateCrossingLocation('subway-2')
      ];
      
      const results = operations.map(op => op());
      
      // All operations should complete successfully
      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(result).toBeTruthy();
      });
      
      // Shopping results should have proper structure
      expect(results[0]).toHaveProperty('bulkItems');
      expect(results[0]).toHaveProperty('dailyItems');
      expect(results[1]).toHaveProperty('bulkItems');
      expect(results[1]).toHaveProperty('dailyItems');
      
      // Safety results should have proper structure
      expect(results[2]).toHaveProperty('location');
      expect(results[2]).toHaveProperty('isWarning');
      expect(results[2]).toHaveProperty('message');
      expect(results[3]).toHaveProperty('location');
      expect(results[3]).toHaveProperty('isWarning');
      expect(results[3]).toHaveProperty('message');
    });
  });
  
});