# Design Document: Shahapur Sahayak

## Overview

The Shahapur Sahayak app is a React TypeScript application that provides two core tools for Shahapur residents: a Shopping Optimizer and a Safety Router. The app uses a component-based architecture with clear separation between business logic and UI presentation. The design emphasizes mobile-first responsive design with distinct visual themes for safety (green) and danger (red) states.

## Architecture

The application follows a single-page application (SPA) architecture built with React and TypeScript:

```
App.tsx (Main Container)
├── ShoppingOptimizer Component
│   ├── ShoppingInput (text area)
│   ├── OptimizationLogic (categorization)
│   └── ResultsDisplay (two cards)
└── SafetyRouter Component
    ├── LocationSelector (dropdown)
    ├── SafetyEvaluator (danger zone logic)
    └── WarningDisplay (conditional alerts)
```

The app uses React hooks for state management and implements responsive CSS for mobile compatibility.

## Components and Interfaces

### Core Components

**App Component**
- Main container component
- Manages global state if needed
- Renders both tools in a clean layout

**ShoppingOptimizer Component**
```typescript
interface ShoppingOptimizerProps {
  // No props needed - self-contained
}

interface ShoppingItem {
  name: string;
  category: 'bulk' | 'daily';
  reason: string;
}

interface OptimizationResult {
  bulkItems: ShoppingItem[];
  dailyItems: ShoppingItem[];
}
```

**SafetyRouter Component**
```typescript
interface SafetyRouterProps {
  // No props needed - self-contained
}

interface CrossingLocation {
  id: string;
  name: string;
  isDangerZone: boolean;
  warning?: string;
  alternative?: string;
}

interface SafetyResult {
  location: CrossingLocation;
  isWarning: boolean;
  message: string;
}
```

### Business Logic Interfaces

**Shopping Categorization Logic**
```typescript
function categorizeShoppingItem(item: string): ShoppingItem {
  // Implements the logic from product.md
  // Returns categorized item with reasoning
}

function optimizeShoppingList(inputText: string): OptimizationResult {
  // Parses input text into items
  // Categorizes each item
  // Returns organized results
}
```

**Safety Evaluation Logic**
```typescript
function evaluateCrossingLocation(locationId: string): SafetyResult {
  // Checks if location is a danger zone
  // Returns appropriate warning or confirmation
}
```

## Data Models

### Shopping Data Model

The shopping categorization is based on predefined rules from the product specification:

**Bulk Items (D-Mart)**
- Oil (>2L)
- Sugar (>2kg) 
- Detergents
- Shampoos
- Biscuits (Family Pack)
- Reasoning: 15% cost savings, bulk discounts

**Daily Items (Kirana)**
- Milk
- Bread
- Eggs
- Cigarettes
- Loose Rice (<2kg)
- Reasoning: No queues (45min saved), credit options (Udhari)

### Safety Data Model

**Danger Zones**
```typescript
const DANGER_ZONES = {
  'kinhavali-junction': {
    name: 'Kinhavali Junction',
    risk: 'High-speed trucks from flyover blindspot',
    alternative: 'Use Subway 2 (add 4 mins walk)'
  },
  'petrol-pump-cut': {
    name: 'Petrol Pump Cut',
    risk: 'No traffic signal',
    warning: 'Wait for a clear gap of 200m before crossing'
  }
};
```

**Safe Locations**
- Food Court
- Subway crossings
- Other designated safe crossing points

## Error Handling

### Input Validation
- Empty shopping list: Display helpful message to enter items
- Invalid location selection: Default to safe state
- Malformed input: Graceful parsing with error recovery

### Error States
- Network issues: Not applicable (client-side only)
- Invalid data: Fallback to safe defaults
- Component errors: Error boundaries to prevent app crashes

### User Feedback
- Loading states during processing
- Clear error messages with actionable guidance
- Success confirmations for completed actions

## Testing Strategy

The testing approach combines unit tests for business logic and property-based tests for correctness validation:

### Unit Testing
- Test shopping categorization logic with specific examples
- Test safety evaluation with known danger zones
- Test component rendering with various input states
- Test responsive design breakpoints
- Test error handling scenarios

### Property-Based Testing
Property-based testing will validate universal properties using a JavaScript PBT library like fast-check. Each test will run a minimum of 100 iterations to ensure comprehensive coverage.

**Testing Configuration:**
- Library: fast-check (JavaScript property-based testing)
- Minimum iterations: 100 per property test
- Tag format: **Feature: shahapur-sahayak, Property {number}: {property_text}**

**Test Categories:**
- **Unit tests**: Specific examples, edge cases, error conditions
- **Property tests**: Universal properties across all inputs
- **Integration tests**: Component interaction and data flow
- **Responsive tests**: Mobile compatibility across screen sizes

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Shopping Item Categorization Completeness
*For any* shopping list input, every item should be categorized as either bulk or daily purchase with no items left uncategorized
**Validates: Requirements 1.1**

### Property 2: Bulk Item Classification Consistency  
*For any* item from the bulk category list (oil >2L, sugar >2kg, detergents, shampoos, family pack biscuits), the Shopping_Optimizer should categorize it as bulk purchase for D-Mart
**Validates: Requirements 1.2**

### Property 3: Daily Item Classification Consistency
*For any* item from the daily category list (milk, bread, eggs, cigarettes, loose rice <2kg), the Shopping_Optimizer should categorize it as daily purchase for Kirana
**Validates: Requirements 1.3**

### Property 4: Shopping Results Card Structure
*For any* shopping list that produces results, the rendered output should contain exactly two distinct cards with titles "Go to D-Mart (Bulk)" and "Support Local Kirana (Daily)"
**Validates: Requirements 1.4**

### Property 5: Categorization Reasoning Completeness
*For any* categorized shopping item, the item should include a non-empty reasoning explanation based on cost savings or convenience factors
**Validates: Requirements 1.5**

### Property 6: Location Safety Evaluation Completeness
*For any* crossing location selection, the Safety_Router should evaluate and classify the location as either safe or dangerous
**Validates: Requirements 2.1**

### Property 7: Safe Location Theme Consistency
*For any* safe crossing location selection, the display should use safe green theme styling
**Validates: Requirements 2.4**

### Property 8: Danger Zone Risk Information
*For any* danger zone location, the system should provide a specific, non-empty risk explanation
**Validates: Requirements 2.5**

### Property 9: Visual Theme Consistency
*For any* system state, safe actions should use green theme styling and warning states should use red theme styling
**Validates: Requirements 3.1**

### Property 10: Danger Zone Warning Styling
*For any* danger zone warning display, the UI should render red warning card styling
**Validates: Requirements 3.3**

### Property 11: Shopping Results UI Structure
*For any* shopping optimization results, the display should show exactly two distinct cards with clear categorization
**Validates: Requirements 3.4**

### Property 12: Multi-Item Input Processing
*For any* text input containing multiple shopping items, the Shopping_Optimizer should successfully parse and process all items
**Validates: Requirements 4.1**

### Property 13: System Responsiveness
*For any* valid user input, the system should provide immediate feedback and results without delay
**Validates: Requirements 4.3**

### Property 14: Invalid Input Handling
*For any* empty or malformed input, the system should handle it gracefully without crashing and provide appropriate user feedback
**Validates: Requirements 4.4**

### Property 15: Input Modification Handling
*For any* sequence of input modifications, the system should re-process and provide updated results for each change
**Validates: Requirements 4.5**