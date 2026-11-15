import { useQuery } from '@tanstack/react-query';
import { machineService } from '../services/machineService';

export function useMachines() {
  return useQuery({
    queryKey: ['machines'],
    queryFn: () => machineService.getMachines(),
    staleTime: 10000,
  });
}
