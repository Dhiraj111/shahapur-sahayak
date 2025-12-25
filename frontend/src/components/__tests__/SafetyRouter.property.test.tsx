import * as fc from 'fast-check';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import SafetyRouter from '../SafetyRouter';
import { SAFE_LOCATIONS, DANGER_ZONES, ALL_CROSSING_LOCATIONS } from '../../constants';

describe('SafetyRouter Property Tests', () => {
  
  afterEach(() => {
    cleanup();
  });
  
  // Property 7: Safe Location Theme Consistency
  // **Validates: Requirements 2.4**
  test('Property 7: Safe Location Theme Consistency - For any safe crossing location selection, the display should use safe green theme styling', async () => {
    // **Feature: shahapur-sahayak, Property 7: Safe Location Theme Consistency**
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...Object.keys(SAFE_LOCATIONS)),
        async (safeLocationId) => {
          cleanup();
          const { container } = render(<SafetyRouter />);
          
          const dropdown = container.querySelector('.location-dropdown') as HTMLSelectElement;
          expect(dropdown).toBeTruthy();
          
          // Use act to wrap the state update
          await act(async () => {
            fireEvent.change(dropdown, { target: { value: safeLocationId } });
            
            // Wait for the setTimeout to complete
            await new Promise(resolve => setTimeout(resolve, 250));
          });
          
          const resultElement = container.querySelector('.safety-result');
          expect(resultElement).toBeTruthy();
          expect(resultElement?.classList.contains('safe-zone')).toBe(true);
          expect(resultElement?.classList.contains('danger-zone')).toBe(false);
        }
      ),
      { numRuns: 10 } // Reduced runs for faster execution
    );
  }, 15000); // Increased timeout

  // Property 9: Visual Theme Consistency  
  // **Validates: Requirements 3.1**
  test('Property 9: Visual Theme Consistency - For any system state, safe actions should use green theme styling and warning states should use red theme styling', async () => {
    // **Feature: shahapur-sahayak, Property 9: Visual Theme Consistency**
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...Object.keys(ALL_CROSSING_LOCATIONS)),
        async (locationId) => {
          cleanup();
          const { container } = render(<SafetyRouter />);
          
          const dropdown = container.querySelector('.location-dropdown') as HTMLSelectElement;
          expect(dropdown).toBeTruthy();
          
          // Use act to wrap the state update
          await act(async () => {
            fireEvent.change(dropdown, { target: { value: locationId } });
            
            // Wait for the setTimeout to complete
            await new Promise(resolve => setTimeout(resolve, 250));
          });
          
          const location = ALL_CROSSING_LOCATIONS[locationId];
          const resultElement = container.querySelector('.safety-result');
          expect(resultElement).toBeTruthy();
          
          if (location.isDangerZone) {
            // Warning states should use red theme
            expect(resultElement?.classList.contains('danger-zone')).toBe(true);
            expect(resultElement?.classList.contains('safe-zone')).toBe(false);
          } else {
            // Safe actions should use green theme
            expect(resultElement?.classList.contains('safe-zone')).toBe(true);
            expect(resultElement?.classList.contains('danger-zone')).toBe(false);
          }
        }
      ),
      { numRuns: 10 } // Reduced runs for faster execution
    );
  }, 15000); // Increased timeout

  // Property 10: Danger Zone Warning Styling
  // **Validates: Requirements 3.3**
  test('Property 10: Danger Zone Warning Styling - For any danger zone warning display, the UI should render red warning card styling', async () => {
    // **Feature: shahapur-sahayak, Property 10: Danger Zone Warning Styling**
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...Object.keys(DANGER_ZONES)),
        async (dangerZoneId) => {
          cleanup();
          const { container } = render(<SafetyRouter />);
          
          const dropdown = container.querySelector('.location-dropdown') as HTMLSelectElement;
          expect(dropdown).toBeTruthy();
          
          // Use act to wrap the state update
          await act(async () => {
            fireEvent.change(dropdown, { target: { value: dangerZoneId } });
            
            // Wait for the setTimeout to complete
            await new Promise(resolve => setTimeout(resolve, 250));
          });
          
          const resultElement = container.querySelector('.safety-result');
          expect(resultElement).toBeTruthy();
          expect(resultElement?.classList.contains('danger-zone')).toBe(true);
          expect(resultElement?.classList.contains('safe-zone')).toBe(false);
          
          // Should contain warning icon
          const warningIcon = container.querySelector('.result-icon');
          expect(warningIcon?.textContent).toContain('⚠️');
        }
      ),
      { numRuns: 10 } // Reduced runs for faster execution
    );
  }, 15000); // Increased timeout
});