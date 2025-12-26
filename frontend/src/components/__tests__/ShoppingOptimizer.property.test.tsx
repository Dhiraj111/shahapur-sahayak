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
  // For any shopping list that produces results, the rendered output should contain exactly two distinct cards with titles "🛒 D-Mart (Bulk)" and "🏪 Kirana (Daily)"
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
          
          expect(bulkTitle?.textContent).toBe('🛒 D-Mart (Bulk)');
          expect(dailyTitle?.textContent).toBe('🏪 Kirana (Daily)');
          
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
          
          expect(bulkTitle?.textContent).toBe('🛒 D-Mart (Bulk)');
          expect(dailyTitle?.textContent).toBe('🏪 Kirana (Daily)');
          
          // Verify categorization is clear - items should appear in appropriate cards
          // Check that any items displayed are in the correct card based on their categorization
          const allItemChips = container.querySelectorAll('.item-chip');
          
          allItemChips.forEach(itemChip => {
            const isInBulkCard = bulkCard?.contains(itemChip) || false;
            const isInDailyCard = dailyCard?.contains(itemChip) || false;
            
            // Each item chip should be in exactly one card
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

  // Property 1: Card Structure Consistency
  // For any optimization result, the UI should always render exactly two distinct cards with consistent structure and styling
  // Validates: Requirements 1.1, 1.2
  test('Property 1: Card Structure Consistency', async () => {
    // **Feature: shopping-optimizer-ui-redesign, Property 1: Card Structure Consistency**
    
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 })
            .filter(s => s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
          { minLength: 1, maxLength: 8 }
        ),
        async (shoppingItems) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const inputText = shoppingItems.join(', ');
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          // Fill input and optimize
          fireEvent.change(textarea, { target: { value: inputText } });
          fireEvent.click(optimizeButton);
          
          // Wait for results to appear
          await waitFor(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
          }, { timeout: 2000 });
          
          // Requirement 1.1: Exactly two distinct cards with minimal, clean design
          const bulkCard = container.querySelector('.bulk-card');
          const dailyCard = container.querySelector('.daily-card');
          
          expect(bulkCard).toBeTruthy();
          expect(dailyCard).toBeTruthy();
          expect(bulkCard).not.toBe(dailyCard);
          
          // Verify cards are distinct (different CSS classes)
          expect(bulkCard?.classList.contains('bulk-card')).toBe(true);
          expect(dailyCard?.classList.contains('daily-card')).toBe(true);
          expect(bulkCard?.classList.contains('daily-card')).toBe(false);
          expect(dailyCard?.classList.contains('bulk-card')).toBe(false);
          
          // Requirement 1.2: Cards have subtle shadows, rounded corners, and clear visual separation
          // Check for consistent structure - both cards should have CardHeader
          const bulkCardHeader = bulkCard?.querySelector('.card-header');
          const dailyCardHeader = dailyCard?.querySelector('.card-header');
          
          expect(bulkCardHeader).toBeTruthy();
          expect(dailyCardHeader).toBeTruthy();
          
          // Verify CardHeader structure consistency
          const bulkTitle = bulkCardHeader?.querySelector('h3');
          const dailyTitle = dailyCardHeader?.querySelector('h3');
          const bulkIcon = bulkCardHeader?.querySelector('.card-header__icon');
          const dailyIcon = dailyCardHeader?.querySelector('.card-header__icon');
          const bulkBadge = bulkCardHeader?.querySelector('.card-header__badge');
          const dailyBadge = dailyCardHeader?.querySelector('.card-header__badge');
          
          expect(bulkTitle).toBeTruthy();
          expect(dailyTitle).toBeTruthy();
          expect(bulkIcon).toBeTruthy();
          expect(dailyIcon).toBeTruthy();
          expect(bulkBadge).toBeTruthy();
          expect(dailyBadge).toBeTruthy();
          
          // Verify consistent card structure - both should have content areas
          // Either items-list or empty-state should be present in each card
          const bulkContent = bulkCard?.querySelector('.items-list') || bulkCard?.querySelector('.empty-state');
          const dailyContent = dailyCard?.querySelector('.items-list') || dailyCard?.querySelector('.empty-state');
          
          expect(bulkContent).toBeTruthy();
          expect(dailyContent).toBeTruthy();
          
          // Requirement 1.4: Consistent color schemes - blue for D-Mart, green for Kirana
          expect(bulkCardHeader?.classList.contains('card-header--dmart')).toBe(true);
          expect(dailyCardHeader?.classList.contains('card-header--kirana')).toBe(true);
          
          // Verify badge color consistency
          expect(bulkBadge?.classList.contains('card-header__badge--dmart')).toBe(true);
          expect(dailyBadge?.classList.contains('card-header__badge--kirana')).toBe(true);
          
          // Verify both cards are within the results container for clear visual separation
          const resultsCards = container.querySelector('.results-cards');
          expect(resultsCards).toBeTruthy();
          expect(resultsCards?.contains(bulkCard!)).toBe(true);
          expect(resultsCards?.contains(dailyCard!)).toBe(true);
          
          // Verify consistent styling - both cards should have similar structure
          // Check that both cards have the expected CSS classes for styling
          const bulkCardClasses = Array.from(bulkCard?.classList || []);
          const dailyCardClasses = Array.from(dailyCard?.classList || []);
          
          // Both should have base styling (rounded corners, shadows implied by CSS)
          expect(bulkCardClasses.includes('bulk-card')).toBe(true);
          expect(dailyCardClasses.includes('daily-card')).toBe(true);
          
          // Verify cards are properly rendered in DOM (structural consistency)
          expect(bulkCard?.tagName).toBe('DIV');
          expect(dailyCard?.tagName).toBe('DIV');
          
          // Verify both cards have content structure (either items or empty state)
          const bulkHasItems = bulkCard?.querySelector('.items-list')?.children.length || 0;
          const bulkHasEmptyState = bulkCard?.querySelector('.empty-state') ? 1 : 0;
          const dailyHasItems = dailyCard?.querySelector('.items-list')?.children.length || 0;
          const dailyHasEmptyState = dailyCard?.querySelector('.empty-state') ? 1 : 0;
          
          // Each card should have either items OR empty state (but not both)
          expect(bulkHasItems > 0 || bulkHasEmptyState > 0).toBe(true);
          expect(dailyHasItems > 0 || dailyHasEmptyState > 0).toBe(true);
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  // Property 2: Visual Hierarchy Preservation
  // For any result display, the visual hierarchy should remain consistent with summary at top, cards in middle, and help text at bottom
  // Validates: Requirements 2.1, 2.4
  test('Property 2: Visual Hierarchy Preservation', async () => {
    // **Feature: shopping-optimizer-ui-redesign, Property 2: Visual Hierarchy Preservation**
    
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 })
            .filter(s => s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
          { minLength: 1, maxLength: 6 }
        ),
        async (shoppingItems) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const inputText = shoppingItems.join(', ');
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          // Fill input and optimize
          fireEvent.change(textarea, { target: { value: inputText } });
          fireEvent.click(optimizeButton);
          
          // Wait for results to appear
          await waitFor(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
          }, { timeout: 2000 });
          
          const resultsSection = container.querySelector('.results-section')!;
          
          // Requirement 2.1: Summary section should be at the top with total counts
          const summaryHeader = resultsSection.querySelector('.summary-header');
          expect(summaryHeader).toBeTruthy();
          
          // Summary should contain total counts
          const statNumbers = summaryHeader!.querySelectorAll('.stat-number');
          expect(statNumbers.length).toBe(2); // D-Mart and Kirana counts
          
          // Verify the numbers are actual counts (should be numeric)
          statNumbers.forEach(statNumber => {
            const count = parseInt(statNumber.textContent || '0');
            expect(count).toBeGreaterThanOrEqual(0);
          });
          
          // Verify labels are present
          const statLabels = summaryHeader!.querySelectorAll('.stat-label');
          expect(statLabels.length).toBe(2);
          expect(statLabels[0].textContent).toBe('for D-Mart');
          expect(statLabels[1].textContent).toBe('for Kirana');
          
          // Visual hierarchy: Summary should be at the top
          const resultsCards = resultsSection.querySelector('.results-cards');
          const resultsFooter = resultsSection.querySelector('.results-footer');
          
          expect(resultsCards).toBeTruthy();
          expect(resultsFooter).toBeTruthy();
          
          // Get positions to verify hierarchy (summary -> cards -> footer)
          const summaryRect = summaryHeader!.getBoundingClientRect();
          const cardsRect = resultsCards!.getBoundingClientRect();
          const footerRect = resultsFooter!.getBoundingClientRect();
          
          // Summary should be above cards
          expect(summaryRect.bottom).toBeLessThanOrEqual(cardsRect.top);
          
          // Cards should be above footer
          expect(cardsRect.bottom).toBeLessThanOrEqual(footerRect.top);
          
          // Requirement 2.4: Consistent spacing between elements
          // Check that there's consistent spacing structure
          const summaryStats = summaryHeader!.querySelector('.summary-stats');
          expect(summaryStats).toBeTruthy();
          
          // Verify divider exists between stats for consistent spacing
          const statDivider = summaryStats!.querySelector('.stat-divider');
          expect(statDivider).toBeTruthy();
          
          // Verify both stat items exist with consistent structure
          const statItems = summaryStats!.querySelectorAll('.stat-item');
          expect(statItems.length).toBe(2);
          
          // Each stat item should have consistent structure (number + label)
          statItems.forEach(statItem => {
            const statNumber = statItem.querySelector('.stat-number');
            const statLabel = statItem.querySelector('.stat-label');
            expect(statNumber).toBeTruthy();
            expect(statLabel).toBeTruthy();
          });
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  // Property 4: Item Display Completeness
  // For any shopping list input, all items should be displayed exactly once across the two cards with no duplicates or omissions
  // Validates: Requirements 4.2, 4.4
  test('Property 4: Item Display Completeness', async () => {
    // **Feature: shopping-optimizer-ui-redesign, Property 4: Item Display Completeness**
    
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.string({ minLength: 1, maxLength: 25 })
            .filter(s => s.trim().length > 0 && /[a-zA-Z]/.test(s.trim()) && !s.includes(',') && !s.includes('\n')),
          { minLength: 1, maxLength: 10 }
        ),
        async (shoppingItems) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const inputText = shoppingItems.join(', ');
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          // Fill input and optimize
          fireEvent.change(textarea, { target: { value: inputText } });
          fireEvent.click(optimizeButton);
          
          // Wait for results to appear
          await waitFor(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
          }, { timeout: 2000 });
          
          // Get all displayed item chips
          const allItemChips = container.querySelectorAll('.item-chip');
          const displayedItemNames = Array.from(allItemChips).map(chip => chip.textContent?.trim() || '');
          
          // Requirement 4.2: All items should be displayed exactly once with no duplicates or omissions
          expect(displayedItemNames.length).toBe(shoppingItems.length);
          
          // Check that every input item is displayed exactly once
          const trimmedInputItems = shoppingItems.map(item => item.trim());
          trimmedInputItems.forEach(inputItem => {
            const occurrences = displayedItemNames.filter(displayedItem => displayedItem === inputItem).length;
            expect(occurrences).toBe(1); // Each item should appear exactly once
          });
          
          // Check that no extra items are displayed
          displayedItemNames.forEach(displayedItem => {
            expect(trimmedInputItems).toContain(displayedItem);
          });
          
          // Requirement 4.4: Items should be grouped logically within each card
          const bulkCard = container.querySelector('.bulk-card');
          const dailyCard = container.querySelector('.daily-card');
          
          expect(bulkCard).toBeTruthy();
          expect(dailyCard).toBeTruthy();
          
          // Get items from each card
          const bulkItemChips = bulkCard!.querySelectorAll('.item-chip');
          const dailyItemChips = dailyCard!.querySelectorAll('.item-chip');
          
          const bulkItemNames = Array.from(bulkItemChips).map(chip => chip.textContent?.trim() || '');
          const dailyItemNames = Array.from(dailyItemChips).map(chip => chip.textContent?.trim() || '');
          
          // Verify no overlap between cards (logical grouping)
          bulkItemNames.forEach(bulkItem => {
            expect(dailyItemNames).not.toContain(bulkItem);
          });
          
          dailyItemNames.forEach(dailyItem => {
            expect(bulkItemNames).not.toContain(dailyItem);
          });
          
          // Verify total items across both cards equals input items
          expect(bulkItemNames.length + dailyItemNames.length).toBe(shoppingItems.length);
          
          // Verify each item appears in exactly one card
          const allCardItems = [...bulkItemNames, ...dailyItemNames];
          expect(allCardItems.length).toBe(displayedItemNames.length);
          
          // Verify items are displayed with essential information only (item name)
          // Requirement 4.2: Item chips should show only essential information (item name)
          allItemChips.forEach((chip) => {
            const chipText = chip.textContent?.trim() || '';
            const originalItem = trimmedInputItems.find(item => item === chipText);
            expect(originalItem).toBeTruthy();
            
            // Verify chip contains only the item name (no extra information)
            expect(chipText).toBe(originalItem);
            
            // Verify chip has proper structure for display
            expect(chip.classList.contains('item-chip')).toBe(true);
          });
          
          // Verify logical grouping: items in bulk card should be bulk category, daily card should be daily category
          // This validates that the categorization logic is working correctly for display
          const { optimizeShoppingList } = await import('../../utils/shopping');
          const optimizationResult = optimizeShoppingList(inputText);
          
          // Verify bulk items are displayed in bulk card
          const expectedBulkItemNames = optimizationResult.bulkItems.map(item => item.name);
          expectedBulkItemNames.forEach(expectedBulkItem => {
            expect(bulkItemNames).toContain(expectedBulkItem);
          });
          
          // Verify daily items are displayed in daily card
          const expectedDailyItemNames = optimizationResult.dailyItems.map(item => item.name);
          expectedDailyItemNames.forEach(expectedDailyItem => {
            expect(dailyItemNames).toContain(expectedDailyItem);
          });
          
          // Verify counts match between optimization result and display
          expect(bulkItemNames.length).toBe(optimizationResult.bulkItems.length);
          expect(dailyItemNames.length).toBe(optimizationResult.dailyItems.length);
        }
      ),
      { numRuns: 50 }
    );
  }, 45000);

  // Property 7: Empty State Handling
  // For any optimization result where a store category has zero items, the appropriate empty state should be displayed with correct messaging
  // Validates: Requirements 1.5, 4.3
  test('Property 7: Empty State Handling', async () => {
    // **Feature: shopping-optimizer-ui-redesign, Property 7: Empty State Handling**
    
    await fc.assert(
      fc.asyncProperty(
        // Generate inputs that will likely result in empty states for one or both categories
        fc.oneof(
          // Items that typically go to bulk only (should result in empty daily state)
          fc.array(
            fc.constantFrom('oil 5L', 'sugar 5kg', 'detergent', 'shampoo', 'family pack biscuits'),
            { minLength: 1, maxLength: 3 }
          ),
          // Items that typically go to daily only (should result in empty bulk state)
          fc.array(
            fc.constantFrom('milk', 'bread', 'eggs', 'cigarettes'),
            { minLength: 1, maxLength: 3 }
          ),
          // Mixed items that might result in one empty category
          fc.array(
            fc.oneof(
              fc.constantFrom('oil 5L', 'sugar 5kg', 'detergent'),
              fc.constantFrom('milk', 'bread', 'eggs')
            ),
            { minLength: 1, maxLength: 2 }
          ),
          // Edge case: items that might all go to one category
          fc.array(
            fc.string({ minLength: 1, maxLength: 15 })
              .filter(s => s.trim().length > 0 && /[a-zA-Z]/.test(s.trim())),
            { minLength: 1, maxLength: 4 }
          )
        ),
        async (shoppingItems) => {
          cleanup();
          const { container } = render(<ShoppingOptimizer />);
          
          const inputText = shoppingItems.join(', ');
          const textarea = container.querySelector('.shopping-input') as HTMLTextAreaElement;
          const optimizeButton = container.querySelector('.optimize-button') as HTMLButtonElement;
          
          expect(textarea).toBeTruthy();
          expect(optimizeButton).toBeTruthy();
          
          // Fill input and optimize
          fireEvent.change(textarea, { target: { value: inputText } });
          fireEvent.click(optimizeButton);
          
          // Wait for results to appear
          await waitFor(() => {
            const resultsSection = container.querySelector('.results-section');
            expect(resultsSection).toBeTruthy();
          }, { timeout: 2000 });
          
          const bulkCard = container.querySelector('.bulk-card');
          const dailyCard = container.querySelector('.daily-card');
          
          expect(bulkCard).toBeTruthy();
          expect(dailyCard).toBeTruthy();
          
          // Check if bulk card has items or empty state
          const bulkItemsList = bulkCard!.querySelector('.items-list');
          const bulkEmptyState = bulkCard!.querySelector('.empty-state');
          
          // Requirement 1.5: When cards are empty, display friendly empty state with appropriate messaging
          if (!bulkItemsList || bulkItemsList.children.length === 0) {
            // Should show empty state for bulk card
            expect(bulkEmptyState).toBeTruthy();
            expect(bulkEmptyState!.classList.contains('empty-state--dmart')).toBe(true);
            
            // Verify correct messaging for D-Mart empty state
            const bulkIcon = bulkEmptyState!.querySelector('.empty-state__icon');
            const bulkTitle = bulkEmptyState!.querySelector('.empty-state__title');
            const bulkMessage = bulkEmptyState!.querySelector('.empty-state__message');
            const bulkSubtitle = bulkEmptyState!.querySelector('.empty-state__subtitle');
            
            expect(bulkIcon).toBeTruthy();
            expect(bulkIcon!.textContent).toBe('📦');
            expect(bulkTitle).toBeTruthy();
            expect(bulkTitle!.textContent).toBe('No bulk items found');
            expect(bulkMessage).toBeTruthy();
            expect(bulkMessage!.textContent).toBe('Items that are better bought in bulk will appear here');
            expect(bulkSubtitle).toBeTruthy();
            expect(bulkSubtitle!.textContent).toBe('Try adding items like rice, oil, or household supplies');
          } else {
            // Should not show empty state when items are present
            expect(bulkEmptyState).toBeFalsy();
            expect(bulkItemsList.children.length).toBeGreaterThan(0);
          }
          
          // Check if daily card has items or empty state
          const dailyItemsList = dailyCard!.querySelector('.items-list');
          const dailyEmptyState = dailyCard!.querySelector('.empty-state');
          
          if (!dailyItemsList || dailyItemsList.children.length === 0) {
            // Should show empty state for daily card
            expect(dailyEmptyState).toBeTruthy();
            expect(dailyEmptyState!.classList.contains('empty-state--kirana')).toBe(true);
            
            // Verify correct messaging for Kirana empty state
            const dailyIcon = dailyEmptyState!.querySelector('.empty-state__icon');
            const dailyTitle = dailyEmptyState!.querySelector('.empty-state__title');
            const dailyMessage = dailyEmptyState!.querySelector('.empty-state__message');
            const dailySubtitle = dailyEmptyState!.querySelector('.empty-state__subtitle');
            
            expect(dailyIcon).toBeTruthy();
            expect(dailyIcon!.textContent).toBe('🏪');
            expect(dailyTitle).toBeTruthy();
            expect(dailyTitle!.textContent).toBe('No daily items found');
            expect(dailyMessage).toBeTruthy();
            expect(dailyMessage!.textContent).toBe('Fresh and quick-access items will appear here');
            expect(dailySubtitle).toBeTruthy();
            expect(dailySubtitle!.textContent).toBe('Try adding items like milk, bread, or vegetables');
          } else {
            // Should not show empty state when items are present
            expect(dailyEmptyState).toBeFalsy();
            expect(dailyItemsList.children.length).toBeGreaterThan(0);
          }
          
          // Requirement 4.3: Empty states should be displayed with appropriate messaging
          // Verify that each card shows either items OR empty state, but not both
          const bulkHasItems = bulkItemsList && bulkItemsList.children.length > 0;
          const bulkHasEmptyState = bulkEmptyState !== null;
          const dailyHasItems = dailyItemsList && dailyItemsList.children.length > 0;
          const dailyHasEmptyState = dailyEmptyState !== null;
          
          // Each card should have exactly one content type (items XOR empty state)
          expect(bulkHasItems !== bulkHasEmptyState).toBe(true);
          expect(dailyHasItems !== dailyHasEmptyState).toBe(true);
          
          // Verify empty states have proper structure and styling
          if (bulkEmptyState) {
            expect(bulkEmptyState.classList.contains('empty-state')).toBe(true);
            expect(bulkEmptyState.querySelector('.empty-state__content')).toBeTruthy();
          }
          
          if (dailyEmptyState) {
            expect(dailyEmptyState.classList.contains('empty-state')).toBe(true);
            expect(dailyEmptyState.querySelector('.empty-state__content')).toBeTruthy();
          }
          
          // Verify that empty states are contextually appropriate
          // Get the actual optimization result to verify empty states match the categorization
          const { optimizeShoppingList } = await import('../../utils/shopping');
          const optimizationResult = optimizeShoppingList(inputText);
          
          // Empty states should match the actual categorization results
          if (optimizationResult.bulkItems.length === 0) {
            expect(bulkEmptyState).toBeTruthy();
          } else {
            expect(bulkEmptyState).toBeFalsy();
          }
          
          if (optimizationResult.dailyItems.length === 0) {
            expect(dailyEmptyState).toBeTruthy();
          } else {
            expect(dailyEmptyState).toBeFalsy();
          }
        }
      ),
      { numRuns: 50 }
    );
  }, 45000);
  
});