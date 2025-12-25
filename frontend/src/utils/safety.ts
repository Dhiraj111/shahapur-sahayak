// Safety routing business logic

import type { CrossingLocation, SafetyResult } from '../types';
import { ALL_CROSSING_LOCATIONS } from '../constants';

export function evaluateCrossingLocation(locationId: string): SafetyResult {
  // Get the location from all crossing locations
  const location = ALL_CROSSING_LOCATIONS[locationId];
  
  // If location not found, return a safe default
  if (!location) {
    const unknownLocation: CrossingLocation = {
      id: locationId,
      name: 'Unknown Location',
      isDangerZone: false
    };
    
    return {
      location: unknownLocation,
      isWarning: false,
      message: 'Location not recognized. Please select a known crossing point for safety guidance.'
    };
  }
  
  // Check if this is a danger zone
  if (location.isDangerZone) {
    let message = `⚠️ DANGER ZONE: ${location.warning}`;
    
    if (location.alternative) {
      message += ` Alternative: ${location.alternative}`;
    }
    
    return {
      location,
      isWarning: true,
      message
    };
  }
  
  // Safe location
  return {
    location,
    isWarning: false,
    message: `✅ Safe crossing point. You can cross safely at ${location.name}.`
  };
}