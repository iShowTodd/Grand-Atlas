import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { normalizeProject, ProjectCard } from "../../projects";
import { useDeveloper } from "../hooks/useDevelopers";

export default function DeveloperProjectsPage() {
  const { id } = useParams();
  const query = useDeveloper(id);
  const [search, setSearch] = useState("");
  const developer = query.data;
  const projects = useMemo(
    () =>
      (developer?.projects ?? []).map((project) => normalizeProject(project)),
    [developer],
  );
  const visibleProjects = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return projects;

    return projects.filter((project) =>
      [project.name, project.description, project.zone?.name]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [projects, search]);
  const heroImage = developer?.images[0];

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>
          {developer ? `${developer.name} Projects` : "Developer Projects"}
        </title>
        <meta
          name="description"
          content={
            developer?.description ||
            "Explore real estate projects by Grand Atlas developers."
          }
        />
      </Helmet>
      <main className="developer-projects-page">
        {query.isLoading ? (
          <LoadingState label="Loading developer projects" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : !developer ? (
          <EmptyState title="Developer not found">
            This developer may have been removed.
          </EmptyState>
        ) : (
          <>
            <section className="developer-projects-hero">
              {heroImage && (
                <img
                  src={heroImage}
                  alt=""
                  width="1440"
                  height="589"
                  fetchPriority="high"
                />
              )}
              <div className="developers-hero-shade" />
              <div className="developers-hero-copy">
                <h1>{developer.name}</h1>
                <p>{developer.description}</p>
              </div>
            </section>
            <section className="developer-projects-results">
              <div className="developer-projects-heading">
                <h2>Developers Projects</h2>
                <Link to="/developers">All developers</Link>
              </div>
              {projects.length === 0 ? (
                <EmptyState title="No projects available">
                  This developer has no projects listed yet.
                </EmptyState>
              ) : (
                <>
                  <label className="projects-search">
                    <span>Search projects</span>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by project or zone"
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
                </>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
