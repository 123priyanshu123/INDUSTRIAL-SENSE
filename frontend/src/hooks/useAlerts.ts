import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alertService';
import { useAppStore } from '../store/appStore';

export function useAlerts() {
  const queryClient = useQueryClient();
  const acknowledgeAlertStore = useAppStore(state => state.acknowledgeAlert);
  const currentUser = useAppStore(state => state.currentUser);

  const query = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAlerts(),
    staleTime: 5000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: ({ alertId }: { alertId: string }) =>
      alertService.acknowledgeAlert(alertId, currentUser.name),
    onSuccess: (updatedAlert) => {
      acknowledgeAlertStore(updatedAlert.id, currentUser.name);
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    ...query,
    acknowledgeAlert: (alertId: string) => acknowledgeMutation.mutate({ alertId }),
    isAcknowledging: acknowledgeMutation.isPending,
  };
}
