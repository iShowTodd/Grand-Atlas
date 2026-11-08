import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUnit,
  deleteUnit,
  fetchUnit,
  fetchUnits,
  updateUnit,
} from "../api/unitsApi";

export function useUnits(filters = {}) {
  return useQuery({
    queryKey: ["units", filters],
    queryFn: () => fetchUnits(filters),
  });
}

export function useUnit(id) {
  return useQuery({
    queryKey: ["units", id],
    queryFn: () => fetchUnit(id),
    enabled: Boolean(id),
  });
}

export function useUnitMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["units"] });

  return {
    create: useMutation({ mutationFn: createUnit, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateUnit, onSuccess: invalidate }),
    remove: useMutation({
      mutationFn: deleteUnit,
      onSuccess: invalidate,
    }),
  };
}
