import { Elysia } from "elysia";
import { env } from "./utils/env";
import { folderRoutes } from "./routes/folder.route";
import { fileRoutes } from "./routes/file.route";

const app = new Elysia()
  .onError(({ code, error, set }) => {
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return { success: false, message: "Route not found" };

      case "VALIDATION":
      case "PARSE":
        set.status = 400;
        return { success: false, message: "Validation Error", error };

      default:
        set.status = 500;
        return { success: false, message: "Internal Server Error", error };
    }
  })
  .group("/v1", (app) => app.use(folderRoutes).use(fileRoutes))
  .get("/", () => ({
    message: "API running",
    routes: ["/v1/folders", "/v1/folders/tree", "/v1/files"],
  }))
  .listen(env.PORT);

app.onStart(() => {
  console.log(`Running at http://localhost:${env.PORT}`);
});
