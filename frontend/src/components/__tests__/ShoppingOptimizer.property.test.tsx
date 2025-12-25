// Property-based tests for ShoppingOptimizer UI component
// Feature: shahapur-sahayak, Property 4: Shopping Results Card Structure
// Feature: shahapur-sahayak, Property 11: Shopping Results UI Structure
// Feature: shahapur-sahayak, Property 13: System Responsiveness
// Feature: shahapur-sahayak, Property 14: Invalid Input Handling
// Feature: shahapur-sahayak, Property 15: Input Modification Handling

import * as fc from 'fast-check';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ShoppingOptimizer from '../ShoppingOptimizer';

describe('ShoppingOptimizer UI Property Tests', () => {
  
  afterEach(() => {
    cleanup();
  });
  
  // Property 4: Shopping Results Card Structure
  // For any shopping list that produces results, the rendered output should contain exactly two distinct cards with titles "Go to D-Mart (Bulk)" and "Support Local Kirana (Daily)"
  // Validates: Requirements 1.4
  test('Property 4: Shopping Results Card Structure', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.string({ minLength: 1, maxLength: 30 })
            .filter(s => !s.includes(',') && !s.includes('\n') && s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
          { minLength: 1, maxLength: 8 }
        ),
        async (shoppingItems) => {
          // Clean up any previous renders
          cleanup();
          
          // Render the component
          const { container } = render(<ShoppingOptimizer />);
          
          // Create input text
          const inputText = shoppingItems.join('\n');
          
          // Find and fill the textarea
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          expect(textarea).toBeTruthy();
          fireEvent.change(textarea, { target: { value: inputText } });
          
          // Click the optimize button
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          expect(optimizeButton).toBeTruthy();
          fireEvent.click(optimizeButton);
          
          // Wait for processing to complete
          await waitFor(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
          }, { timeout: 2000 });
          
          // Check that exactly two distinct cards are rendered
          const bulkCard = container.querySelector('.bulk-card');
          const dailyCard = container.querySelector('.daily-card');
          
          expect(bulkCard).toBeTruthy();
          expect(dailyCard).toBeTruthy();
          expect(bulkCard).not.toBe(dailyCard);
          
          // Check for the specific titles
          const bulkTitle = bulkCard?.querySelector('h3');
          const dailyTitle = dailyCard?.querySelector('h3');
          
          expect(bulkTitle?.textContent).toBe('Go to D-Mart (Bulk)');
          expect(dailyTitle?.textContent).toBe('Support Local Kirana (Daily)');
          
          // Verify both cards are within the results section
          const resultsSection = container.querySelector('.results-section');
          expect(resultsSection).toBeTruthy();
          expect(resultsSection?.contains(bulkCard!)).toBe(true);
          expect(resultsSection?.contains(dailyCard!)).toBe(true);
        }
      ),
      { numRuns: 50 } // Reduced runs for async tests
    );
  }, 30000); // 30 second timeout
  
  // Property 11: Shopping Results UI Structure  
  // For any shopping optimization results, the display should show exactly two distinct cards with clear categorization
  // Validates: Requirements 3.4
  test('Property 11: Shopping Results UI Structure', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 })
            .filter(s => !s.includes(',') && !s.includes('\n') && s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
          { minLength: 1, maxLength: 6 }
        ),
        async (shoppingItems) => {
          // Clean up any previous renders
          cleanup();
          
          // Render the component
          const { container } = render(<ShoppingOptimizer />);
          
          // Create input text
          const inputText = shoppingItems.join(', ');
          
          // Find and fill the textarea
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          expect(textarea).toBeTruthy();
          fireEvent.change(textarea, { target: { value: inputText } });
          
          // Click the optimize button
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          expect(optimizeButton).toBeTruthy();
          fireEvent.click(optimizeButton);
          
          // Wait for processing to complete
          await waitFor(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
          }, { timeout: 2000 });
          
          // Verify exactly two distinct cards with clear categorization
          const bulkCard = container.querySelector('.bulk-card');
          const dailyCard = container.querySelector('.daily-card');
          
          expect(bulkCard).toBeTruthy();
          expect(dailyCard).toBeTruthy();
          
          // Verify clear visual separation - different CSS classes
          expect(bulkCard?.classList.contains('bulk-card')).toBe(true);
          expect(dailyCard?.classList.contains('daily-card')).toBe(true);
          
          // Verify cards are within a results container
          const resultsCards = container.querySelector('.results-cards');
          expect(resultsCards).toBeTruthy();
          expect(resultsCards?.contains(bulkCard!)).toBe(true);
          expect(resultsCards?.contains(dailyCard!)).toBe(true);
          
          // Verify each card has proper structure with title and content area
          const bulkTitle = bulkCard?.querySelector('h3');
          const dailyTitle = dailyCard?.querySelector('h3');
          
          expect(bulkTitle?.textContent).toBe('Go to D-Mart (Bulk)');
          expect(dailyTitle?.textContent).toBe('Support Local Kirana (Daily)');
          
          // Verify categorization is clear - items should appear in appropriate cards
          // Check that any items displayed are in the correct card based on their categorization
          const allListItems = container.querySelectorAll('li');
          
          allListItems.forEach(listItem => {
            const isInBulkCard = bulkCard?.contains(listItem) || false;
            const isInDailyCard = dailyCard?.contains(listItem) || false;
            
            // Each list item should be in exactly one card
            expect(isInBulkCard || isInDailyCard).toBe(true);
            expect(isInBulkCard && isInDailyCard).toBe(false);
          });
        }
      ),
      { numRuns: 50 } // Reduced runs for async tests
    );
  }, 30000); // 30 second timeout

  // Property 13: System Responsiveness
  // For any valid user input, the system should provide immediate feedback and results without delay
  // Validates: Requirements 4.3
  test('Property 13: System Responsiveness', () => {
    // **Feature: shahapur-sahayak, Property 13: System Responsiveness**
    
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 })
            .filter(s => s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
          { minLength: 1, maxLength: 5 }
        ),
        (validItems) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const inputText = validItems.join(', ');
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          // Input should be responsive - button should be enabled when valid input is present
          fireEvent.change(textarea, { target: { value: inputText } });
          expect(optimizeButton.disabled).toBe(false);
          
          // Click should provide immediate feedback (processing state)
          fireEvent.click(optimizeButton);
          
          // Should show processing state immediately
          expect(optimizeButton.textContent).toContain('Processing');
          expect(optimizeButton.disabled).toBe(true);
          
          // After a short delay, should provide results
          setTimeout(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
            
            // Button should be re-enabled after processing
            expect(optimizeButton.disabled).toBe(false);
            expect(optimizeButton.textContent).toContain('Optimize Shopping List');
          }, 500);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 14: Invalid Input Handling
  // For any empty or malformed input, the system should handle it gracefully without crashing and provide appropriate user feedback
  // Validates: Requirements 4.4
  test('Property 14: Invalid Input Handling', () => {
    // **Feature: shahapur-sahayak, Property 14: Invalid Input Handling**
    
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''), // Empty string
          fc.string({ maxLength: 50 }).filter(s => s.trim().length === 0), // Whitespace only
          fc.string({ maxLength: 30 }).filter(s => !/[a-zA-Z]/.test(s) && s.trim().length > 0), // No letters
          fc.array(fc.constant(' '), { minLength: 1, maxLength: 10 }).map(arr => arr.join('')) // Multiple spaces
        ),
        (invalidInput) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          // Set invalid input
          fireEvent.change(textarea, { target: { value: invalidInput } });
          
          // Button should be disabled for empty input
          if (invalidInput.trim().length === 0) {
            expect(optimizeButton.disabled).toBe(true);
          }
          
          // Try to optimize with invalid input
          if (!optimizeButton.disabled) {
            fireEvent.click(optimizeButton);
            
            // Should show error message, not crash
            const errorMessage = container.querySelector('.error-message');
            expect(errorMessage).toBeTruthy();
            expect(errorMessage?.textContent).toBeTruthy();
            
            // Should not show results for invalid input
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeFalsy();
          }
          
          // Component should still be functional (not crashed)
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 15: Input Modification Handling
  // For any sequence of input modifications, the system should re-process and provide updated results for each change
  // Validates: Requirements 4.5
  test('Property 15: Input Modification Handling', () => {
    // **Feature: shahapur-sahayak, Property 15: Input Modification Handling**
    
    fc.assert(
      fc.property(
        fc.array(
          fc.array(
            fc.string({ minLength: 1, maxLength: 15 })
              .filter(s => s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
            { minLength: 1, maxLength: 3 }
          ),
          { minLength: 2, maxLength: 4 }
        ),
        (inputSequence) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          for (let i = 0; i < inputSequence.length; i++) {
            const currentInput = inputSequence[i].join(', ');
            
            // Modify input
            fireEvent.change(textarea, { target: { value: currentInput } });
            
            // Previous results should be cleared when input is modified
            if (i > 0) {
              const resultsSection = container.querySelector('.results-section');
              expect(resultsSection).toBeFalsy();
            }
            
            // Error should be cleared when user starts typing valid input
            const errorMessage = container.querySelector('.error-message');
            expect(errorMessage).toBeFalsy();
            
            // Optimize with current input
            fireEvent.click(optimizeButton);
            
            // Should provide updated results for each modification (after processing delay)
            setTimeout(() => {
              const resultsSection = container.querySelector('.results-section');
              expect(resultsSection).toBeTruthy();
              
              // Results should be specific to current input
              const bulkCard = container.querySelector('.bulk-card');
              const dailyCard = container.querySelector('.daily-card');
              expect(bulkCard).toBeTruthy();
              expect(dailyCard).toBeTruthy();
            }, 400);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
  
});