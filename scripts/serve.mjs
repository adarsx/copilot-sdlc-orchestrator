import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const root = new URL("../", import.meta.url);
const files = new Map([
  ["/", new URL("index.html", root)],
  ["/index.html", new URL("index.html", root)],
  ["/styles.css", new URL("styles.css", root)],
  ["/src/app.mjs", new URL("src/app.mjs", root)],
  ["/src/tasks.mjs", new URL("src/tasks.mjs", root)],
]);
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
]);

const server = createServer((request, response) => {
  if (request.method !== "GET") {
    response.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    response.end("Method not allowed.");
    return;
  }

  const pathname = new URL(request.url || "/", "http://127.0.0.1").pathname;
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found.");
    return;
  }

  const extension = file.pathname.slice(file.pathname.lastIndexOf("."));
  readFile(file)
    .then((contents) => {
      response.writeHead(200, {
        "content-type": contentTypes.get(extension) || "application/octet-stream",
        "x-content-type-options": "nosniff",
      });
      response.end(contents);
    })
    .catch((error) => {
      if (error.code === "ENOENT") {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("Not found.");
        return;
      }

      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end("Unable to serve the requested app file.");
    });
});

server.listen(4173, "127.0.0.1", () => {
  console.log("Todo app available at http://127.0.0.1:4173");
});
