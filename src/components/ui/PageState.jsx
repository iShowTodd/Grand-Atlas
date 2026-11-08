import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

export { EmptyState, ErrorState };

export function PageLoader({ label = "Loading page" }) {
  return (
    <div className="page-state page-state-loading" role="status">
      <span className="loading-indicator" />
      <span>{label}…</span>
    </div>
  );
}

export function LoadingState({ label = "Loading" }) {
  return (
    <div className="data-state" role="status">
      <span className="loading-indicator" />
      <span>{label}…</span>
    </div>
  );
}
