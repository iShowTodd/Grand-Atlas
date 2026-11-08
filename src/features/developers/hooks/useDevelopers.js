import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeveloper,
  deleteDeveloper,
  fetchDeveloper,
  fetchDevelopers,
  updateDeveloper,
} from "../api/developersApi";

export function useDevelopers() {
  return useQuery({
    queryKey: ["developers"],
    queryFn: fetchDevelopers,
  });
}

export function useDeveloper(id) {
  return useQuery({
    queryKey: ["developers", id],
    queryFn: () => fetchDeveloper(id),
    enabled: Boolean(id),
  });
}

export function useDeveloperMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
      queryClient.invalidateQueries({ queryKey: ["units"] }),
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
    ]);

  return {
    create: useMutation({ mutationFn: createDeveloper, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateDeveloper, onSuccess: invalidate }),
    remove: useMutation({
      mutationFn: deleteDeveloper,
      onSuccess: invalidate,
    }),
  };
}
