import AdminResourceManager from "../components/AdminResourceManager";
import { useDevelopers, useDeveloperMutations } from "../../developers";
import { useProjects, useProjectMutations } from "../../projects";
import { useUnitMutations, useUnits } from "../../units";
import { useZoneMutations, useZones } from "../../zones";

export function AdminUnitsPage() {
  const query = useUnits();
  const mutations = useUnitMutations();
  const projects = useProjects();
  return (
    <>
      {projects.isError && (
        <p role="alert">Project options: {projects.error.message}</p>
      )}
      <AdminResourceManager
        resource="units"
        title="Units"
        query={query}
        mutations={mutations}
        relatedOptions={{ projects }}
      />
    </>
  );
}

export function AdminProjectsPage() {
  const query = useProjects();
  const mutations = useProjectMutations();
  const developers = useDevelopers();
  const zones = useZones();
  return (
    <>
      {developers.isError && (
        <p role="alert">Developer options: {developers.error.message}</p>
      )}
      {zones.isError && <p role="alert">Zone options: {zones.error.message}</p>}
      <AdminResourceManager
        resource="projects"
        title="Projects"
        query={query}
        mutations={mutations}
        relatedOptions={{ developers, zones }}
      />
    </>
  );
}

export function AdminDevelopersPage() {
  const query = useDevelopers();
  const mutations = useDeveloperMutations();
  return (
    <AdminResourceManager
      resource="developers"
      title="Developers"
      query={query}
      mutations={mutations}
    />
  );
}

export function AdminZonesPage() {
  const query = useZones();
  const mutations = useZoneMutations();
  return (
    <AdminResourceManager
      resource="zones"
      title="Zones"
      query={query}
      mutations={mutations}
    />
  );
}
