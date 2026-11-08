import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "./auth-context";
import { PageLoader } from "../components/ui/PageState";

const HomePage = lazy(() =>
  import("../features/home").then((feature) => ({ default: feature.HomePage })),
);
const ProjectsPage = lazy(() =>
  import("../features/projects").then((feature) => ({
    default: feature.ProjectsPage,
  })),
);
const ProjectDetailsPage = lazy(() =>
  import("../features/projects").then((feature) => ({
    default: feature.ProjectDetailsPage,
  })),
);
const DevelopersPage = lazy(() =>
  import("../features/developers").then((feature) => ({
    default: feature.DevelopersPage,
  })),
);
const DeveloperProjectsPage = lazy(() =>
  import("../features/developers").then((feature) => ({
    default: feature.DeveloperProjectsPage,
  })),
);
const ZonesPage = lazy(() =>
  import("../features/zones").then((feature) => ({
    default: feature.ZonesPage,
  })),
);
const ContactPage = lazy(() =>
  import("../features/contact").then((feature) => ({
    default: feature.ContactPage,
  })),
);
const MapPage = lazy(() =>
  import("../features/map").then((feature) => ({ default: feature.MapPage })),
);
const UnitsPage = lazy(() =>
  import("../features/units").then((feature) => ({
    default: feature.UnitsPage,
  })),
);
const UnitDetailsPage = lazy(() =>
  import("../features/units").then((feature) => ({
    default: feature.UnitDetailsPage,
  })),
);
const LoginPage = lazy(() =>
  import("../features/auth").then((feature) => ({
    default: feature.LoginPage,
  })),
);
const RegisterPage = lazy(() =>
  import("../features/auth").then((feature) => ({
    default: feature.RegisterPage,
  })),
);
const AdminLayout = lazy(() =>
  import("../features/admin").then((feature) => ({
    default: feature.AdminLayout,
  })),
);
const NotFoundPage = lazy(() => import("./NotFoundPage"));

function RequireAdmin({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    HydrateFallback: PageLoader,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: HomePage }),
      },
      {
        path: "units",
        lazy: async () => ({ Component: UnitsPage }),
      },
      {
        path: "units/:id",
        lazy: async () => ({ Component: UnitDetailsPage }),
      },
      {
        path: "projects",
        lazy: async () => ({ Component: ProjectsPage }),
      },
      {
        path: "projects/:id",
        lazy: async () => ({ Component: ProjectDetailsPage }),
      },
      {
        path: "developers",
        lazy: async () => ({ Component: DevelopersPage }),
      },
      {
        path: "developers/:id/projects",
        lazy: async () => ({ Component: DeveloperProjectsPage }),
      },
      {
        path: "zones",
        lazy: async () => ({ Component: ZonesPage }),
      },
      {
        path: "contact",
        lazy: async () => ({ Component: ContactPage }),
      },
      {
        path: "map",
        lazy: async () => ({ Component: MapPage }),
      },
      {
        path: "login",
        lazy: async () => ({ Component: LoginPage }),
      },
      {
        path: "register",
        lazy: async () => ({ Component: RegisterPage }),
      },
      {
        path: "admin",
        element: (
          <RequireAdmin>
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </RequireAdmin>
        ),
        children: [
          { index: true, element: <Navigate to="units" replace /> },
          {
            path: "units",
            lazy: async () => {
              const module = await import("../features/admin");
              return { Component: module.AdminUnitsPage };
            },
          },
          {
            path: "projects",
            lazy: async () => {
              const module = await import("../features/admin");
              return { Component: module.AdminProjectsPage };
            },
          },
          {
            path: "developers",
            lazy: async () => {
              const module = await import("../features/admin");
              return { Component: module.AdminDevelopersPage };
            },
          },
          {
            path: "zones",
            lazy: async () => {
              const module = await import("../features/admin");
              return { Component: module.AdminZonesPage };
            },
          },
          {
            path: "users",
            lazy: async () => ({
              Component: (await import("../features/admin")).AdminUsersPage,
            }),
          },
          {
            path: "images",
            lazy: async () => ({
              Component: (await import("../features/admin")).AdminImagesPage,
            }),
          },
        ],
      },
      {
        path: "*",
        lazy: async () => ({ Component: NotFoundPage }),
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
