import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "../config/env";

export default function HelmetDefaults() {
  const location = useLocation();
  const canonicalUrl = SITE_URL
    ? new URL(location.pathname, `${SITE_URL}/`).toString()
    : undefined;
  const imageUrl = SITE_URL
    ? new URL("/assets/hero.png", `${SITE_URL}/`).toString()
    : "/assets/hero.png";

  return (
    <Helmet
      titleTemplate="%s | Grand Atlas"
      defaultTitle="Modern Luxury Living | Grand Atlas"
    >
      <meta
        name="description"
        content="Discover exceptional homes and landmark developments with Grand Atlas."
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Grand Atlas" />
      <meta property="og:title" content="Modern Luxury Living | Grand Atlas" />
      <meta
        property="og:description"
        content="Discover exceptional homes and landmark developments with Grand Atlas."
      />
      <meta property="og:image" content={imageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
    </Helmet>
  );
}
