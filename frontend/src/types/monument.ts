export interface Monument {
  id: number;
  name: string;
  location: string;
  state: string;
  description: string;
  historicalContext: string;
  architecturalStyle: string;
  builtPeriod: string;
  architect?: string | null;
  latitude: string; // If Django returns DecimalField as string
  longitude: string;
  imageUrl: string;
  category: string;
  unescoSite: boolean;
  rating: string;
  visitingHours?: string | null;
  entryFee?: string | null;
  bestTimeToVisit?: string | null;
  createdAt: string;
}

export interface FavoriteResponse {
  id: number;
  monument: Monument;
}

export interface IdentificationResponse {
  id: number;
  monument: Monument;
  confidence: number;
}
