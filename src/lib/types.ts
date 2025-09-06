export interface LocationData {
  city: string;
  state: string;
  country: string;
  formatted: string;
}

export interface BirthData {
  dateOfBirth: Date;
  timeOfBirth: string;
  birthPlace: LocationData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  user: string;
  title: string;
  messages: ChatMessage[];
  context: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  birth_details: {
    date: string;
    time: string;
    place: LocationData;
  };
  created_at: string;
}

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type RefreshResponse = {
  access_token: string;
  token_type: string;
};

export type BirthChartData = {
  date: string; // datetime
  time: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type Planets = {
  [key: string]: {
    sign: string;
    degree: number;
    house: number;
    is_retrograde: boolean;
  };
};

export type Houses = {
  [key: string]: {
    sign: string;
    degree: number;
  };
};

export type Aspects = {
  [key: string]: {
    target: string;
    type: string;
    orb: number;
  };
};

export type ChartData = {
  ascendant: string;
  sun_sign: string;
  moon_sign: string;
  planets: Planets;
  houses: Houses;
  aspects: Aspects;
};

export interface DailyContent {
  date: string;
  dailyAffirmation: string;
  dailyChartInsight: string;
  keyTransits: Array<{
    transit: string;
    description: string;
  }>;
  exploreTopic: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  timezone: string;
}

export type BirthChart = {
  id: string;
  user: string;
  birth_data: BirthChartData;
  chart_data: ChartData;
  created_at: string; // datetime
};

export type Transit = {
  planet: string;
  aspect: string;
  target: string;
  description: string;
};

export type DailyTransits = {
  date: string;
  transits: Transit[];
};

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface BirthChartPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
}

export interface SimpleBirthChart {
  positions: BirthChartPosition[];
  aspects: {
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }[];
}
