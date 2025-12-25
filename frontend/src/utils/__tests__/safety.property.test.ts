// Property-based tests for safety routing
// Feature: shahapur-sahayak, Property 6: Location Safety Evaluation Completeness
// Feature: shahapur-sahayak, Property 8: Danger Zone Risk Information

import * as fc from 'fast-check';
import { evaluateCrossingLocation } from '../safety';
import { ALL_CROSSING_LOCATIONS, DANGER_ZONES, SAFE_LOCATIONS } from '../../constants';

describe('Safety Routing Property Tests', () => {
  
  // Property 6: Location Safety Evaluation Completeness
  // For any crossing location selection, the Safety_Router should evaluate and classify the location as either safe or dangerous
  // Validates: Requirements 2.1
  test('Property 6: Location Safety Evaluation Completeness', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Test with known location IDs
          fc.constantFrom(...Object.keys(ALL_CROSSING_LOCATIONS)),
          // Test with unknown location IDs - avoid JavaScript built-in method names
          fc.string({ minLength: 1, maxLength: 30 })
            .filter(s => 
              !Object.keys(ALL_CROSSING_LOCATIONS).includes(s) &&
              !['valueOf', 'toString', 'hasOwnProperty', 'constructor', 'prototype'].includes(s) &&
              s.trim().length > 0
            )
        ),
        (locationId) => {
          const result = evaluateCrossingLocation(locationId);
          
          // Must return a SafetyResult with proper structure
          expect(result).toHaveProperty('location');
          expect(result).toHaveProperty('isWarning');
          expect(result).toHaveProperty('message');
          
          // Location must have proper structure
          expect(result.location).toHaveProperty('id');
          expect(result.location).toHaveProperty('name');
          expect(result.location).toHaveProperty('isDangerZone');
          
          // isWarning must be boolean
          expect(typeof result.isWarning).toBe('boolean');
          
          // message must be non-empty string
          expect(typeof result.message).toBe('string');
          expect(result.message.length).toBeGreaterThan(0);
          
          // Classification consistency: isWarning should match location.isDangerZone
          expect(result.isWarning).toBe(result.location.isDangerZone);
          
          // Location ID should be preserved
          expect(result.location.id).toBe(locationId);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Property 8: Danger Zone Risk Information
  // For any danger zone location, the system should provide a specific, non-empty risk explanation
  // Validates: Requirements 2.5
  test('Property 8: Danger Zone Risk Information', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(DANGER_ZONES)),
        (dangerZoneId) => {
          const result = evaluateCrossingLocation(dangerZoneId);
          
          // Must be classified as warning
          expect(result.isWarning).toBe(true);
          expect(result.location.isDangerZone).toBe(true);
          
          // Must have specific risk explanation in message
          expect(result.message).toBeTruthy();
          expect(typeof result.message).toBe('string');
          expect(result.message.length).toBeGreaterThan(0);
          
          // Message should contain danger zone indicator
          expect(result.message.toLowerCase()).toContain('danger');
          
          // Should contain specific risk information from the danger zone definition
          const dangerZone = DANGER_ZONES[dangerZoneId];
          expect(result.message).toContain(dangerZone.warning);
          
          // If alternative exists, should be included in message
          if (dangerZone.alternative) {
            expect(result.message).toContain(dangerZone.alternative);
          }
          
          // Location should have warning property
          expect(result.location.warning).toBeTruthy();
          expect(typeof result.location.warning).toBe('string');
          expect(result.location.warning!.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Additional property test for safe locations (complementary to danger zones)
  test('Property: Safe Location Confirmation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(SAFE_LOCATIONS)),
        (safeLocationId) => {
          const result = evaluateCrossingLocation(safeLocationId);
          
          // Must be classified as safe
          expect(result.isWarning).toBe(false);
          expect(result.location.isDangerZone).toBe(false);
          
          // Must have positive confirmation message
          expect(result.message).toBeTruthy();
          expect(typeof result.message).toBe('string');
          expect(result.message.length).toBeGreaterThan(0);
          
          // Message should contain safe indicator
          expect(result.message.toLowerCase()).toContain('safe');
          
          // Should not have warning property or it should be undefined
          expect(result.location.warning).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
  
});