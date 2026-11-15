export function formatReading(value: number | null | undefined, unit = '', decimals = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }
  return `${value.toFixed(decimals)} ${unit}`.trim();
}

export function formatFrequencyBand(hz: number): string {
  if (hz >= 1000) {
    return `${(hz / 1000).toFixed(1)} kHz`;
  }
  return `${hz} Hz`;
}
