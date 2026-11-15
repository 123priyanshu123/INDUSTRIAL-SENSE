import { useQuery } from '@tanstack/react-query';
import { machineService } from '../services/machineService';

export function useMachineDetails(machineId: string) {
  return useQuery({
    queryKey: ['machine', machineId],
    queryFn: () => machineService.getMachineById(machineId),
    enabled: Boolean(machineId),
    staleTime: 5000,
  });
}
