import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createZone,
  deleteZone,
  fetchZones,
  updateZone,
} from "../api/zonesApi";

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: fetchZones,
  });
}

export function useZoneMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["zones"] }),
      queryClient.invalidateQueries({ queryKey: ["units"] }),
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
    ]);

  return {
    create: useMutation({ mutationFn: createZone, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateZone, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteZone, onSuccess: invalidate }),
  };
}
