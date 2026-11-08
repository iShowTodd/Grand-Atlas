import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  fetchProject,
  fetchProjects,
  updateProject,
} from "../api/projectsApi";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => fetchProject(id),
    enabled: Boolean(id),
  });
}

export function useProjectMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
      queryClient.invalidateQueries({ queryKey: ["units"] }),
    ]);

  return {
    create: useMutation({ mutationFn: createProject, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateProject, onSuccess: invalidate }),
    remove: useMutation({
      mutationFn: deleteProject,
      onSuccess: invalidate,
    }),
  };
}
