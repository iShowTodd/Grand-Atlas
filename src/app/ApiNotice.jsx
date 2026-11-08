import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ApiNotice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    function handleUnauthorized() {
      setNotice("Your session has expired. Sign in again to continue.");
    }

    function handleServerError() {
      setNotice("The service is temporarily unavailable. Please try again.");
    }

    window.addEventListener("api:unauthorized", handleUnauthorized);
    window.addEventListener("api:server-error", handleServerError);

    return () => {
      window.removeEventListener("api:unauthorized", handleUnauthorized);
      window.removeEventListener("api:server-error", handleServerError);
    };
  }, []);

  if (!notice) return null;

  return (
    <div className="api-notice" role="alert">
      <p>{notice}</p>
      {notice.startsWith("Your session") && <Link to="/login">Sign in</Link>}
      <button type="button" onClick={() => setNotice(null)}>
        Dismiss
      </button>
    </div>
  );
}
