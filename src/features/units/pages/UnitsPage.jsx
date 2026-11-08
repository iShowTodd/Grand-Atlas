import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { SOCIAL_LINKS } from "../../../config/env";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../../components/ui/PageState";
import UnitCard from "../components/UnitCard";
import { useUnits } from "../hooks/useUnits";

const filtersSchema = z.object({
  search: z.string().trim().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minSize: z.string().optional(),
  maxSize: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  developerName: z.string().trim().optional(),
  zoneName: z.string().trim().optional(),
  projectName: z.string().trim().optional(),
  status: z.enum(["", "AVAILABLE", "SOLD", "RENTED"]),
  sort: z.enum(["asc", "desc"]),
});

function initialFilters(searchParams) {
  return {
    search: searchParams.get("search") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    minSize: searchParams.get("minSize") ?? "",
    maxSize: searchParams.get("maxSize") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    bathrooms: searchParams.get("bathrooms") ?? "",
    developerName: searchParams.get("developerName") ?? "",
    zoneName: searchParams.get("zoneName") ?? "",
    projectName: searchParams.get("projectName") ?? "",
    status: searchParams.get("status") ?? "",
    sort: searchParams.get("sort") === "desc" ? "desc" : "asc",
  };
}

function normalizeFilters(values) {
  const result = {};
  for (const [key, value] of Object.entries(values)) {
    const trimmed = typeof value === "string" ? value.trim() : value;
    if (trimmed !== "" && !(key === "sort" && trimmed === "asc")) {
      result[key] = trimmed;
    }
  }
  return result;
}

export default function UnitsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() =>
    normalizeFilters(initialFilters(searchParams)),
  );
  const query = useUnits(filters);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(filtersSchema),
    defaultValues: initialFilters(searchParams),
  });

  function applyFilters(values) {
    const normalized = normalizeFilters(values);
    setFilters(normalized);
    setSearchParams(normalized);
  }

  function clearFilters() {
    const defaults = initialFilters(new URLSearchParams());
    reset(defaults);
    setFilters({});
    setSearchParams({});
  }

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Residences</title>
        <meta
          name="description"
          content="Search Grand Atlas residences by location, price, size, rooms, status, project, or developer."
        />
      </Helmet>
      <main className="units-page">
        <section className="units-hero">
          <img
            src="/assets/hero.png"
            alt=""
            width="1164"
            height="750"
            fetchPriority="high"
          />
          <div className="units-hero-shade" />
          <div className="units-hero-copy">
            <h1>Where Visionary Design Meets Daily Life</h1>
            <p>
              Experience a collection of residences designed as personal
              sanctuaries. Each unit balances expansive city views with
              artisanal textures and quiet, light-filled interiors to create the
              ultimate retreat from the world.
            </p>
          </div>
          <div className="hero-socials" aria-label="Social media">
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook">
              <img
                src="/assets/icon-facebook.svg"
                alt=""
                width="30"
                height="30"
              />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram">
              <img
                src="/assets/icon-instagram.svg"
                alt=""
                width="30"
                height="30"
              />
            </a>
            <a href={SOCIAL_LINKS.tiktok} aria-label="TikTok">
              <img
                src="/assets/icon-tiktok.svg"
                alt=""
                width="28"
                height="28"
              />
            </a>
          </div>
        </section>
        <section className="residences listing-content">
          <form
            className="search-panel listing-filters"
            role="search"
            onSubmit={handleSubmit(applyFilters)}
          >
            <label className="search-field filter-wide">
              <span className="sr-only">Search residences</span>
              <input placeholder="Search residences" {...register("search")} />
            </label>
            <label className="filter-field">
              <span>Minimum price</span>
              <input type="number" min="0" {...register("minPrice")} />
            </label>
            <label className="filter-field">
              <span>Maximum price</span>
              <input type="number" min="0" {...register("maxPrice")} />
            </label>
            <label className="filter-field">
              <span>Minimum size (m²)</span>
              <input type="number" min="0" {...register("minSize")} />
            </label>
            <label className="filter-field">
              <span>Maximum size (m²)</span>
              <input type="number" min="0" {...register("maxSize")} />
            </label>
            <label className="filter-field">
              <span>Bedrooms</span>
              <input type="number" min="0" {...register("bedrooms")} />
            </label>
            <label className="filter-field">
              <span>Bathrooms</span>
              <input type="number" min="0" {...register("bathrooms")} />
            </label>
            <label className="filter-field">
              <span>Developer</span>
              <input {...register("developerName")} />
            </label>
            <label className="filter-field">
              <span>Zone</span>
              <input {...register("zoneName")} />
            </label>
            <label className="filter-field">
              <span>Project</span>
              <input {...register("projectName")} />
            </label>
            <label className="filter-field">
              <span>Status</span>
              <select {...register("status")}>
                <option value="">All statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Price order</span>
              <select {...register("sort")}>
                <option value="asc">Lowest first</option>
                <option value="desc">Highest first</option>
              </select>
            </label>
            <div className="filter-actions">
              <button className="button" type="submit">
                Search residences
              </button>
              <button
                className="button button-outline"
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          </form>
          <p className="listing-count" aria-live="polite">
            {query.isSuccess
              ? `${query.data.length} residences found`
              : "Search results"}
          </p>
          {query.isLoading ? (
            <LoadingState label="Loading residences" />
          ) : query.isError ? (
            <ErrorState error={query.error} onRetry={query.refetch} />
          ) : query.data.length === 0 ? (
            <EmptyState title="No residences found">
              Change your filters or clear them to see all available residences.
            </EmptyState>
          ) : (
            <div className="property-grid">
              {query.data.map((unit, index) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  index={index}
                  variant="catalog"
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
