export interface ModelMetrics {
  roc_auc: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export interface ConfusionMatrixData {
  trueHealthy: number;
  falseAnomaly: number;
  falseHealthy: number;
  trueAnomaly: number;
  total: number;
}

export interface FaultClassDistribution {
  faultClass: string;
  label: string;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
  isAnomaly: boolean;
  color: string;
}

export interface SampleInference {
  filename: string;
  status: string;
  is_anomaly: boolean;
  anomaly_score: number;
  threshold: number;
  health_index: number;
  estimated_rpm: number;
  fault_type: string;
  top_contributing_features: Array<{ feature: string; error: number }>;
  window_scores: number[];
}

export const MAFAULDA_MODEL_METADATA = {
  model_version: 'v0.1.0-alpha',
  dataset: 'MAFAULDA (vuxuancu/mafaulda-full)',
  model_name: 'IndustrialSense Unsupervised Autoencoder',
  architecture: 'PyTorch MLP [42 -> 64 -> 32 -> 12 (Latent) -> 32 -> 64 -> 42]',
  activation: 'LeakyReLU(0.1) + BatchNorm1d + Dropout(0.1)',
  input_dim: 42,
  latent_dim: 12,
  anomaly_threshold_mse: 0.12216226756572723,
  metrics: {
    roc_auc: 0.9993,
    precision: 0.9897,
    recall: 1.0,
    f1_score: 0.9948,
  } as ModelMetrics,
  confusion_matrix: {
    trueHealthy: 87,
    falseAnomaly: 21,
    falseHealthy: 0,
    trueAnomaly: 2025,
    total: 2133,
  } as ConfusionMatrixData,
  feature_columns: [
    'rpm',
    'vib_x_rms',
    'vib_x_kurtosis',
    'vib_x_crest',
    'vib_x_skew',
    'vib_x_centroid',
    'vib_x_entropy',
    'vib_x_e_low',
    'vib_x_e_mid',
    'vib_x_e_high',
    'vib_y_rms',
    'vib_y_kurtosis',
    'vib_y_crest',
    'vib_y_skew',
    'vib_y_centroid',
    'vib_y_entropy',
    'vib_y_e_low',
    'vib_y_e_mid',
    'vib_y_e_high',
    'vib_z_rms',
    'vib_z_kurtosis',
    'vib_z_crest',
    'vib_z_skew',
    'vib_z_centroid',
    'vib_z_entropy',
    'vib_z_e_low',
    'vib_z_e_mid',
    'vib_z_e_high',
    'aud_mfcc_0',
    'aud_mfcc_1',
    'aud_mfcc_2',
    'aud_mfcc_3',
    'aud_mfcc_4',
    'aud_mfcc_5',
    'aud_mfcc_6',
    'aud_mfcc_7',
    'aud_mfcc_8',
    'aud_mfcc_9',
    'aud_mfcc_10',
    'aud_mfcc_11',
    'aud_mfcc_12',
    'aud_rms',
  ],
  feature_domains: {
    tachometer: ['rpm'],
    vibration_x: [
      'vib_x_rms', 'vib_x_kurtosis', 'vib_x_crest', 'vib_x_skew',
      'vib_x_centroid', 'vib_x_entropy', 'vib_x_e_low', 'vib_x_e_mid', 'vib_x_e_high'
    ],
    vibration_y: [
      'vib_y_rms', 'vib_y_kurtosis', 'vib_y_crest', 'vib_y_skew',
      'vib_y_centroid', 'vib_y_entropy', 'vib_y_e_low', 'vib_y_e_mid', 'vib_y_e_high'
    ],
    vibration_z: [
      'vib_z_rms', 'vib_z_kurtosis', 'vib_z_crest', 'vib_z_skew',
      'vib_z_centroid', 'vib_z_entropy', 'vib_z_e_low', 'vib_z_e_mid', 'vib_z_e_high'
    ],
    acoustic_mfcc: [
      'aud_mfcc_0', 'aud_mfcc_1', 'aud_mfcc_2', 'aud_mfcc_3', 'aud_mfcc_4',
      'aud_mfcc_5', 'aud_mfcc_6', 'aud_mfcc_7', 'aud_mfcc_8', 'aud_mfcc_9',
      'aud_mfcc_10', 'aud_mfcc_11', 'aud_mfcc_12'
    ],
    acoustic_rms: ['aud_rms'],
  },
  fault_distributions: [
    {
      faultClass: 'normal',
      label: 'Normal (Healthy Baseline)',
      median: 0.076,
      q1: 0.048,
      q3: 0.098,
      min: 0.024,
      max: 0.28,
      isAnomaly: false,
      color: '#10b981',
    },
    {
      faultClass: 'horizontal_misalignment',
      label: 'Horizontal Misalignment',
      median: 2.85,
      q1: 1.82,
      q3: 4.90,
      min: 0.35,
      max: 8.5,
      isAnomaly: true,
      color: '#3b82f6',
    },
    {
      faultClass: 'imbalance',
      label: 'Rotor Mass Imbalance',
      median: 6.20,
      q1: 2.10,
      q3: 15.4,
      min: 0.13,
      max: 148.0,
      isAnomaly: true,
      color: '#06b6d4',
    },
    {
      faultClass: 'overhang_bearing',
      label: 'Overhang Bearing Fault',
      median: 7.15,
      q1: 1.85,
      q3: 1380.0,
      min: 0.18,
      max: 480000.0,
      isAnomaly: true,
      color: '#14b8a6',
    },
    {
      faultClass: 'underhang_bearing',
      label: 'Underhang Bearing Fault',
      median: 14.2,
      q1: 1.76,
      q3: 260.0,
      min: 0.62,
      max: 7850.0,
      isAnomaly: true,
      color: '#84cc16',
    },
    {
      faultClass: 'vertical_misalignment',
      label: 'Vertical Misalignment',
      median: 2.40,
      q1: 1.12,
      q3: 3.80,
      min: 0.22,
      max: 5.8,
      isAnomaly: true,
      color: '#a3e635',
    },
  ] as FaultClassDistribution[],
};

export const SAMPLE_IMBALANCE_INFERENCE: SampleInference = {
  filename: 'sample_imbalance.csv',
  status: 'ANOMALY_DETECTED',
  is_anomaly: true,
  anomaly_score: 0.4891,
  threshold: 0.1222,
  health_index: 13.5,
  estimated_rpm: 1802.4,
  fault_type: 'Rotor Mass Imbalance (Overhang / Spindle)',
  top_contributing_features: [
    { feature: 'vib_x_rms', error: 1.842 },
    { feature: 'vib_y_kurtosis', error: 1.215 },
    { feature: 'vib_x_peak_to_peak', error: 0.983 },
    { feature: 'aud_mfcc_1', error: 0.612 },
    { feature: 'vib_z_rms', error: 0.44 },
  ],
  window_scores: [0.461, 0.489, 0.512, 0.494],
};

export const SAMPLE_HEALTHY_INFERENCE: SampleInference = {
  filename: 'normal_sample_1s.csv',
  status: 'NORMAL_OPERATION',
  is_anomaly: false,
  anomaly_score: 0.0841,
  threshold: 0.1222,
  health_index: 96.8,
  estimated_rpm: 1798.5,
  fault_type: 'Baseline Healthy State',
  top_contributing_features: [
    { feature: 'vib_x_rms', error: 0.041 },
    { feature: 'aud_rms', error: 0.038 },
    { feature: 'vib_y_rms', error: 0.035 },
    { feature: 'vib_z_rms', error: 0.029 },
    { feature: 'aud_mfcc_0', error: 0.025 },
  ],
  window_scores: [0.081, 0.084, 0.086, 0.083],
};
