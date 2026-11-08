import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";

const emptyProjects = [];

export default function ProjectsPage() {
  const query = useProjects();
  const [search, setSearch] = useState("");
  const projects = query.data ?? emptyProjects;
  const heroImage = projects.find((project) => project.images[0])?.images[0];
  const visibleProjects = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return projects;

    return projects.filter((project) =>
      [
        project.name,
        project.description,
        project.zone?.name,
        project.developer?.name,
      ]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [projects, search]);

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Projects</title>
        <meta
          name="description"
          content="Explore Grand Atlas real estate projects and developments."
        />
      </Helmet>
      <main className="projects-page">
        <header className="projects-page-heading">
          <h1>Zone Projects</h1>
          <span aria-hidden="true" />
        </header>
        {query.isLoading ? (
          <LoadingState label="Loading projects" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : query.data.length === 0 ? (
          <EmptyState title="No projects available">
            Projects will appear here when they are listed.
          </EmptyState>
        ) : (
          <>
            {heroImage && (
              <img
                className="projects-page-hero"
                src={heroImage}
                alt=""
                width="1367"
                height="525"
                fetchPriority="high"
              />
            )}
            <section className="projects-results" aria-label="Projects">
              <label className="projects-search">
                <span>Search projects</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by project, zone, or developer"
                />
              </label>
              {visibleProjects.length === 0 ? (
                <EmptyState title="No matching projects">
                  Try another search term.
                </EmptyState>
              ) : (
                <div className="landmark-grid">
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
