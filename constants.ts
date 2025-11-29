import { Topic, VisualizationType, GeminiResponse } from './types';

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'ohm-law',
    name: "Ohm's Law",
    shortDescription: "The fundamental relationship between Voltage, Current, and Resistance.",
    icon: 'Zap',
    visType: VisualizationType.OHM_LAW
  },
  {
    id: 'ac-dc',
    name: "AC vs DC",
    shortDescription: "Understanding Alternating Current versus Direct Current systems.",
    icon: 'Activity',
    visType: VisualizationType.AC_WAVE
  },
  {
    id: 'capacitance',
    name: "Capacitor Charging",
    shortDescription: "Energy storage in an electric field and RC time constants.",
    icon: 'BatteryCharging',
    visType: VisualizationType.RC_CIRCUIT
  },
  {
    id: 'power',
    name: "Electric Power",
    shortDescription: "Rate of electrical energy transfer in a circuit.",
    icon: 'Lightbulb',
    visType: VisualizationType.OHM_LAW 
  },
  {
    id: 'inductor',
    name: "Inductance",
    shortDescription: "Resistance to change in current flow and magnetic field storage.",
    icon: 'Magnet',
    visType: VisualizationType.AC_WAVE 
  },
  // New Complex Concepts
  {
    id: 'maxwell',
    name: "Maxwell's Equations",
    shortDescription: "The four fundamental equations describing classical electromagnetism.",
    icon: 'Radio',
    visType: VisualizationType.GENERIC
  },
  {
    id: 'three-phase',
    name: "Three-Phase Power",
    shortDescription: "Polyphase systems used for efficient industrial power distribution.",
    icon: 'Network',
    visType: VisualizationType.AC_WAVE
  },
  {
    id: 'op-amp',
    name: "Operational Amplifiers",
    shortDescription: "High-gain voltage amplifiers essential for analog signal processing.",
    icon: 'Triangle',
    visType: VisualizationType.GENERIC
  },
  {
    id: 'fourier',
    name: "Fourier Analysis",
    shortDescription: "Decomposing complex signals into sums of simple sine waves.",
    icon: 'Waves',
    visType: VisualizationType.AC_WAVE
  },
  {
    id: 'semiconductors',
    name: "PN Junctions",
    shortDescription: "The physics behind diodes and transistors in semiconductors.",
    icon: 'Cpu',
    visType: VisualizationType.GENERIC
  }
];

export const MOCK_GEMINI_DATA: GeminiResponse = {
  summary: "This is a placeholder summary generated because live AI data might be pending.",
  formula_latex: "V = I \\times R",
  real_world_analogy: "Think of voltage as water pressure, current as water flow, and resistance as the pipe size.",
  practical_application: "Used in almost every electronic device to manage current.",
  fun_fact: "George Ohm was initially ridiculed for his theory!",
  related_concepts: ["Kirchhoff's Laws", "Electrical Power", "Resistivity"],
  youtube_queries: [
    { title: "Ohm's Law explained simply", language: "English" },
    { title: "Ohm's Law tutorial physics", language: "English" },
    { title: "Ohm's Law explanation in Hindi", language: "Hindi" },
    { title: "Voltage Current Resistance Hindi", language: "Hindi" }
  ]
};