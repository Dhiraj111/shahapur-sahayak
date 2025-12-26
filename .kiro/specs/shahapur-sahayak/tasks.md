# Implementation Plan: Shahapur Sahayak

## Overview

This implementation plan converts the Shahapur Sahayak design into discrete coding tasks for a React TypeScript application. The approach focuses on building the two core tools (Shopping Optimizer and Safety Router) with proper business logic separation, comprehensive testing, and mobile-responsive UI.

## Tasks

- [x] 1. Set up project structure and core types
  - Define TypeScript interfaces for ShoppingItem, OptimizationResult, CrossingLocation, and SafetyResult
  - Create constants for bulk items, daily items, and danger zones based on product.md specifications
  - Set up testing framework (Jest) for unit and property-based tests with fast-check library
  - _Requirements: 1.1, 2.1, 4.1_

- [x] 1.1 Write property test for core data structures
  - **Property 1: Shopping Item Categorization Completeness**
  - **Validates: Requirements 1.1**

- [x] 2. Implement shopping optimization business logic
  - [x] 2.1 Create categorizeShoppingItem function
    - Implement logic to categorize individual items as bulk or daily based on product.md rules
    - Include reasoning for each categorization (cost savings vs convenience)
    - _Requirements: 1.2, 1.3, 1.5_

  - [x] 2.2 Write property tests for item categorization
    - **Property 2: Bulk Item Classification Consistency**
    - **Property 3: Daily Item Classification Consistency**
    - **Property 5: Categorization Reasoning Completeness**
    - **Validates: Requirements 1.2, 1.3, 1.5**

  - [x] 2.3 Create optimizeShoppingList function
    - Parse multi-item text input into individual items
    - Apply categorization to each item
    - Return organized results with bulk and daily item arrays
    - _Requirements: 1.1, 4.1_

  - [x] 2.4 Write property test for shopping list processing
    - **Property 12: Multi-Item Input Processing**
    - **Validates: Requirements 4.1**

- [x] 3. Implement safety routing business logic
  - [x] 3.1 Create evaluateCrossingLocation function
    - Check if location matches danger zone definitions
    - Return appropriate safety result with warnings or confirmations
    - Include specific risk explanations for danger zones
    - _Requirements: 2.1, 2.5_

  - [x] 3.2 Write property tests for safety evaluation
    - **Property 6: Location Safety Evaluation Completeness**
    - **Property 8: Danger Zone Risk Information**
    - **Validates: Requirements 2.1, 2.5**

  - [x] 3.3 Write unit tests for specific danger zones
    - Test Kinhavali Junction warning and Subway 2 alternative
    - Test Petrol Pump Cut warning and 200m gap advice
    - _Requirements: 2.2, 2.3_

- [x] 4. Create ShoppingOptimizer React component
  - [x] 4.1 Build shopping input interface
    - Create text area for shopping list input
    - Implement input change handling and state management
    - Add optimize button to trigger categorization
    - _Requirements: 4.1, 4.5_

  - [x] 4.2 Build shopping results display
    - Create two distinct cards for D-Mart (bulk) and Kirana (daily) items
    - Display categorized items with reasoning in each card
    - Implement proper styling with clear visual separation
    - _Requirements: 1.4, 3.4_

  - [x] 4.3 Write property tests for shopping UI
    - **Property 4: Shopping Results Card Structure**
    - **Property 11: Shopping Results UI Structure**
    - **Validates: Requirements 1.4, 3.4**

- [x] 5. Create SafetyRouter React component
  - [x] 5.1 Build location selection interface
    - Create dropdown with crossing location options
    - Include all danger zones and safe locations
    - Implement selection change handling
    - _Requirements: 4.2_

  - [x] 5.2 Build safety warning display
    - Create conditional rendering for danger zone warnings (red cards)
    - Create safe location confirmations (green theme)
    - Display specific risk explanations and alternatives
    - _Requirements: 2.4, 3.1, 3.3_

  - [x] 5.3 Write property tests for safety UI
    - **Property 7: Safe Location Theme Consistency**
    - **Property 9: Visual Theme Consistency**
    - **Property 10: Danger Zone Warning Styling**
    - **Validates: Requirements 2.4, 3.1, 3.3**

- [x] 6. Implement responsive styling and themes
  - [x] 6.1 Create CSS theme system
    - Define safe green and alert red color schemes
    - Create reusable CSS classes for consistent theming
    - Ensure good contrast and readability
    - _Requirements: 3.1, 3.5_

  - [x] 6.2 Implement mobile-responsive layout
    - Create responsive grid/flexbox layout for mobile-first design
    - Ensure components work on various screen sizes
    - Test and adjust breakpoints for optimal mobile experience
    - _Requirements: 3.2_

- [x] 7. Integrate components into main App.tsx
  - [x] 7.1 Update App.tsx with new components
    - Replace default Vite content with Shahapur Sahayak app
    - Add proper app title and branding
    - Implement clean layout with both tools
    - _Requirements: 3.5_

  - [x] 7.2 Add error handling and input validation
    - Implement graceful handling of empty or invalid inputs
    - Add user feedback for processing states
    - Ensure system responsiveness for all user interactions
    - _Requirements: 4.3, 4.4_

  - [x] 7.3 Write property tests for error handling
    - **Property 13: System Responsiveness**
    - **Property 14: Invalid Input Handling**
    - **Property 15: Input Modification Handling**
    - **Validates: Requirements 4.3, 4.4, 4.5**

- [x] 8. Final integration and testing
  - [x] 8.1 Ensure all components work together
    - Test complete user workflows for both tools
    - Verify proper state management and component interaction
    - Validate that all business logic integrates correctly with UI
    - _Requirements: All requirements_

  - [x] 8.2 Run comprehensive test suite
    - Execute all unit tests and property-based tests
    - Verify test coverage meets requirements
    - Fix any failing tests and ensure all properties pass
    - _Requirements: All requirements_

- [x] 9. Checkpoint - Ensure all tests pass and app is functional
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks are comprehensive and include full testing coverage
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- The implementation follows mobile-first responsive design principles
- All business logic is separated from UI components for better testability