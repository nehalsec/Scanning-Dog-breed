
export interface BreedComponent {
  name: string;
  percentage: number;
}

export interface BreedDetails {
  origin: string;
  temperament: string;
  lifespan: string;
  sizeAndWeight: string;
  commonTraits: string;
  interestingFact: string;
}

export interface AnalysisResult {
  isDog: boolean;
  breeds: BreedComponent[];
  details: BreedDetails;
}

export interface ScanHistoryItem {
  id: string;
  imageUrl: string;
  result: AnalysisResult;
}

export interface GeminiAnalysisResult {
    isDog: boolean;
    breeds: BreedComponent[];
    interestingFact: string;
}
