# Requirements Document

## Introduction

The Shahapur Sahayak app is a safety and economy guide designed to help residents of Shahapur navigate local shopping decisions and highway safety concerns. The app provides two main tools: a Shopping Optimizer that categorizes items for optimal purchasing locations, and a Safety Router that warns users about dangerous crossing points on the Mumbai-Nashik Highway.

## Glossary

- **Shopping_Optimizer**: Tool that categorizes shopping items into bulk vs daily purchase recommendations
- **Safety_Router**: Tool that provides safety warnings for highway crossing locations
- **D_Mart**: Large retail store offering bulk discounts but with longer queues
- **Kirana**: Local neighborhood store offering convenience and credit options
- **Danger_Zone**: Highway crossing points with high accident risk
- **Bulk_Items**: Products better purchased in large quantities from D-Mart
- **Daily_Items**: Products better purchased from local Kirana stores

## Requirements

### Requirement 1: Shopping List Optimization

**User Story:** As a Shahapur resident, I want to optimize my shopping list by location, so that I can save money on bulk items while supporting local businesses for daily needs.

#### Acceptance Criteria

1. WHEN a user enters a shopping list, THE Shopping_Optimizer SHALL categorize each item as either bulk or daily purchase
2. WHEN an item is oil (>2L), sugar (>2kg), detergents, shampoos, or family pack biscuits, THE Shopping_Optimizer SHALL categorize it as bulk purchase for D-Mart
3. WHEN an item is milk, bread, eggs, cigarettes, or loose rice (<2kg), THE Shopping_Optimizer SHALL categorize it as daily purchase for Kirana
4. WHEN categorization is complete, THE Shopping_Optimizer SHALL display results in two distinct cards: "Go to D-Mart (Bulk)" and "Support Local Kirana (Daily)"
5. THE Shopping_Optimizer SHALL provide reasoning for each categorization based on cost savings or convenience factors

### Requirement 2: Safety Route Guidance

**User Story:** As a pedestrian crossing the Mumbai-Nashik Highway, I want to receive safety warnings about dangerous crossing points, so that I can avoid accidents.

#### Acceptance Criteria

1. WHEN a user selects a crossing location, THE Safety_Router SHALL evaluate if the location is a designated danger zone
2. WHEN a user selects "Kinhavali Junction", THE Safety_Router SHALL display a red warning about high-speed trucks from flyover blindspot and suggest using "Subway 2" instead
3. WHEN a user selects "Petrol Pump Cut", THE Safety_Router SHALL display a red warning about no traffic signal and advise waiting for 200m clear gap
4. WHEN a user selects a safe crossing location, THE Safety_Router SHALL display confirmation in safe green theme
5. THE Safety_Router SHALL provide specific risk explanations for each danger zone

### Requirement 3: User Interface Design

**User Story:** As a mobile user, I want a clean and responsive interface with clear visual indicators, so that I can quickly understand safety warnings and shopping recommendations.

#### Acceptance Criteria

1. THE User_Interface SHALL use a safe green theme for safe actions and alert red for warnings
2. THE User_Interface SHALL be mobile-responsive and work on various screen sizes
3. WHEN displaying danger zone warnings, THE User_Interface SHALL use highly visible red warning cards
4. WHEN displaying shopping recommendations, THE User_Interface SHALL show results in two distinct cards with clear categorization
5. THE User_Interface SHALL use modern, clean styling with good contrast and readability

### Requirement 4: Input Handling

**User Story:** As a user, I want to easily input my shopping list and select crossing locations, so that I can get quick recommendations.

#### Acceptance Criteria

1. THE Shopping_Optimizer SHALL accept text input for shopping lists with multiple items
2. THE Safety_Router SHALL provide a dropdown selection for crossing locations
3. WHEN user input is processed, THE System SHALL provide immediate feedback and results
4. THE System SHALL handle empty or invalid inputs gracefully
5. THE System SHALL allow users to modify their inputs and get updated results