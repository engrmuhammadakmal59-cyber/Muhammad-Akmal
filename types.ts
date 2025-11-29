export interface ConceptData {
  id: string;
  title: string;
  summary: string;
  formula: string;
  analogy: string;
  application: string;
}

export enum VisualizationType {
  OHM_LAW = 'OHM_LAW',
  AC_WAVE = 'AC_WAVE',
  RC_CIRCUIT = 'RC_CIRCUIT',
  GENERIC = 'GENERIC'
}

export interface Topic {
  id: string;
  name: string;
  shortDescription: string;
  icon: string; // Lucide icon name or generic identifier
  visType: VisualizationType;
}

export interface YouTubeRecommendation {
  title: string;
  language: 'English' | 'Hindi';
}

export interface GeminiResponse {
  summary: string;
  formula_latex: string;
  real_world_analogy: string;
  practical_application: string;
  fun_fact: string;
  related_concepts: string[];
  youtube_queries: YouTubeRecommendation[];
}