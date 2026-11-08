import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Page not found</title>
        <meta
          name="description"
          content="The page you are looking for could not be found."
        />
      </Helmet>
      <main className="auth-page">
        <section className="auth-card">
          <span className="eyebrow">404</span>
          <h1>Page not found</h1>
          <p>The page may have moved or is no longer available.</p>
          <Link className="button" to="/">
            Return home
          </Link>
        </section>
      </main>
    </>
  );
}
