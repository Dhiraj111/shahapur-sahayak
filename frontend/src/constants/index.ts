// Constants based on product.md specifications

import type { CrossingLocation } from '../types';

// Bulk items for D-Mart (15% cost savings)
export const BULK_ITEMS = [
  // Cooking essentials
  'oil', 'cooking oil', 'sunflower oil', 'groundnut oil', 'coconut oil',
  'sugar', 'jaggery', 'honey',
  'salt', 'rock salt', 'black salt',
  'flour', 'wheat flour', 'rice flour', 'besan',
  'rice', 'basmati rice', 'brown rice', 'quinoa',
  'dal', 'toor dal', 'moong dal', 'chana dal', 'masoor dal',
  'spices', 'turmeric', 'chili powder', 'coriander powder', 'garam masala',
  
  // Cleaning & household
  'detergent', 'detergents', 'washing powder', 'fabric softener',
  'dishwash', 'dishwashing liquid', 'floor cleaner', 'toilet cleaner',
  'soap', 'bathing soap', 'handwash', 'sanitizer',
  'shampoo', 'shampoos', 'conditioner', 'hair oil',
  'toothpaste', 'toothbrush', 'mouthwash',
  
  // Packaged foods
  'biscuit', 'biscuits', 'family pack', 'family pack biscuits',
  'cookies', 'crackers', 'namkeen', 'chips',
  'noodles', 'pasta', 'oats', 'cornflakes', 'cereal',
  'pickle', 'jam', 'sauce', 'ketchup',
  'tea', 'coffee', 'sugar free', 'protein powder',
  
  // Personal care bulk items
  'diapers', 'baby products', 'feminine hygiene',
  'tissues', 'toilet paper', 'napkins',
  'face wash', 'moisturizer', 'sunscreen',
  
  // Electronics & appliances (when on sale)
  'batteries', 'bulbs', 'extension cord',
  'phone charger', 'earphones',
  
  // Stationery bulk
  'notebooks', 'pens', 'pencils', 'erasers'
] as const;

// Daily items for Kirana (no queues, credit options)
export const DAILY_ITEMS = [
  // Fresh daily needs
  'milk', 'curd', 'buttermilk', 'paneer',
  'bread', 'pav', 'roti', 'chapati',
  'egg', 'eggs',
  
  // Fresh vegetables (small quantities)
  'onion', 'potato', 'tomato', 'ginger', 'garlic',
  'green chili', 'coriander', 'mint', 'curry leaves',
  'lemon', 'green vegetables',
  
  // Fresh fruits (small quantities)
  'banana', 'apple', 'orange', 'seasonal fruits',
  
  // Immediate needs
  'cigarette', 'cigarettes', 'tobacco', 'gutka',
  'matchbox', 'lighter', 'candle',
  'newspaper', 'magazine',
  
  // Small quantity items
  'loose rice', 'loose sugar', 'loose dal',
  'loose tea', 'loose spices',
  
  // Emergency items
  'medicine', 'bandage', 'pain relief',
  'cold drink', 'water bottle', 'ice cream',
  'chocolate', 'toffee', 'candy',
  
  // Quick snacks
  'samosa', 'vada pav', 'bhel puri', 'chaat',
  'biscuit packet', 'small chips', 'namkeen packet',
  
  // Small household items
  'soap bar', 'small detergent', 'small shampoo',
  'razor', 'blade', 'comb',
  'small notebook', 'pen', 'envelope', 'stamp'
] as const;

// Bulk item reasoning
export const BULK_REASONING = "Deep discounts (approx 15% saved) - better for bulk purchases";

// Daily item reasoning  
export const DAILY_REASONING = "No queues (saves 45 mins), instant service, credit options (Udhari) available";

// Danger zones on Mumbai-Nashik Highway
export const DANGER_ZONES: Record<string, CrossingLocation> = {
  'kinhavali-junction': {
    id: 'kinhavali-junction',
    name: 'Kinhavali Junction',
    isDangerZone: true,
    warning: 'High-speed trucks from flyover blindspot - NEVER cross here while walking',
    alternative: 'Use Subway 2 (add 4 mins walk)'
  },
  'petrol-pump-cut': {
    id: 'petrol-pump-cut', 
    name: 'Petrol Pump Cut',
    isDangerZone: true,
    warning: 'No traffic signal - high risk crossing',
    alternative: 'Wait for a clear gap of 200m before crossing'
  },
  'highway-bend': {
    id: 'highway-bend',
    name: 'Highway Bend (Near Temple)',
    isDangerZone: true,
    warning: 'Blind curve - vehicles cannot see pedestrians in time',
    alternative: 'Walk 300m to Subway 1 or use pedestrian bridge'
  },
  'truck-parking': {
    id: 'truck-parking',
    name: 'Truck Parking Area',
    isDangerZone: true,
    warning: 'Heavy vehicle movement - poor visibility due to parked trucks',
    alternative: 'Use designated crossing 200m ahead near bus stop'
  },
  'construction-zone': {
    id: 'construction-zone',
    name: 'Construction Zone',
    isDangerZone: true,
    warning: 'Ongoing road work - uneven surface and construction vehicles',
    alternative: 'Follow temporary pedestrian path or use alternate route'
  }
};

// Safe crossing locations
export const SAFE_LOCATIONS: Record<string, CrossingLocation> = {
  'subway-1': {
    id: 'subway-1',
    name: 'Subway 1 (Main)',
    isDangerZone: false
  },
  'subway-2': {
    id: 'subway-2',
    name: 'Subway 2 (Near Market)',
    isDangerZone: false
  },
  'food-court': {
    id: 'food-court', 
    name: 'Food Court Signal',
    isDangerZone: false
  },
  'bus-stop-signal': {
    id: 'bus-stop-signal',
    name: 'Bus Stop Traffic Signal',
    isDangerZone: false
  },
  'pedestrian-bridge': {
    id: 'pedestrian-bridge',
    name: 'Pedestrian Bridge (Near School)',
    isDangerZone: false
  },
  'railway-crossing': {
    id: 'railway-crossing',
    name: 'Railway Crossing Gate',
    isDangerZone: false
  }
};

// All crossing locations combined
export const ALL_CROSSING_LOCATIONS = {
  ...DANGER_ZONES,
  ...SAFE_LOCATIONS
};

// Store Information
export const STORE_INFO = {
  dmart: {
    name: 'D-Mart Shahapur',
    timings: 'Mon-Sun: 8:00 AM - 10:00 PM',
    contact: '+91 98765 43210',
    address: 'Mumbai-Nashik Highway, Near Food Court, Shahapur',
    bestTime: 'Weekdays 2:00 PM - 5:00 PM (Less crowded)',
    avgWaitTime: '15-45 minutes during peak hours',
    peakHours: '7:00-10:00 AM, 6:00-9:00 PM',
    benefits: [
      '15% average savings on bulk items',
      'Wide variety of brands',
      'Quality assurance',
      'Fixed pricing (no bargaining needed)'
    ]
  },
  kirana: {
    name: 'Local Kirana Stores',
    timings: 'Mon-Sun: 6:00 AM - 11:00 PM',
    contact: 'Multiple stores available',
    address: 'Throughout Shahapur residential areas',
    bestTime: 'Anytime (No waiting)',
    avgWaitTime: '0-2 minutes',
    peakHours: 'None (Always quick service)',
    benefits: [
      'No waiting time',
      'Credit facility (Udhari)',
      'Home delivery available',
      'Personal relationship with shopkeeper',
      'Fresh items daily',
      'Supports local economy'
    ]
  }
};

// Safety Tips
export const SAFETY_TIPS = [
  'Always look both ways before crossing',
  'Use designated crossing points whenever possible',
  'Avoid crossing during heavy rain or fog',
  'Wear bright colors when crossing at dawn/dusk',
  'Never use mobile phone while crossing',
  'Make eye contact with drivers before crossing',
  'Cross in groups when possible, especially at night',
  'Follow traffic signals and wait for green light'
];