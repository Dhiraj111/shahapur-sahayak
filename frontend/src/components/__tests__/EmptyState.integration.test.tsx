import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingOptimizer from '../ShoppingOptimizer';

// Mock the shopping utility to return empty results
jest.mock('../../utils/shopping', () => ({
  optimizeShoppingList: jest.fn(() => ({
    bulkItems: [],
    dailyItems: [],
    totalItems: 0,
    optimizationScore: 0
  }))
}));

describe('EmptyState Integration', () => {
  test('shows empty states when no items are categorized', async () => {
    render(<ShoppingOptimizer />);
    
    // Enter some input and optimize
    const textarea = screen.getByPlaceholderText(/Enter your shopping list/);
    const optimizeButton = screen.getByText('Optimize Shopping List');
    
    fireEvent.change(textarea, { target: { value: 'test item' } });
    fireEvent.click(optimizeButton);
    
    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('No bulk items found')).toBeInTheDocument();
      expect(screen.getByText('No daily items found')).toBeInTheDocument();
    });
    
    // Verify both empty states are shown with correct messaging
    expect(screen.getByText('Items that are better bought in bulk will appear here')).toBeInTheDocument();
    expect(screen.getByText('Fresh and quick-access items will appear here')).toBeInTheDocument();
    expect(screen.getByText('Try adding items like rice, oil, or household supplies')).toBeInTheDocument();
    expect(screen.getByText('Try adding items like milk, bread, or vegetables')).toBeInTheDocument();
  });
});