import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import fs from "fs-extra";
import { resolve } from "path";

const path = require("path");
const glob = require("glob");

const folder = {
  src: "src/", // source files
  src_assets: "src/assets/", // source assets files
  dist: "dist/", // build files
  dist_assets: "dist/assets/", //build assets files
};

function instagramLatestFeedPlugin() {
  const IG_MOBILE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

  const attachMiddleware = (middlewares) => {
    middlewares.use(async (req, res, next) => {
      try {
        const parsedUrl = new URL(req.url || "/", "http://localhost");

        if (parsedUrl.pathname === "/api/instagram-image") {
          const targetUrl = parsedUrl.searchParams.get("url");
          if (!targetUrl || !/^https:\/\/[a-z0-9.-]+\.(fbcdn\.net|cdninstagram\.com)\//i.test(targetUrl)) {
            res.statusCode = 400;
            res.end("Invalid image URL");
            return;
          }
          const imgRes = await fetch(targetUrl, {
            headers: { "User-Agent": IG_MOBILE_UA },
          });
          if (!imgRes.ok) {
            res.statusCode = imgRes.status;
            res.end("Failed to fetch image");
            return;
          }
          const buf = Buffer.from(await imgRes.arrayBuffer());
          res.setHeader("Content-Type", imgRes.headers.get("content-type") || "image/jpeg");
          res.setHeader("Cache-Control", "public, max-age=300");
          res.end(buf);
          return;
        }

        if (parsedUrl.pathname === "/api/instagram-latest") {
          const username = (parsedUrl.searchParams.get("username") || "oora_labz").replace(/[^a-zA-Z0-9._]/g, "");
          const embedRes = await fetch(`https://www.instagram.com/${username}/embed/`, {
            headers: {
              "User-Agent": IG_MOBILE_UA,
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
            },
          });

          if (!embedRes.ok) {
            throw new Error(`Instagram embed returned HTTP ${embedRes.status}`);
          }

          const html = await embedRes.text();
          const match = html.match(/"contextJSON"\s*:\s*("(?:\\.|[^"\\])*")/);
          if (!match) {
            throw new Error("contextJSON not found in Instagram embed response");
          }

          const data = JSON.parse(JSON.parse(match[1]));
          const mediaItems = (data.context?.graphql_media || [])
            .map((item) => item.shortcode_media)
            .filter(Boolean)
            .sort((a, b) => (b.taken_at_timestamp || 0) - (a.taken_at_timestamp || 0));

          const latest = mediaItems[0];
          if (!latest) {
            throw new Error("No public posts found on Instagram profile");
          }

          const captionText =
            latest.edge_media_to_caption?.edges?.[0]?.node?.text ||
            latest.caption ||
            "";
          const directMediaUrl =
            latest.display_url ||
            latest.thumbnail_src ||
            (Array.isArray(latest.display_resources) && latest.display_resources[latest.display_resources.length - 1]?.src) ||
            "";

          const payload = {
            username,
            shortcode: latest.shortcode,
            permalink: `https://www.instagram.com/p/${latest.shortcode}/`,
            mediaUrl: directMediaUrl
              ? `/api/instagram-image?url=${encodeURIComponent(directMediaUrl)}`
              : "",
            directMediaUrl,
            caption: captionText,
            likes: typeof latest.edge_liked_by?.count === "number" ? latest.edge_liked_by.count : 0,
            comments: typeof latest.edge_media_to_comment?.count === "number" ? latest.edge_media_to_comment.count : 0,
            timestamp: latest.taken_at_timestamp ? latest.taken_at_timestamp * 1000 : null,
            isVideo: Boolean(latest.is_video),
          };

          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store, max-age=0");
          res.end(JSON.stringify(payload));
          return;
        }
      } catch (err) {
        if (req.url && req.url.startsWith("/api/instagram-")) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: err.message || "Instagram fetch error" }));
          return;
        }
      }
      next();
    });
  };

  return {
    name: "instagram-latest-feed",
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}

function cleanUrlsPlugin() {
  const attachMiddleware = (middlewares) => {
    middlewares.use((req, res, next) => {
      try {
        const parsedUrl = new URL(req.url || "/", "http://localhost");
        const pathname = parsedUrl.pathname;

        // Skip assets, vite internal endpoints, and APIs
        if (
          pathname.startsWith("/@") ||
          pathname.startsWith("/assets/") ||
          pathname.startsWith("/api/") ||
          pathname.startsWith("/libs/")
        ) {
          return next();
        }

        // 1. Redirect /index.html -> /
        if (pathname === "/index.html") {
          res.statusCode = 301;
          res.setHeader("Location", "/" + (parsedUrl.search || ""));
          res.end();
          return;
        }

        // 2. Redirect /*.html -> /* (e.g. /services.html -> /services)
        if (pathname.endsWith(".html")) {
          const cleanPath = pathname.slice(0, -5);
          res.statusCode = 301;
          res.setHeader("Location", cleanPath + (parsedUrl.search || ""));
          res.end();
          return;
        }

        // 3. For extensionless paths, rewrite internally to matching HTML file
        if (!pathname.includes(".") && pathname !== "/") {
          const cleanName = pathname.replace(/^\/+|\/+$/g, "");
          let targetHtml = path.resolve(__dirname, folder.src, `${cleanName}.html`);
          if (cleanName === "about") {
            targetHtml = path.resolve(__dirname, folder.src, "about-contact.html");
          }
          if (fs.existsSync(targetHtml)) {
            const htmlFileName = path.basename(targetHtml);
            req.url = `/${htmlFileName}` + (parsedUrl.search || "");
          }
        }
      } catch (err) {
        console.error("Clean URLs middleware error:", err);
      }
      next();
    });
  };

  return {
    name: "clean-urls-plugin",
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, folder.src),
    }),
    instagramLatestFeedPlugin(),
    cleanUrlsPlugin(),
  ],
  base: "",
  // logLevel: 'error', // if you want to disable logging use 'info' | 'warn' | 'error' | 'silent'
  clearScreen: true,
  envDir: path.resolve(__dirname),
  root: path.resolve(__dirname, folder.src),
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    // watch: {},  // if you want to watch your build files
    rollupOptions: {
      manualChunks: undefined,
      input: {
        tailwind: folder.src_assets + "scss/tailwind.scss",
        ...generateHtmlEntries(),
      },
      output: {
        // assetFileNames: (css) => {
        //   if (css.name.split(".").pop() == "css") {
        //     return "assets/css/" + `[name]` + ".css";
        //   } else if (
        //     /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(css.name.split(".").pop())
        //   ) {
        //     return "assets/images/" + css.name;
        //   } else {
        //     return "assets/css/" + css.name;
        //   }
        // },
        // entryFileNames: "assets/js/" + `[name]` + `.js`,
      },
      external: [
        // Add any other external dependencies here
        /^assets\/libs\//, // This regex matches the external import path
        "/swiper", // Add Swiper as external
      ],
      plugins: [
        // ...other plugins
        require("rollup-plugin-copy")({
          targets: [
            { src: folder.src_assets + "images", dest: folder.dist_assets },
            { src: folder.src_assets + "js", dest: folder.dist_assets },
            { src: folder.src_assets + "php", dest: folder.dist_assets },
            { src: folder.src + "robots.txt", dest: folder.dist },
            { src: folder.src + "sitemap.xml", dest: folder.dist },
            { src: folder.src + ".htaccess", dest: folder.dist },
            { src: folder.src + "_redirects", dest: folder.dist },
            { src: folder.src + "vercel.json", dest: folder.dist },
          ],
        }),
        {
          name: "copy-specific-packages",
          async writeBundle() {
            const outputPath = path.resolve(__dirname, folder.dist_assets); // Adjust the destination path
            const outputPathSrc = path.resolve(__dirname, folder.src_assets); // Adjust the destination path
            const configPath = path.resolve(
              __dirname,
              "package-libs-config.json"
            );

            try {
              const configContent = await fs.readFile(configPath, "utf-8");
              const { packagesToCopy } = JSON.parse(configContent);

              for (const packageName of packagesToCopy) {
                const destPackagePath = path.join(
                  outputPath,
                  "libs",
                  packageName
                );
                const destPackagePathSrc = path.join(
                  outputPathSrc,
                  "libs",
                  packageName
                );

                const sourcePath = fs.existsSync(
                  path.join(__dirname, "node_modules", packageName + "/dist")
                )
                  ? path.join(__dirname, "node_modules", packageName + "/dist")
                  : path.join(__dirname, "node_modules", packageName);

                try {
                  await fs.access(sourcePath, fs.constants.F_OK);
                  await fs.copy(sourcePath, destPackagePath);
                  await fs.copy(sourcePath, destPackagePathSrc);
                } catch (error) {
                  console.error(`Package ${packageName} does not exist.`);
                }
              }
            } catch (error) {
              console.error("Error copying and renaming packages:", error);
            }
          },
        },
      ],
    },
  },
  publicDir: "dist",
  server: {
    port: 8080,
    hot: true,
    open: "/",
  },
});

function generateHtmlEntries() {
  const entries = {};

  // Modify the glob pattern to match your HTML file location
  const htmlFiles = glob.sync("src/*.html");
  htmlFiles.forEach((file) => {
    const name = file.replace("src/", "").replace(".html", "");
    entries[name] = file;
  });

  return entries;
}
