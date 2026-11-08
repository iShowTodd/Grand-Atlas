import { writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const root = process.cwd();
const siteUrlValue = loadEnv("production", root, "").VITE_SITE_URL?.trim();

if (!siteUrlValue) {
  throw new Error("VITE_SITE_URL is required to generate the sitemap.");
}

const siteUrl = new URL(siteUrlValue).toString().replace(/\/+$/, "");
const publicRoutes = [
  "/",
  "/units",
  "/projects",
  "/developers",
  "/zones",
  "/contact",
  "/map",
];
const entries = publicRoutes
  .map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`)
  .join("\n");
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries,
  "</urlset>",
  "",
].join("\n");
const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /admin/",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

await Promise.all([
  writeFile(path.join(root, "public", "sitemap.xml"), sitemap),
  writeFile(path.join(root, "public", "robots.txt"), robots),
]);
