import { getApiErrorMessage } from "../../api/client";

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="data-state data-state-error" role="alert">
      <p>{getApiErrorMessage(error)}</p>
      {onRetry && (
        <button
          className="button button-outline"
          type="button"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
