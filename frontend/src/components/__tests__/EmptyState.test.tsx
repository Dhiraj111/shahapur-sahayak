import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyState from '../EmptyState';

describe('EmptyState Component', () => {
  test('renders D-Mart empty state correctly', () => {
    render(<EmptyState storeType="dmart" />);
    
    expect(screen.getByText('📦')).toBeInTheDocument();
    expect(screen.getByText('No bulk items found')).toBeInTheDocument();
    expect(screen.getByText('Items that are better bought in bulk will appear here')).toBeInTheDocument();
    expect(screen.getByText('Try adding items like rice, oil, or household supplies')).toBeInTheDocument();
  });

  test('renders Kirana empty state correctly', () => {
    render(<EmptyState storeType="kirana" />);
    
    expect(screen.getByText('🏪')).toBeInTheDocument();
    expect(screen.getByText('No daily items found')).toBeInTheDocument();
    expect(screen.getByText('Fresh and quick-access items will appear here')).toBeInTheDocument();
    expect(screen.getByText('Try adding items like milk, bread, or vegetables')).toBeInTheDocument();
  });

  test('applies correct CSS classes for store types', () => {
    const { rerender } = render(<EmptyState storeType="dmart" />);
    
    let emptyStateElement = screen.getByText('No bulk items found').closest('.empty-state');
    expect(emptyStateElement).toHaveClass('empty-state--dmart');
    
    rerender(<EmptyState storeType="kirana" />);
    
    emptyStateElement = screen.getByText('No daily items found').closest('.empty-state');
    expect(emptyStateElement).toHaveClass('empty-state--kirana');
  });
});