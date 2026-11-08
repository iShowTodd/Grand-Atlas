import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import { useDevelopers } from "../hooks/useDevelopers";
import DeveloperCard from "../components/DeveloperCard";

const pageIntroduction =
  "Great developments require more than just capital; they require a narrative. We provide the elite marketing and specialized brokerage services needed to position your landmark projects in front of the world’s most discerning buyers.";
const emptyDevelopers = [];

export default function DevelopersPage() {
  const query = useDevelopers();
  const [search, setSearch] = useState("");
  const developers = query.data ?? emptyDevelopers;
  const heroImage = developers.find((developer) => developer.images[0])
    ?.images[0];
  const visibleDevelopers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return developers;

    return developers.filter((developer) =>
      [developer.name, developer.description]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }, [developers, search]);

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Developers</title>
        <meta
          name="description"
          content="Meet the real estate developers behind Grand Atlas destinations."
        />
      </Helmet>
      <main className="developers-page">
        <section className="developers-hero">
          {heroImage && (
            <img
              className="developers-hero-image"
              src={heroImage}
              alt=""
              width="1440"
              height="589"
              fetchPriority="high"
            />
          )}
          <div className="developers-hero-shade" />
          <div className="developers-hero-copy">
            <h1>Defining the Future Skyline.</h1>
            <p>{pageIntroduction}</p>
          </div>
        </section>
        {query.isLoading ? (
          <LoadingState label="Loading developers" />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : query.data.length === 0 ? (
          <EmptyState title="No developers available">
            Developer profiles will appear here when they are listed.
          </EmptyState>
        ) : (
          <section className="developers-results" aria-label="Developers">
            <label className="projects-search">
              <span>Search developers</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search developer names"
              />
            </label>
            {visibleDevelopers.length === 0 ? (
              <EmptyState title="No matching developers">
                Try another search term.
              </EmptyState>
            ) : (
              <div className="developers-grid">
                {visibleDevelopers.map((developer) => (
                  <DeveloperCard key={developer.id} developer={developer} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
