export interface BiasIssue {
  category: 'Gender' | 'Region' | 'Caste/Community' | 'Language' | 'Other';
  severity: 'Low' | 'Medium' | 'High';
  originalText: string;
  reason: string;
  suggestion: string;
}

export interface CounterfactualScenario {
  variable: string;
  original: string;
  simulated: string;
  impact: string;
}

export interface AnalysisResult {
  fairnessScore: number;
  summary: string;
  biases: BiasIssue[];
  rewrittenResume: string;
  counterfactuals: CounterfactualScenario[];
}

export enum AppState {
  LANDING = 'LANDING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}

