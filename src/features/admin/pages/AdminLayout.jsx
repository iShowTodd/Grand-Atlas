import { Helmet } from "react-helmet-async";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/auth-context";

const links = [
  ["units", "Units"],
  ["projects", "Projects"],
  ["developers", "Developers"],
  ["zones", "Zones"],
  ["users", "Users"],
  ["images", "Image library"],
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "ADMIN") return <Navigate to="/" replace />;

  return (
    <>
      <Helmet titleTemplate="%s | Grand Atlas">
        <title>Administration</title>
        <meta
          name="description"
          content="Manage Grand Atlas listings, projects, developers, zones, users, and images."
        />
      </Helmet>
      <main className="admin-page">
        <div className="admin-heading">
          <span className="eyebrow">Grand Atlas</span>
          <h1>Administration</h1>
        </div>
        <nav className="admin-nav" aria-label="Administration">
          {links.map(([path, label]) => (
            <Link
              className={
                location.pathname.endsWith(path) ? "admin-nav-active" : ""
              }
              key={path}
              to={`/admin/${path}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Outlet />
      </main>
    </>
  );
}
