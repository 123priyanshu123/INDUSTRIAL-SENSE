const API_BASE = "http://127.0.0.1:8000/api/v1";

export interface FeatureSchemaResponse {
  count: number;
  features: string[];
  default_values: Record<string, number>;
}

export interface TopContributor {
  feature: string;
  mse: number;
  input_value: number;
}

export interface PredictionResponse {
  machine_id: string;
  is_anomaly: boolean;
  severity: "normal" | "warning" | "critical";
  health_score: number;
  mse: number;
  anomaly_threshold_mse: number;
  anomaly_ratio: number;
  top_contributors: TopContributor[];
  recommendation: string;
  model_version: string;
}

export async function fetchFeatureSchema(): Promise<FeatureSchemaResponse> {
  const res = await fetch(`${API_BASE}/features`);
  if (!res.ok) {
    throw new Error("Failed to load feature schema");
  }
  return res.json();
}

export async function runPrediction(
  machineId: string,
  features: Record<string, number>
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      machine_id: machineId,
      features,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Prediction request failed");
  }
  return data;
}