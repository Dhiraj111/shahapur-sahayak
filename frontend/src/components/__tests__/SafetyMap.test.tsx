import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SafetyMap from '../SafetyMap';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: any) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Circle: ({ children }: any) => (
    <div data-testid="circle">
      {children}
    </div>
  ),
  Polyline: ({ children }: any) => (
    <div data-testid="polyline">
      {children}
    </div>
  ),
  Marker: ({ children }: any) => (
    <div data-testid="marker">
      {children}
    </div>
  ),
  Popup: ({ children }: any) => (
    <div data-testid="popup">
      {children}
    </div>
  ),
}));

// Mock leaflet
jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
}));

describe('SafetyMap Component', () => {
  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks();
  });

  test('renders SafetyMap component', () => {
    render(<SafetyMap />);
    
    // Check if the main container is rendered
    expect(screen.getByText('🗺️ Shahapur Safety Map')).toBeInTheDocument();
  });

  test('displays map header and description', () => {
    render(<SafetyMap />);
    
    expect(screen.getByText('🗺️ Shahapur Safety Map')).toBeInTheDocument();
    expect(screen.getByText('Navigate safely through Shahapur with real-time danger zones and safe routes')).toBeInTheDocument();
  });

  test('renders map container', () => {
    render(<SafetyMap />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  test('displays legend with correct items', () => {
    render(<SafetyMap />);
    
    expect(screen.getByText('Danger Zones - High Risk Areas')).toBeInTheDocument();
    expect(screen.getByText('Safe Routes - Recommended Paths')).toBeInTheDocument();
    expect(screen.getByText('Points of Interest')).toBeInTheDocument();
  });

  test('displays info tip', () => {
    render(<SafetyMap />);
    
    expect(screen.getByText(/Click on markers and zones for detailed information/)).toBeInTheDocument();
  });

  test('renders danger zones', () => {
    render(<SafetyMap />);
    
    // Should render at least one circle for danger zones
    expect(screen.getByTestId('circle')).toBeInTheDocument();
  });

  test('renders safe routes', () => {
    render(<SafetyMap />);
    
    // Should render at least one polyline for safe routes
    expect(screen.getByTestId('polyline')).toBeInTheDocument();
  });

  test('renders landmarks', () => {
    render(<SafetyMap />);
    
    // Should render at least one marker for landmarks
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  test('has proper CSS classes', () => {
    render(<SafetyMap />);
    
    const container = screen.getByText('🗺️ Shahapur Safety Map').closest('.safety-map-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('safety-map-container');
  });
});