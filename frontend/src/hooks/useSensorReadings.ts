import { useQuery } from '@tanstack/react-query';
import { sensorService } from '../services/sensorService';

export function useSensorReadings(machineId: string) {
  return useQuery({
    queryKey: ['readings', machineId],
    queryFn: () => sensorService.getLatestReadings(machineId),
    enabled: Boolean(machineId),
    refetchInterval: 3000,
  });
}

export function useSensorHistory(machineId: string, range = '24h') {
  return useQuery({
    queryKey: ['history', machineId, range],
    queryFn: () => sensorService.getHistoricalSeries(machineId, range),
    enabled: Boolean(machineId),
    staleTime: 15000,
  });
}
