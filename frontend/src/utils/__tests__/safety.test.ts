// Unit tests for safety routing business logic

import { evaluateCrossingLocation } from '../safety';

describe('Safety Routing Unit Tests', () => {
  
  // Test Kinhavali Junction warning and Subway 2 alternative
  // Requirements: 2.2
  describe('Kinhavali Junction', () => {
    test('should display red warning about high-speed trucks from flyover blindspot', () => {
      const result = evaluateCrossingLocation('kinhavali-junction');
      
      expect(result.isWarning).toBe(true);
      expect(result.location.isDangerZone).toBe(true);
      expect(result.location.name).toBe('Kinhavali Junction');
      expect(result.location.id).toBe('kinhavali-junction');
      
      // Should contain specific warning about high-speed trucks and flyover blindspot
      expect(result.message).toContain('DANGER ZONE');
      expect(result.message).toContain('High-speed trucks from flyover blindspot');
      expect(result.message).toContain('NEVER cross here while walking');
      
      // Should suggest Subway 2 alternative
      expect(result.message).toContain('Use Subway 2');
      expect(result.message).toContain('add 4 mins walk');
      expect(result.location.alternative).toBe('Use Subway 2 (add 4 mins walk)');
    });
  });
  
  // Test Petrol Pump Cut warning and 200m gap advice
  // Requirements: 2.3
  describe('Petrol Pump Cut', () => {
    test('should display red warning about no traffic signal and advise 200m clear gap', () => {
      const result = evaluateCrossingLocation('petrol-pump-cut');
      
      expect(result.isWarning).toBe(true);
      expect(result.location.isDangerZone).toBe(true);
      expect(result.location.name).toBe('Petrol Pump Cut');
      expect(result.location.id).toBe('petrol-pump-cut');
      
      // Should contain specific warning about no traffic signal
      expect(result.message).toContain('DANGER ZONE');
      expect(result.message).toContain('No traffic signal');
      expect(result.message).toContain('high risk crossing');
      
      // Should advise waiting for 200m clear gap
      expect(result.message).toContain('Wait for a clear gap of 200m');
      expect(result.location.alternative).toBe('Wait for a clear gap of 200m before crossing');
    });
  });
  
  // Test safe locations for comparison
  describe('Safe Locations', () => {
    test('should confirm Subway 2 as safe crossing point', () => {
      const result = evaluateCrossingLocation('subway-2');
      
      expect(result.isWarning).toBe(false);
      expect(result.location.isDangerZone).toBe(false);
      expect(result.location.name).toBe('Subway 2 (Near Market)');
      expect(result.location.id).toBe('subway-2');
      
      // Should provide safe confirmation
      expect(result.message).toContain('Safe crossing point');
      expect(result.message).toContain('✅');
      expect(result.location.warning).toBeUndefined();
      expect(result.location.alternative).toBeUndefined();
    });
    
    test('should confirm Food Court as safe crossing point', () => {
      const result = evaluateCrossingLocation('food-court');
      
      expect(result.isWarning).toBe(false);
      expect(result.location.isDangerZone).toBe(false);
      expect(result.location.name).toBe('Food Court Signal');
      expect(result.location.id).toBe('food-court');
      
      // Should provide safe confirmation
      expect(result.message).toContain('Safe crossing point');
      expect(result.message).toContain('✅');
      expect(result.location.warning).toBeUndefined();
      expect(result.location.alternative).toBeUndefined();
    });
  });
  
  // Test unknown location handling
  describe('Unknown Locations', () => {
    test('should handle unknown location gracefully', () => {
      const result = evaluateCrossingLocation('unknown-location');
      
      expect(result.isWarning).toBe(false);
      expect(result.location.isDangerZone).toBe(false);
      expect(result.location.name).toBe('Unknown Location');
      expect(result.location.id).toBe('unknown-location');
      
      // Should provide guidance to select known location
      expect(result.message).toContain('Location not recognized');
      expect(result.message).toContain('Please select a known crossing point');
    });
  });
  
});